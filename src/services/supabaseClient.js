import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://nctmnbfgwokzsethlquu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdG1uYmZnd29renNldGhscXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDYwMjYsImV4cCI6MjA4NjEyMjAyNn0.N2Fvdj6tKsn8nS3Hvy83zt5CcOXm3eji-GdCp2m7Qqs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
