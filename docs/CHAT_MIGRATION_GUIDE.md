# Chat Memory System Database Migration Guide

**Status:** ⚠️ **MIGRATION REQUIRED**  
**File:** `supabase/migrations/20250109_chat_messages.sql`  
**Priority:** **HIGH** - Required for chat memory functionality

---

## 🎯 **What This Migration Does**

This migration creates the database tables needed for TarotSnap's chat-centric memory system:

### **Tables Created:**
1. **`chat_sessions`** - Groups conversations by reading or topic
2. **`chat_messages`** - Stores individual user and AI messages

### **Features Added:**
- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Performance Indexes** - Fast queries for chat history
- ✅ **Automatic Timestamps** - Track when conversations happen
- ✅ **Rich Metadata** - Store themes, emotions, and insights
- ✅ **Reading Integration** - Link chats to specific tarot readings

---

## 🚀 **How to Apply the Migration**

### **Method 1: Supabase Dashboard (Recommended)**

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your TarotSnap project

2. **Access SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy Migration SQL**
   - Open `supabase/migrations/20250109_chat_messages.sql`
   - Copy the entire contents (74 lines)

4. **Execute Migration**
   - Paste the SQL into the editor
   - Click "Run" to execute
   - ✅ You should see "Success. No rows returned"

### **Method 2: Command Line (Advanced)**

```bash
# If you have Supabase CLI installed
supabase db push

# Or apply specific migration
supabase db reset --linked
```

---

## ✅ **Verify Migration Success**

After running the migration, verify it worked:

### **Check Tables Exist:**
Run this SQL in your Supabase SQL Editor:

```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages');
```

**Expected Result:** Should return 2 rows showing both tables exist.

### **Check RLS Policies:**
```sql
-- Check Row Level Security policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('chat_sessions', 'chat_messages');
```

**Expected Result:** Should show 8 policies (4 for each table).

### **Test with Application:**
1. Start your development server: `npm run dev`
2. Sign in to your account
3. Go to `/dashboard` 
4. The chat history section should load without errors

---

## 🔧 **Migration Details**

### **Database Schema:**

```sql
-- Chat Sessions (conversation groups)
chat_sessions:
  - id (UUID, primary key)
  - user_id (UUID, references auth.users)
  - reading_id (UUID, optional link to reading)
  - title (TEXT, conversation title)
  - created_at, updated_at (timestamps)

-- Chat Messages (individual messages)
chat_messages:
  - id (UUID, primary key)
  - user_id (UUID, references auth.users)
  - session_id (UUID, references chat_sessions)
  - role ('user' | 'ai')
  - content (TEXT, message content)
  - reading_id (UUID, optional link to reading)
  - metadata (JSONB, themes/emotions/insights)
  - created_at (timestamp)
```

### **Security Policies:**
- Users can only view/edit/delete their own chat data
- All operations require authentication
- No cross-user data access possible

### **Performance Indexes:**
- Fast lookups by user_id
- Efficient sorting by creation date
- Quick session-based queries

---

## 🚨 **Troubleshooting**

### **Error: "relation already exists"**
- **Cause:** Tables already created
- **Solution:** Migration already applied, no action needed

### **Error: "permission denied"**
- **Cause:** Insufficient database permissions
- **Solution:** Ensure you're using the correct Supabase project

### **Error: "reading_sessions does not exist"**
- **Cause:** Missing reading_sessions table
- **Solution:** This is expected - the reference is optional and will be NULL

### **Chat History Not Loading**
1. Check browser console for errors
2. Verify environment variables are set
3. Confirm user is authenticated
4. Test with: `node scripts/check-migration.js`

---

## 📊 **Impact After Migration**

### **For Users:**
- ✅ Chat conversations are remembered across sessions
- ✅ Can view chat history in dashboard
- ✅ Export and delete chat data (privacy controls)
- ✅ AI remembers context from previous conversations

### **For Development:**
- ✅ All chat storage APIs functional
- ✅ Dashboard chat history displays properly
- ✅ Privacy controls work (export/delete)
- ✅ Ready for AI content analysis features

### **For Production:**
- ✅ Scalable chat storage system
- ✅ GDPR-compliant data management
- ✅ Performance optimized for thousands of users
- ✅ Secure with Row Level Security

---

## 🎯 **Next Steps After Migration**

1. **Test the System**
   - Create a test account
   - Have a conversation during a reading
   - Check dashboard for chat history

2. **Monitor Performance**
   - Watch for any slow queries
   - Monitor database usage

3. **Continue Development**
   - AI Content Analysis features
   - Enhanced metadata extraction
   - Advanced chat insights

---

## 📞 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your Supabase project settings
3. Test with a fresh browser session
4. Check browser console for JavaScript errors

**Migration Status:** Once applied, update TODO.md to mark as ✅ **DONE** 