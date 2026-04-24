const _supabaseUrl: string =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  'https://fmipvonompvumloczlbl.supabase.co';
const _anonKey: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtaXB2b25vbXB2dW1sb2N6bGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MzUxMjAsImV4cCI6MjA5MjMxMTEyMH0.8UocoqEF2MfWDbt7ZkJvqvrZ5YYocU9nBXjmQMpM-Bw';
const _match = _supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/);
export const projectId: string = _match?.[1] ?? 'fmipvonompvumloczlbl';
export const publicAnonKey: string = _anonKey;
