# LiveKit Token Generation Fix - Deployment Guide

## 🎯 What Was Fixed

The CORS (Cross-Origin Resource Sharing) error that was blocking the LiveKit token generation has been fixed.

**Error you were seeing:**
```
Access to fetch at 'https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/livekit-token' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Root cause:** The edge function was trying to access environment variables before properly handling the CORS preflight request.

---

## 📋 What Changed

### Updated Files
1. **`supabase/functions/livekit-token/index.ts`** - CORS and error handling improvements
2. **`src/app/components/dashboard/CollaborativeModeRoom.tsx`** - Better error logging

### Key Improvements
- ✅ CORS preflight (OPTIONS request) now handled first
- ✅ Environment variables use correct names (LIVEKIT_URL, not VITE_LIVEKIT_URL)
- ✅ Comprehensive logging for debugging
- ✅ Better error messages and response handling

---

## 🚀 Deployment Steps

### Step 1: Verify GitHub Push ✅
Changes have been pushed to:
- **Repository:** solaeraabprivatelimited-cmd/Lernova
- **Branch:** main
- **Commit:** 45d2e76

### Step 2: Set Environment Variables in Supabase
**CRITICAL - Do this first or the function will still fail!**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `evtvzmherkrahjsxdddi`
3. Navigate to: **Edge Functions** → **livekit-token**
4. Click the **"Secrets"** tab
5. Add these three secrets (copy-paste the exact values):

| Key | Value |
|-----|-------|
| `LIVEKIT_URL` | `wss://lernova-eu1uw0m2.livekit.cloud` |
| `LIVEKIT_API_KEY` | `APIxSpmzQtDDfR5` |
| `LIVEKIT_API_SECRET` | `fx7mmnegbKsv0XpbUBtlTJSdAiurqxp6ta3y5lf6494A` |

6. Click **Save** (or **Deploy** if prompted)

### Step 3: Verify Deployment
Supabase should automatically deploy your function. You can check the deployment status in:
- Edge Functions → livekit-token → **Deployments** tab

### Step 4: Test in Browser
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the app (Ctrl+Shift+R)
3. Navigate to create/join a study room
4. Open Developer Tools (F12) → **Console** tab
5. Look for these logs:

✅ **Success logs:**
```
🔵 Generating LiveKit token...
🟢 Token generated successfully
✅ Connected to LiveKit
```

❌ **Failure logs (and how to fix):**
```
Token generation failed: Server misconfigured: missing LiveKit credentials
→ Solution: Check that all 3 environment variables are set in Supabase
```

```
CORS policy error
→ Solution: Clear browser cache and hard refresh
```

---

## 📊 Network Verification

Use browser DevTools to verify the function is responding correctly:

1. Open **DevTools** → **Network** tab
2. Filter requests by `livekit-token`
3. Look for two requests:
   - **OPTIONS** (preflight) - should return **200**
   - **POST** (actual request) - should return **200** with JSON response

### Expected Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://lernova-eu1uw0m2.livekit.cloud"
}
```

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Still getting CORS error | Clear cache, hard refresh, verify env vars are set |
| 500 error from function | Check Supabase function logs, verify all 3 env vars set |
| "No token in response" | Check browser console for exact error message |
| `useLiveKit.ts:20 LiveKit not enabled` | Token generation is failing - check previous errors |

**To view Supabase function logs:**
1. Go to Supabase Dashboard
2. Edge Functions → livekit-token → **Logs** tab
3. Check for errors from the last request

---

## 📞 Manual Testing (Optional)

If you want to test the function directly without the browser:

```bash
curl -X POST https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/livekit-token \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "test-room",
    "userId": "test-user",
    "userName": "Test User"
  }'
```

Should return:
```json
{
  "token": "...",
  "url": "wss://lernova-eu1uw0m2.livekit.cloud"
}
```

---

## ✅ Success Indicators

Once everything is working, you should see:
- ✅ No CORS errors in console
- ✅ No "LiveKit not enabled" warnings
- ✅ Video grid appears when participants join
- ✅ Local video preview shows
- ✅ Audio/video toggle buttons work
- ✅ Participant list updates in real-time

---

## Need Help?

1. **Check the logs** - Supabase Edge Functions → Logs tab
2. **Browser console** - F12 → Console for detailed error messages
3. **Network tab** - F12 → Network to see request/response details
4. **Environment variables** - Verify all 3 are set in Supabase dashboard
