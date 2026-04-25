const _supabaseUrl: string =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  'https://evtvzmherkrahjsxdddi.supabase.co';
const _anonKey: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHZ6bWhlcmtyYWhqc3hkZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzE4ODgsImV4cCI6MjA4OTA0Nzg4OH0.2e07Wn2wOOEfzNVfP2INrEpRyMXIuHz2ygTiEsKKZVI';
const _match = _supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
export const projectId: string = _match?.[1] ?? 'evtvzmherkrahjsxdddi';
export const publicAnonKey: string = _anonKey;
