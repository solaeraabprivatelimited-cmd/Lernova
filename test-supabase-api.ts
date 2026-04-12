/**
 * Diagnostic tool to test Supabase API connectivity
 * This helps identify why we're getting 406 errors
 */

import { createClient } from '@supabase/supabase-js';

const projectId = 'evtvzmherkrahjsxdddi';
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHZ6bWhlcmtyYWhqc3hkZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzE4ODgsImV4cCI6MjA4OTA0Nzg4OH0.2e07Wn2wOOEfzNVfP2INrEpRyMXIuHz2ygTiEsKKZVI';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Create client with custom storage key
    const supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: { storageKey: 'test_auth_v1' },
      }
    );

    console.log('✅ Supabase client created successfully\n');

    // Test 1: Check auth status
    console.log('Test 1: Checking auth status...');
    const { data: session } = await supabase.auth.getSession();
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated\n');

    // Test 2: Try a simple REST API call with explicit headers
    console.log('Test 2: Attempting direct REST API call with proper headers...');
    const url = `https://${projectId}.supabase.co/rest/v1/profiles?limit=1&select=*`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      'apikey': publicAnonKey,
    };

    const response = await fetch(url, { 
      method: 'GET',
      headers,
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log('Response headers:', {
      'content-type': response.headers.get('content-type'),
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Data retrieved:', data.length, 'records\n');
    } else {
      const text = await response.text();
      console.log('❌ Error response:', text.substring(0, 200), '\n');
    }

    // Test 3: Try using Supabase.js client
    console.log('Test 3: Using Supabase.js client query...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log('❌ Error:', error);
    } else {
      console.log('✅ Query successful, count:', data);
    }

  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
  }
}

// Run tests
testSupabaseConnection().catch(console.error);
