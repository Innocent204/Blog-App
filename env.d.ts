/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: 'https://vmwuyhlulqaevzobjtdd.supabase.co';
  readonly VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtd3V5aGx1bHFhZXZ6b2JqdGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDc3OTgsImV4cCI6MjA3ODkyMzc5OH0.z_NCRUbLnGJu0IPuEnw2ZKMRpmTwfVVvVt6DtEU5b9U';
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
