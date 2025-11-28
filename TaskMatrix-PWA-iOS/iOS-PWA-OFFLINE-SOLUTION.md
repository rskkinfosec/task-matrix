# iOS PWA Offline-to-Cloud Solution

## Problem Summary
iOS PWA (installed home screen apps) cannot use Google Sign-In redirect flow because iOS maintains **separate storage contexts** between:
- Safari browser
- PWA installed app

When a redirect occurs from PWA → Google Auth → back to PWA, iOS creates a **new PWA instance** with empty localStorage, losing all auth state.

## Solution: Export/Import Workflow

Since we can't bridge the storage gap programmatically, we provide users with a manual transfer workflow:

### User Journey

#### Phase 1: Work Offline in PWA
1. User adds app to iOS Home Screen
2. Opens app from Home Screen (PWA mode)
3. Clicks "Continue Offline"
4. Creates tasks without signing in

#### Phase 2: Transfer to Safari
5. User taps **📤 Share** button (visible only in iOS PWA when offline)
6. System creates JSON backup file: `taskmatrix-backup-YYYY-MM-DD.json`
7. Uses iOS native Share Sheet (or downloads file)
8. User saves backup to Files app or shares via AirDrop/etc.

#### Phase 3: Sync to Cloud
9. User opens **Safari browser** (not PWA)
10. Navigates to TaskMatrix URL
11. Signs in with Google (works in Safari)
12. Taps **📥 Import** button
13. Selects the backup JSON file
14. Tasks are imported and automatically synced to Google Drive

## Technical Implementation

### Components Added

1. **Share Tasks Button** (`shareTasksBtn`)
   - Location: Action buttons row (top right)
   - Visibility: Only shown for iOS PWA users when not signed in
   - Icon: 📤

2. **shareTasks() Function**
   - Creates comprehensive JSON export with metadata
   - Exports: tasks array, customTabs, export date, app version
   - Uses iOS Web Share API when available
   - Fallback: Direct download
   - Shows instructions for next steps

3. **JSON Import Support**
   - Updated file input to accept `.json` files
   - Modified `processImport()` to detect JSON backups
   - Direct task import (preserves IDs, timestamps, all fields)
   - Automatic sync trigger if user is signed in

4. **User Guidance**
   - Orange warning box in auth modal explaining process
   - Step-by-step instructions (8 steps)
   - Clear button labels with emojis
   - Success messages with next-step guidance

### Code Locations

- **Share Button HTML**: Line 1026-1030
- **Share Button Visibility Logic**: Line 1427-1432 (DOMContentLoaded)
- **shareTasks() Function**: Line 2567-2620
- **JSON Import Handler**: Line 2977-3028 (processImport)
- **File Input Accept**: Line 1265 (added .json)
- **User Instructions**: Line 952-961 (auth modal notice)

## Data Format

### Export JSON Structure
```json
{
  "exportDate": "2024-01-15T10:30:00.000Z",
  "appVersion": "2.0",
  "taskCount": 15,
  "tasks": [
    {
      "id": 1234567890,
      "title": "Example Task",
      "description": "Task details",
      "quadrant": "Q1",
      "parentTab": "work",
      "completed": false,
      "timestamp": 1234567890000
    }
  ],
  "customTabs": ["work", "personal", "project-x"]
}
```

### Import Behavior
- Checks for duplicate IDs (skips existing tasks)
- Merges custom tabs (adds new ones, keeps existing)
- Preserves all task metadata (IDs, timestamps, completion status)
- Triggers auto-sync if user is signed in
- Shows count of imported tasks

## Why This Solution Works

1. **No Storage Bridging Required**: Accepts iOS limitation, works around it
2. **User-Controlled**: User manually transfers data (transparent, trustworthy)
3. **Standard File Format**: JSON is universal, future-proof
4. **Native iOS Integration**: Uses Share Sheet, feels native
5. **Complete Data Transfer**: All tasks + tabs + metadata preserved
6. **Automatic Cloud Sync**: Once in Safari, normal sync flow takes over

## Limitations Addressed

❌ **Can't Fix**: iOS PWA storage isolation (Apple limitation)
✅ **Can Provide**: Clear workflow for users to transfer data themselves
✅ **User Experience**: 8 simple steps, clear instructions at each stage
✅ **Data Integrity**: Full backup includes all metadata
✅ **Future-Proof**: JSON format, can extend with more fields

## Testing Checklist

- [ ] Install app to iOS Home Screen
- [ ] Open from Home Screen (PWA mode)
- [ ] Verify "Continue Offline" button works
- [ ] Create several tasks in different tabs
- [ ] Verify Share button is visible (📤)
- [ ] Tap Share button
- [ ] Verify Share Sheet appears with JSON file
- [ ] Save file to Files app
- [ ] Open Safari (not PWA)
- [ ] Navigate to TaskMatrix URL
- [ ] Sign in with Google
- [ ] Tap Import button
- [ ] Select saved JSON file
- [ ] Verify tasks appear
- [ ] Verify auto-sync to Drive works
- [ ] Verify custom tabs imported

## User Education

Key message: **"iOS PWAs work offline-first. Transfer to Safari to sync to cloud."**

Instructions appear:
1. In auth modal (when iOS PWA detected)
2. After tapping Share button
3. After successful import

This creates a consistent narrative throughout the user journey.
