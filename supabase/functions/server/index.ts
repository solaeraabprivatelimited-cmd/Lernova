import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { registerWebRTCRoutes } from "./webrtc.ts";

const app = new Hono();
app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "apikey"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const adminClient = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

// Middleware to validate API key or JWT
function validateAuth(c: any) {
  const authHeader = c.req.header("Authorization");
  const apiKey = c.req.header("apikey") || c.req.header("x-api-key");
  
  // Accept either Bearer JWT or API key
  if (!authHeader && !apiKey) {
    return { valid: false, reason: "Missing authorization" };
  }
  
  // Check if using API key
  if (apiKey) {
    // Accept any API key - validation happens at Supabase level
    return { valid: true, type: "apikey" };
  }
  
  // Check if using Bearer token (ES256 or HS256)
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      // Validate token format (3 parts separated by dots)
      const parts = token.split(".");
      if (parts.length !== 3) {
        return { valid: false, reason: "Invalid token format" };
      }
      
      // Decode payload to check claims (no signature verification needed for Edge Functions)
      let payload = parts[1];
      payload = payload.replace(/-/g, "+").replace(/_/g, "/");
      payload += "=".repeat((4 - (payload.length % 4)) % 4);
      
      const decoded = JSON.parse(atob(payload));
      
      // Check for required claims
      if (!decoded.sub && !decoded.user_id) {
        return { valid: false, reason: "Invalid token: no user ID" };
      }
      
      // Accept both ES256 and HS256 algorithms
      return { valid: true, type: "jwt", userId: decoded.sub || decoded.user_id };
    } catch (e) {
      console.error("[Auth] Token validation error:", e);
      return { valid: false, reason: "Invalid token" };
    }
  }
  
  return { valid: false, reason: "Invalid auth format" };
}

const genId = () => crypto.randomUUID();
const nowIso = () => new Date().toISOString();

function normalizeSubjects(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const cleaned = input
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0);
  return [...new Set(cleaned)];
}

async function syncProfileToDb(profile: any) {
  try {
    const supabase = adminClient();
    const subjects = normalizeSubjects(profile?.subjects);
    const payload = {
      id: profile.id,
      name: profile.name ?? "User",
      avatar_url: profile.avatar ?? profile.avatar_url ?? null,
      role: profile.role === "mentor" ? "mentor" : "student",
      bio: profile.bio ?? "",
    };

    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });
    if (profileErr) {
      console.log("DB profile sync error:", profileErr.message);
      return;
    }

    const { error: deleteErr } = await supabase
      .from("subjects")
      .delete()
      .eq("profile_id", profile.id);
    if (deleteErr) {
      console.log("DB subject cleanup error:", deleteErr.message);
      return;
    }

    if (subjects.length > 0) {
      const { error: insertErr } = await supabase
        .from("subjects")
        .insert(subjects.map((subject) => ({ profile_id: profile.id, subject })));
      if (insertErr) {
        console.log("DB subject insert error:", insertErr.message);
      }
    }
  } catch (e: any) {
    console.log("DB profile sync failed:", e.message);
  }
}

async function syncPublicUserToDb(user: {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
}) {
  try {
    const supabase = adminClient();
    const { error } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        email: user.email ?? "",
        name: user.name ?? "User",
        avatar_url: user.avatar_url ?? user.avatar ?? null,
        role: user.role === "mentor" ? "mentor" : "student",
        bio: user.bio ?? null,
        is_active: true,
        last_login_at: nowIso(),
      }, { onConflict: "id" });

    if (error) {
      console.log("DB users sync error:", error.message);
    }
  } catch (e: any) {
    console.log("DB users sync failed:", e.message);
  }
}

async function getProfileFromDb(userId: string) {
  try {
    const supabase = adminClient();
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, role, bio")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr || !profile) return null;

    const { data: subjectRows, error: subjectErr } = await supabase
      .from("subjects")
      .select("subject")
      .eq("profile_id", userId);
    if (subjectErr) {
      console.log("DB subject read error:", subjectErr.message);
    }

    const subjects = (subjectRows ?? []).map((row: any) => row.subject).filter(Boolean);
    return {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      avatar: profile.avatar_url,
      bio: profile.bio,
      subjects,
    };
  } catch (e: any) {
    console.log("DB profile read failed:", e.message);
    return null;
  }
}

async function getMentorsFromDb() {
  try {
    const supabase = adminClient();
    const { data: mentors, error: mentorsErr } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, bio")
      .eq("role", "mentor");

    if (mentorsErr) {
      console.log("DB mentors read error:", mentorsErr.message);
      return null;
    }

    const mentorIds = (mentors ?? []).map((m: any) => m.id);
    if (mentorIds.length === 0) return [];

    const { data: subjectRows, error: subjectErr } = await supabase
      .from("subjects")
      .select("profile_id, subject")
      .in("profile_id", mentorIds);
    if (subjectErr) {
      console.log("DB mentor subjects read error:", subjectErr.message);
    }

    const subjectMap = new Map<string, string[]>();
    for (const row of subjectRows ?? []) {
      const current = subjectMap.get(row.profile_id) ?? [];
      current.push(row.subject);
      subjectMap.set(row.profile_id, current);
    }

    return (mentors ?? []).map((m: any) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar_url,
      bio: m.bio ?? "",
      subjects: subjectMap.get(m.id) ?? [],
      rating: "5.0",
      studentsHelped: "0",
      experience: "New",
      hourlyRate: 0,
    }));
  } catch (e: any) {
    console.log("DB mentors read failed:", e.message);
    return null;
  }
}

/** Extract and verify the Bearer JWT, returns Supabase user */
async function getAuthUser(c: any): Promise<{ id: string; email: string; role?: string }> {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) throw new Error("Missing auth token");
  const { data, error } = await adminClient().auth.getUser(token);
  if (error || !data.user) throw new Error("Invalid or expired token");
  const profile = await kv.get(`user:${data.user.id}:profile`);

  // Keep relational `users` table in sync with authenticated users so
  // study room inserts don't fail on host_id/user_id foreign keys.
  try {
    const userName = profile?.name
      ?? data.user.user_metadata?.name
      ?? data.user.email?.split("@")[0]
      ?? "User";
    const userRole = profile?.role === "mentor" ? "mentor" : "student";

    await adminClient()
      .from("users")
      .upsert({
        id: data.user.id,
        email: data.user.email,
        name: userName,
        avatar_url: profile?.avatar ?? data.user.user_metadata?.avatar_url ?? null,
        role: userRole,
        bio: profile?.bio ?? null,
        is_active: true,
        last_login_at: nowIso(),
      }, { onConflict: "id" });
  } catch (_syncErr) {
    // Non-fatal: some deployments may not use this table.
  }

  return { id: data.user.id, email: data.user.email!, role: profile?.role ?? "student" };
}

function err(c: any, msg: string, status = 400) {
  return c.json({ error: msg }, status);
}

/** Push an ID into a user's list stored in KV */
async function pushToList(key: string, id: string) {
  const list: string[] = (await kv.get(key)) ?? [];
  if (!list.includes(id)) {
    list.unshift(id);
    await kv.set(key, list);
  }
}

/** Remove an ID from a user's list stored in KV */
async function removeFromList(key: string, id: string) {
  const list: string[] = (await kv.get(key)) ?? [];
  await kv.set(key, list.filter((x) => x !== id));
}

/** Create and push a notification for a user */
async function pushNotification(userId: string, type: string, category: string, title: string, message: string) {
  const nid = genId();
  const notif = { id: nid, userId, type, category, title, message, read: false, createdAt: nowIso() };
  await kv.set(`notification:${nid}`, notif);
  await pushToList(`user:${userId}:notifications`, nid);
  return notif;
}



// ─────────────────────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/health", (c) => c.json({ status: "ok", ts: nowIso() }));

// ─────────────────────────────────────────────────────────────
// AUTH – Sync Profile After OTP Signup (internal use via verify-auth-otp)
// ─────────────────────────────────────────────────────────────
// NOTE: User signup now happens via /send-signup-otp → /verify-auth-otp flow
// This endpoint is deprecated. Remove or keep for internal admin use only.

// DEPRECATED: Old registration endpoint removed since signup now uses OTP flow
// See supabase/functions/verify-auth-otp for the new signup logic

// ─────────────────────────────────────────────────────────────
// PROFILE – Get / Update
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/profile", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) return err(c, "Missing auth token", 401);

    const supabase = adminClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      console.log("Profile GET: token verification failed:", error?.message);
      return err(c, "Invalid or expired token", 401);
    }

    const uid = data.user.id;
    let profile = await kv.get(`user:${uid}:profile`);

    // Prefer DB profile if KV is missing.
    if (!profile) {
      const dbProfile = await getProfileFromDb(uid);
      if (dbProfile) {
        profile = {
          ...dbProfile,
          email: data.user.email!,
          gradeLevel: "",
          joinedAt: data.user.created_at ?? nowIso(),
        };
        await kv.set(`user:${uid}:profile`, profile);
      }
    }

    // Auto-provision a profile for users who authenticated via Supabase
    // but don't have a KV profile (e.g., created outside the registration flow,
    // or KV data was cleared).
    if (!profile) {
      console.log(`Profile GET: no KV profile found for user ${uid}, auto-provisioning…`);
      const metaName =
        data.user.user_metadata?.name ??
        data.user.email?.split("@")[0] ??
        "User";
      const metaRole = data.user.user_metadata?.role ?? "student";
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(metaName)}`;
      profile = {
        id: uid,
        name: metaName,
        email: data.user.email!,
        role: metaRole,
        avatar: avatarUrl,
        bio: "",
        gradeLevel: "",
        subjects: [],
        joinedAt: data.user.created_at ?? nowIso(),
        autoProvisioned: true,
      };
      await kv.set(`user:${uid}:profile`, profile);
      await syncProfileToDb(profile);
      await syncPublicUserToDb(profile);
      // Send a welcome notification
      await pushNotification(
        uid,
        "system",
        "System and Platform Alerts",
        "Welcome back to Learnova! 👋",
        "Your profile has been set up. Feel free to update your details in Settings."
      );
    }

    return c.json(profile);
  } catch (e: any) {
    console.log("Profile GET error:", e.message);
    return err(c, `Profile fetch failed: ${e.message}`, 401);
  }
});

app.put("/make-server-a0923c49/profile", async (c) => {
  try {
    const user = await getAuthUser(c);
    const body = await c.req.json();
    const profile = await kv.get(`user:${user.id}:profile`);
    if (!profile) return err(c, "Profile not found", 404);
    const allowed = ["name", "bio", "avatar", "gradeLevel", "subjects", "hourlyRate", "experience"];
    const updates: any = {};
    for (const k of allowed) if (body[k] !== undefined) updates[k] = body[k];
    const updated = { ...profile, ...updates, updatedAt: nowIso() };
    await kv.set(`user:${user.id}:profile`, updated);
    await syncProfileToDb(updated);

    // If mentor, also update public listing
    if (profile.role === "mentor") {
      const pub = await kv.get(`mentor:${user.id}:public`);
      if (pub) {
        const pubAllowed = ["name", "bio", "avatar", "subjects", "hourlyRate", "experience"];
        const pubUpdates: any = {};
        for (const k of pubAllowed) if (updates[k] !== undefined) pubUpdates[k] = updates[k];
        await kv.set(`mentor:${user.id}:public`, { ...pub, ...pubUpdates });
      }
    }
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// MENTORS – Browse (public)
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/mentors", async (c) => {
  try {
    const dbMentors = await getMentorsFromDb();
    if (dbMentors && dbMentors.length > 0) {
      return c.json(dbMentors);
    }

    const idx: string[] = (await kv.get("mentors:index")) ?? [];
    const mentors = await Promise.all(idx.map((id) => kv.get(`mentor:${id}:public`)));
    return c.json(mentors.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 500);
  }
});

// ─────────────────────────────────────────────────────────────
// NOTES – Full CRUD
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/notes", async (c) => {
  try {
    const user = await getAuthUser(c);
    const ids: string[] = (await kv.get(`user:${user.id}:notes`)) ?? [];
    if (ids.length === 0) return c.json([]);
    const notes = await Promise.all(ids.map((id) => kv.get(`note:${id}`)));
    return c.json(notes.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/notes", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { title, content } = await c.req.json();
    if (!title && !content) return err(c, "title or content required");
    const id = genId();
    const note = {
      id,
      userId: user.id,
      title: title || "Untitled Note",
      content: content || "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await kv.set(`note:${id}`, note);
    await pushToList(`user:${user.id}:notes`, id);
    return c.json(note, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/notes/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const note = await kv.get(`note:${id}`);
    if (!note || note.userId !== user.id) return err(c, "Note not found", 404);
    const { title, content } = await c.req.json();
    const updated = { ...note, title: title ?? note.title, content: content ?? note.content, updatedAt: nowIso() };
    await kv.set(`note:${id}`, updated);
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/notes/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const note = await kv.get(`note:${id}`);
    if (!note || note.userId !== user.id) return err(c, "Note not found", 404);
    await kv.del(`note:${id}`);
    await removeFromList(`user:${user.id}:notes`, id);
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// TASKS – Full CRUD
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/tasks", async (c) => {
  try {
    const user = await getAuthUser(c);
    const ids: string[] = (await kv.get(`user:${user.id}:tasks`)) ?? [];
    const tasks = await Promise.all(ids.map((id) => kv.get(`task:${id}`)));
    return c.json(tasks.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/tasks", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { title } = await c.req.json();
    if (!title) return err(c, "title is required");
    const id = genId();
    const task = { id, userId: user.id, title, completed: false, createdAt: nowIso() };
    await kv.set(`task:${id}`, task);
    await pushToList(`user:${user.id}:tasks`, id);
    return c.json(task, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/tasks/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const task = await kv.get(`task:${id}`);
    if (!task || task.userId !== user.id) return err(c, "Task not found", 404);
    const body = await c.req.json();
    const updated = {
      ...task,
      title: body.title ?? task.title,
      completed: body.completed ?? task.completed,
      updatedAt: nowIso(),
    };
    await kv.set(`task:${id}`, updated);
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/tasks/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const task = await kv.get(`task:${id}`);
    if (!task || task.userId !== user.id) return err(c, "Task not found", 404);
    await kv.del(`task:${id}`);
    await removeFromList(`user:${user.id}:tasks`, id);
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// REMINDERS – Full CRUD
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/reminders", async (c) => {
  try {
    const user = await getAuthUser(c);
    const ids: string[] = (await kv.get(`user:${user.id}:reminders`)) ?? [];
    const reminders = await Promise.all(ids.map((id) => kv.get(`reminder:${id}`)));
    return c.json(reminders.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/reminders", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { title, frequency = "Daily", reminderDate = "", reminderTime = "" } = await c.req.json();
    if (!title) return err(c, "title is required");
    const id = genId();
    const reminder = { id, userId: user.id, title, frequency, reminderDate, reminderTime, completed: false, createdAt: nowIso() };
    await kv.set(`reminder:${id}`, reminder);
    await pushToList(`user:${user.id}:reminders`, id);
    return c.json(reminder, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/reminders/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const reminder = await kv.get(`reminder:${id}`);
    if (!reminder || reminder.userId !== user.id) return err(c, "Reminder not found", 404);
    const body = await c.req.json();
    const updated = {
      ...reminder,
      title: body.title ?? reminder.title,
      frequency: body.frequency ?? reminder.frequency,
      reminderDate: body.reminderDate ?? reminder.reminderDate,
      reminderTime: body.reminderTime ?? reminder.reminderTime,
      completed: body.completed ?? reminder.completed,
      updatedAt: nowIso(),
    };
    await kv.set(`reminder:${id}`, updated);
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/reminders/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const reminder = await kv.get(`reminder:${id}`);
    if (!reminder || reminder.userId !== user.id) return err(c, "Reminder not found", 404);
    await kv.del(`reminder:${id}`);
    await removeFromList(`user:${user.id}:reminders`, id);
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// STUDY PLANS – Full CRUD
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/study-plans", async (c) => {
  try {
    const user = await getAuthUser(c);
    const ids: string[] = (await kv.get(`user:${user.id}:study_plans`)) ?? [];
    const plans = await Promise.all(ids.map((id) => kv.get(`study_plan:${id}`)));
    return c.json(plans.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/study-plans", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { subject, goal = "", startDate = "", endDate = "", startTime = "", endTime = "", reminder = "Daily", priority = "low" } = await c.req.json();
    if (!subject) return err(c, "subject is required");
    const id = genId();
    const timeStr = startTime && endTime ? `${startTime} - ${endTime}` : "TBD";
    const plan = {
      id,
      userId: user.id,
      subject,
      goal,
      startDate,
      endDate,
      startTime,
      endTime,
      timeStr,
      reminder,
      priority,
      progress: 0,
      completed: false,
      createdAt: nowIso(),
    };
    await kv.set(`study_plan:${id}`, plan);
    await pushToList(`user:${user.id}:study_plans`, id);
    return c.json(plan, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/study-plans/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const plan = await kv.get(`study_plan:${id}`);
    if (!plan || plan.userId !== user.id) return err(c, "Study plan not found", 404);
    const body = await c.req.json();
    const updated = { ...plan, ...body, id, userId: user.id, updatedAt: nowIso() };
    if (updated.startTime && updated.endTime) updated.timeStr = `${updated.startTime} - ${updated.endTime}`;
    await kv.set(`study_plan:${id}`, updated);
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/study-plans/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const plan = await kv.get(`study_plan:${id}`);
    if (!plan || plan.userId !== user.id) return err(c, "Study plan not found", 404);
    await kv.del(`study_plan:${id}`);
    await removeFromList(`user:${user.id}:study_plans`, id);
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// MOOD CHECK-INS
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/mood-checkins", async (c) => {
  try {
    const user = await getAuthUser(c);
    const checkins = (await kv.get(`user:${user.id}:mood_checkins`)) ?? [];
    return c.json(checkins);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/mood-checkins", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { mood, note = "", emoji = "" } = await c.req.json();
    if (!mood) return err(c, "mood is required");
    const checkin = { id: genId(), userId: user.id, mood, emoji, note, timestamp: nowIso() };
    const checkins = (await kv.get(`user:${user.id}:mood_checkins`)) ?? [];
    checkins.unshift(checkin);
    await kv.set(`user:${user.id}:mood_checkins`, checkins.slice(0, 100));
    return c.json(checkin, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// WORLD CHAT
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/world-chat", async (c) => {
  try {
    await getAuthUser(c); // must be logged in
    const messages = (await kv.get("world_chat:messages")) ?? [];
    return c.json(messages);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/world-chat", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { text, senderName, senderAvatar = "" } = await c.req.json();
    if (!text?.trim()) return err(c, "text is required");
    const profile = await kv.get(`user:${user.id}:profile`);
    const msg = {
      id: genId(),
      senderId: user.id,
      senderName: senderName || profile?.name || "Anonymous",
      senderAvatar: senderAvatar || profile?.avatar || "",
      text: text.trim(),
      timestamp: nowIso(),
      isOwn: false, // client sets this per viewer
    };
    const messages = (await kv.get("world_chat:messages")) ?? [];
    messages.push(msg);
    await kv.set("world_chat:messages", messages.slice(-200)); // keep last 200
    return c.json(msg, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// COMMUNITY EVENTS
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/community/events", async (c) => {
  try {
    const events = (await kv.get("community:events")) ?? [];
    return c.json(events);
  } catch (e: any) {
    return err(c, e.message, 500);
  }
});

app.post("/make-server-a0923c49/community/events", async (c) => {
  try {
    const user = await getAuthUser(c);
    const profile = await kv.get(`user:${user.id}:profile`);
    const { title, description, details = [], eventDate = "", isUpcoming = true } = await c.req.json();
    if (!title) return err(c, "title is required");
    const event = {
      id: genId(),
      title,
      description,
      details,
      eventDate,
      isUpcoming,
      authorId: user.id,
      authorName: profile?.name || "Anonymous",
      createdAt: nowIso(),
    };
    const events = (await kv.get("community:events")) ?? [];
    events.unshift(event);
    await kv.set("community:events", events);
    return c.json(event, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/community/events/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const events = (await kv.get("community:events")) ?? [];
    const event = events.find((e: any) => e.id === id);
    if (!event) return err(c, "Event not found", 404);
    if (event.authorId !== user.id) return err(c, "Forbidden", 403);
    await kv.set("community:events", events.filter((e: any) => e.id !== id));
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// SESSIONS – Create (mentor), list, update, cancel
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/sessions", async (c) => {
  try {
    const user = await getAuthUser(c);
    const listKey = user.role === "mentor" ? `mentor:${user.id}:sessions` : `user:${user.id}:sessions`;
    const ids: string[] = (await kv.get(listKey)) ?? [];
    const sessions = await Promise.all(ids.map((id) => kv.get(`session:${id}`)));
    return c.json(sessions.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/sessions", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Only mentors can create sessions", 403);
    const { subject, date, time, duration = 60, price = 0, notes = "" } = await c.req.json();
    if (!subject || !date || !time) return err(c, "subject, date, and time are required");
    const id = genId();
    const session = {
      id,
      mentorId: user.id,
      studentId: null,
      subject,
      date,
      time,
      duration,
      price,
      notes,
      status: "available", // available | booked | completed | cancelled
      createdAt: nowIso(),
    };
    await kv.set(`session:${id}`, session);
    await pushToList(`mentor:${user.id}:sessions`, id);
    return c.json(session, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/sessions/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const session = await kv.get(`session:${id}`);
    if (!session) return err(c, "Session not found", 404);
    if (session.mentorId !== user.id && session.studentId !== user.id) return err(c, "Forbidden", 403);
    const body = await c.req.json();
    const allowed = ["subject", "date", "time", "duration", "price", "notes", "status", "studentId", "studentName"];
    const updates: any = {};
    for (const k of allowed) if (body[k] !== undefined) updates[k] = body[k];
    const updated = { ...session, ...updates, updatedAt: nowIso() };
    await kv.set(`session:${id}`, updated);
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/sessions/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const session = await kv.get(`session:${id}`);
    if (!session) return err(c, "Session not found", 404);
    if (session.mentorId !== user.id) return err(c, "Forbidden", 403);
    const updated = { ...session, status: "cancelled", updatedAt: nowIso() };
    await kv.set(`session:${id}`, updated);
    // Notify student if booked
    if (session.studentId) {
      await pushNotification(session.studentId, "session", "Session Updates",
        "Session Cancelled", `Your session for "${session.subject}" has been cancelled by the mentor.`);
    }
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// SESSION REQUESTS – Student books, mentor accepts/declines
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/session-requests", async (c) => {
  try {
    const user = await getAuthUser(c);
    const listKey = user.role === "mentor" ? `mentor:${user.id}:session_requests` : `user:${user.id}:session_requests`;
    const ids: string[] = (await kv.get(listKey)) ?? [];
    const reqs = await Promise.all(ids.map((id) => kv.get(`session_request:${id}`)));
    return c.json(reqs.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/session-requests", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { mentorId, subject, message = "", preferredDate = "", preferredTime = "", paymentMethod = "" } = await c.req.json();
    if (!mentorId || !subject) return err(c, "mentorId and subject are required");
    const profile = await kv.get(`user:${user.id}:profile`);
    const mentor = await kv.get(`mentor:${mentorId}:public`);
    if (!mentor) return err(c, "Mentor not found", 404);

    const id = genId();
    const request = {
      id,
      studentId: user.id,
      studentName: profile?.name || "Student",
      studentAvatar: profile?.avatar || "",
      mentorId,
      mentorName: mentor.name,
      subject,
      message,
      preferredDate,
      preferredTime,
      paymentMethod,
      status: "pending", // pending | accepted | declined
      createdAt: nowIso(),
    };
    await kv.set(`session_request:${id}`, request);
    await pushToList(`mentor:${mentorId}:session_requests`, id);
    await pushToList(`user:${user.id}:session_requests`, id);

    // Notify mentor
    await pushNotification(mentorId, "session", "Session Updates",
      "New Booking Request",
      `${profile?.name || "A student"} requested a session for "${subject}" on ${preferredDate || "a date TBD"}.`
    );
    return c.json(request, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/session-requests/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const request = await kv.get(`session_request:${id}`);
    if (!request) return err(c, "Request not found", 404);
    if (request.mentorId !== user.id) return err(c, "Only mentor can update this request", 403);
    const { status } = await c.req.json(); // accepted | declined
    if (!["accepted", "declined"].includes(status)) return err(c, "status must be 'accepted' or 'declined'");

    const updated = { ...request, status, respondedAt: nowIso() };
    await kv.set(`session_request:${id}`, updated);

    // If accepted, create a booked session automatically
    if (status === "accepted") {
      const sid = genId();
      const session = {
        id: sid,
        mentorId: user.id,
        studentId: request.studentId,
        studentName: request.studentName,
        subject: request.subject,
        date: request.preferredDate,
        time: request.preferredTime,
        duration: 60,
        price: 0,
        notes: request.message,
        status: "booked",
        createdAt: nowIso(),
      };
      await kv.set(`session:${sid}`, session);
      await pushToList(`mentor:${user.id}:sessions`, sid);
      await pushToList(`user:${request.studentId}:sessions`, sid);

      // Update mentor earnings for booking
      const earnings = (await kv.get(`mentor:${user.id}:earnings`)) ?? { total: 0, thisMonth: 0, lastMonth: 0, thisWeek: 0, totalSessions: 0, history: [] };
      earnings.totalSessions = (earnings.totalSessions || 0) + 1;
      await kv.set(`mentor:${user.id}:earnings`, earnings);

      await pushNotification(request.studentId, "session", "Session Updates",
        "Session Booked! 🎉",
        `Your session with ${request.mentorName} for "${request.subject}" on ${request.preferredDate} has been confirmed.`
      );
    } else {
      await pushNotification(request.studentId, "session", "Session Updates",
        "Session Request Declined",
        `Your session request for "${request.subject}" was declined. Try booking another mentor.`
      );
    }
    return c.json(updated);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/notifications", async (c) => {
  try {
    const user = await getAuthUser(c);
    const ids: string[] = (await kv.get(`user:${user.id}:notifications`)) ?? [];
    const notifs = await Promise.all(ids.map((id) => kv.get(`notification:${id}`)));
    return c.json(notifs.filter(Boolean));
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/notifications/:id/read", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { id } = c.req.param();
    const notif = await kv.get(`notification:${id}`);
    if (!notif || notif.userId !== user.id) return err(c, "Notification not found", 404);
    await kv.set(`notification:${id}`, { ...notif, read: true });
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.put("/make-server-a0923c49/notifications/read-all", async (c) => {
  try {
    const user = await getAuthUser(c);
    const ids: string[] = (await kv.get(`user:${user.id}:notifications`)) ?? [];
    await Promise.all(ids.map(async (id) => {
      const notif = await kv.get(`notification:${id}`);
      if (notif && !notif.read) await kv.set(`notification:${id}`, { ...notif, read: true });
    }));
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// MENTOR – Earnings
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/earnings", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const earnings = (await kv.get(`mentor:${user.id}:earnings`)) ?? {
      total: 0, thisMonth: 0, lastMonth: 0, thisWeek: 0, totalSessions: 0, history: [],
    };
    return c.json(earnings);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// Record a payment (called internally after session completion)
app.post("/make-server-a0923c49/earnings/record", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const { amount, sessionId = "", description = "Session payment" } = await c.req.json();
    if (!amount || amount <= 0) return err(c, "amount must be positive");
    const earnings = (await kv.get(`mentor:${user.id}:earnings`)) ?? {
      total: 0, thisMonth: 0, lastMonth: 0, thisWeek: 0, totalSessions: 0, history: [],
    };
    earnings.total = (earnings.total || 0) + amount;
    earnings.thisMonth = (earnings.thisMonth || 0) + amount;
    earnings.thisWeek = (earnings.thisWeek || 0) + amount;
    earnings.totalSessions = (earnings.totalSessions || 0) + 1;
    earnings.history = [{ date: nowIso(), amount, sessionId, description }, ...(earnings.history || [])].slice(0, 100);
    await kv.set(`mentor:${user.id}:earnings`, earnings);
    return c.json(earnings);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// MENTOR – Withdrawals
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/withdrawals", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const withdrawals = (await kv.get(`mentor:${user.id}:withdrawals`)) ?? [];
    return c.json(withdrawals);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/withdrawals", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const { amount, method, accountDetails = {} } = await c.req.json();
    if (!amount || amount <= 0) return err(c, "amount must be positive");
    if (!method) return err(c, "method is required");

    const earnings = (await kv.get(`mentor:${user.id}:earnings`)) ?? { total: 0 };
    if (amount > (earnings.total || 0)) return err(c, "Insufficient balance");

    const withdrawal = {
      id: genId(),
      mentorId: user.id,
      amount,
      method,
      accountDetails,
      status: "processing", // processing | completed | failed
      createdAt: nowIso(),
    };
    const withdrawals = (await kv.get(`mentor:${user.id}:withdrawals`)) ?? [];
    withdrawals.unshift(withdrawal);
    await kv.set(`mentor:${user.id}:withdrawals`, withdrawals);

    // Deduct from earnings
    earnings.total = Math.max(0, (earnings.total || 0) - amount);
    await kv.set(`mentor:${user.id}:earnings`, earnings);

    // Simulate processing → notification
    await pushNotification(user.id, "withdrawal", "Withdraw Notifications",
      "Withdrawal Processing",
      `Your withdrawal of ₹${amount} via ${method} is being processed.`
    );

    // Simulate success after processing
    setTimeout(async () => {
      const wList = (await kv.get(`mentor:${user.id}:withdrawals`)) ?? [];
      const idx = wList.findIndex((w: any) => w.id === withdrawal.id);
      if (idx !== -1) {
        wList[idx].status = "completed";
        wList[idx].processedAt = new Date().toISOString();
        await kv.set(`mentor:${user.id}:withdrawals`, wList);
        await pushNotification(user.id, "withdrawal", "Withdraw Notifications",
          "Withdrawal Successful ✅",
          `₹${amount} has been successfully transferred to your ${method} account.`
        );
      }
    }, 5000);

    return c.json(withdrawal, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// MENTOR – Payment Modes
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/payment-modes", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const modes = (await kv.get(`mentor:${user.id}:payment_modes`)) ?? [];
    return c.json(modes);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.post("/make-server-a0923c49/payment-modes", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const { type, accountNumber = "", bankName = "", ifscCode = "", upiId = "", primary = false } = await c.req.json();
    if (!type) return err(c, "type is required");
    const mode = { id: genId(), type, accountNumber, bankName, ifscCode, upiId, primary, addedAt: nowIso() };
    const modes = (await kv.get(`mentor:${user.id}:payment_modes`)) ?? [];
    if (primary) modes.forEach((m: any) => (m.primary = false));
    modes.push(mode);
    await kv.set(`mentor:${user.id}:payment_modes`, modes);
    return c.json(mode, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.delete("/make-server-a0923c49/payment-modes/:id", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const { id } = c.req.param();
    const modes = (await kv.get(`mentor:${user.id}:payment_modes`)) ?? [];
    const filtered = modes.filter((m: any) => m.id !== id);
    if (filtered.length === modes.length) return err(c, "Payment mode not found", 404);
    await kv.set(`mentor:${user.id}:payment_modes`, filtered);
    return c.json({ success: true });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// MENTOR – Performance stats
// ─────────────────────────────────────────────────────────────

app.get("/make-server-a0923c49/performance", async (c) => {
  try {
    const user = await getAuthUser(c);
    if (user.role !== "mentor") return err(c, "Forbidden", 403);
    const sessions: any[] = [];
    const ids: string[] = (await kv.get(`mentor:${user.id}:sessions`)) ?? [];
    for (const id of ids) {
      const s = await kv.get(`session:${id}`);
      if (s) sessions.push(s);
    }
    const total = sessions.length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    const booked = sessions.filter((s) => s.status === "booked").length;
    const cancelled = sessions.filter((s) => s.status === "cancelled").length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const pub = await kv.get(`mentor:${user.id}:public`);
    return c.json({
      totalSessions: total,
      completedSessions: completed,
      bookedSessions: booked,
      cancelledSessions: cancelled,
      completionRate,
      rating: pub?.rating ?? "5.0",
      studentsHelped: pub?.studentsHelped ?? "0",
    });
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// STUDY SESSIONS tracking (focus timer results)
// ─────────────────────────────────────────────────────────────

app.post("/make-server-a0923c49/study-sessions", async (c) => {
  try {
    const user = await getAuthUser(c);
    const { mode, durationMinutes, completedPomodoros = 0 } = await c.req.json();
    if (!mode || !durationMinutes) return err(c, "mode and durationMinutes required");
    const session = { id: genId(), userId: user.id, mode, durationMinutes, completedPomodoros, timestamp: nowIso() };
    const history = (await kv.get(`user:${user.id}:study_sessions`)) ?? [];
    history.unshift(session);
    await kv.set(`user:${user.id}:study_sessions`, history.slice(0, 200));
    return c.json(session, 201);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

app.get("/make-server-a0923c49/study-sessions", async (c) => {
  try {
    const user = await getAuthUser(c);
    const history = (await kv.get(`user:${user.id}:study_sessions`)) ?? [];
    return c.json(history);
  } catch (e: any) {
    return err(c, e.message, 401);
  }
});

// ─────────────────────────────────────────────────────────────
// SEED – Demo community events & mentor profiles (idempotent)
// ─────────────────────────────────────────────────────────────

app.post("/make-server-a0923c49/seed/demo", async (c) => {
  try {
    // Seed community events if empty
    const events = (await kv.get("community:events")) ?? [];
    if (events.length === 0) {
      const demoEvents = [
        {
          id: genId(), title: "Introduction to Machine Learning Workshop",
          description: "Join us for an interactive workshop covering the fundamentals of machine learning, including supervised and unsupervised learning techniques. Perfect for beginners!",
          details: ["October 15, 2025", "2:00 PM - 4:30 PM", "Virtual Event (Zoom)"],
          eventDate: "2025-10-15", isUpcoming: true,
          authorId: "system", authorName: "Learnova Team", createdAt: nowIso(),
        },
        {
          id: genId(), title: "Study Smart: Time Management for Students",
          description: "Learn proven strategies to manage your study time effectively. Discover Pomodoro, Eisenhower matrix, and more tools used by top students.",
          details: ["November 3, 2025", "3:00 PM - 5:00 PM", "Virtual Event (Google Meet)"],
          eventDate: "2025-11-03", isUpcoming: true,
          authorId: "system", authorName: "Learnova Team", createdAt: nowIso(),
        },
        {
          id: genId(), title: "Mindfulness & Mental Health for Learners",
          description: "A supportive session on managing stress, burnout, and anxiety during your studies. Includes guided meditation and Q&A with a wellness coach.",
          details: ["September 28, 2025", "1:00 PM - 2:30 PM", "Virtual Event (Zoom)"],
          eventDate: "2025-09-28", isUpcoming: false,
          authorId: "system", authorName: "Learnova Team", createdAt: nowIso(),
        },
        {
          id: genId(), title: "Peer Study Group: Advanced Mathematics",
          description: "Collaborative math problem-solving session. Bring your toughest questions and work through them with peers and a mentor facilitator.",
          details: ["September 10, 2025", "4:00 PM - 6:00 PM", "Virtual Event (Discord)"],
          eventDate: "2025-09-10", isUpcoming: false,
          authorId: "system", authorName: "Learnova Team", createdAt: nowIso(),
        },
      ];
      await kv.set("community:events", demoEvents);
    }

    return c.json({ success: true, message: "Demo data seeded" });
  } catch (e: any) {
    return err(c, e.message, 500);
  }
});

// Health check endpoint - public
app.get("/health", async (c: Context) => {
  return c.json({ status: "ok", timestamp: nowIso() });
});

// Public ping endpoint 
app.post("/public/ping", async (c: Context) => {
  return c.json({ 
    status: "pong", 
    timestamp: nowIso(),
    message: "Pong"
  });
});

// Mount WebRTC API routes
registerWebRTCRoutes(app, adminClient);

Deno.serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/server") {
    url.pathname = "/";
    return app.fetch(new Request(url, req));
  }
  if (url.pathname.startsWith("/server/")) {
    url.pathname = url.pathname.slice("/server".length);
    return app.fetch(new Request(url, req));
  }
  return app.fetch(req);
});
