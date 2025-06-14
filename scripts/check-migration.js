// Check Migration Status for TarotSnap Chat Tables
// This script checks if the chat tables exist in the database

const { createClient } = require('@supabase/supabase-js');

async function checkMigrationStatus() {
  // Note: This requires environment variables to be set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Environment variables not found');
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔍 Checking chat tables...');

    // Check if chat_sessions table exists
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('count')
      .limit(1);

    // Check if chat_messages table exists
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('count')
      .limit(1);

    if (sessionsError || messagesError) {
      console.log('❌ Chat tables do not exist');
      console.log('Migration needed: supabase/migrations/20250109_chat_messages.sql');
      console.log('\nTo apply migration:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase/migrations/20250109_chat_messages.sql');
      console.log('4. Run the SQL script');
      return false;
    }

    console.log('✅ Chat tables exist');
    console.log('Migration status: APPLIED');
    return true;

  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
}

// Instructions for manual migration
function printMigrationInstructions() {
  console.log('\n📋 MANUAL MIGRATION INSTRUCTIONS');
  console.log('================================');
  console.log('');
  console.log('1. Open your Supabase Dashboard');
  console.log('2. Go to SQL Editor');
  console.log('3. Copy the contents of: supabase/migrations/20250109_chat_messages.sql');
  console.log('4. Paste and execute the SQL');
  console.log('');
  console.log('The migration will create:');
  console.log('- chat_sessions table (for grouping conversations)');
  console.log('- chat_messages table (for storing individual messages)');
  console.log('- Proper indexes for performance');
  console.log('- Row Level Security (RLS) policies');
  console.log('- Updated_at trigger for sessions');
  console.log('');
  console.log('After migration, the chat memory system will be fully operational.');
}

if (require.main === module) {
  checkMigrationStatus().then((success) => {
    if (!success) {
      printMigrationInstructions();
    }
  });
}

module.exports = { checkMigrationStatus, printMigrationInstructions }; 