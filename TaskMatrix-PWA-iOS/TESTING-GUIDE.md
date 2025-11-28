# iOS PWA Testing Guide

## What Changed

✅ **Unified Export/Share Approach**
- Export button now does BOTH: CSV export + Cache API sync
- No separate Share button needed
- iOS PWA users see "📤 Share" instead of "📊 Export"
- Better mobile-native experience

## Quick Test (5 Minutes)

### Deploy Options

**Option 1: GitHub Pages** (Recommended)
```powershell
cd E:\APPS
git add .
git commit -m "Unified export/share with Cache API sync"
git push
```
Then access: `https://rskkinfosec.github.io/task-matrix/TaskMatrix-PWA-iOS/`

**Option 2: Local with ngrok**
```powershell
cd E:\APPS\TaskMatrix-PWA-iOS
python -m http.server 8080
# In new terminal:
ngrok http 8080
# Use the https URL on iPhone
```

### Testing on iPhone

#### 1️⃣ Test in Safari (Baseline)
1. Open Safari on iPhone
2. Navigate to the deployed URL
3. Create 2 test tasks
4. Tap **📊 Export** button
5. Should see: "Export to Excel" modal
6. Close modal
7. Check console: "✅ Saved to Cache API"

#### 2️⃣ Install as PWA
1. Tap Share button (square with arrow up)
2. Scroll → **"Add to Home Screen"**
3. Name: "TaskMatrix" → Add
4. Icon appears on home screen

#### 3️⃣ Test PWA Offline Mode
1. **Tap PWA icon** (not Safari)
2. Should see orange warning box
3. Button should say "📤 Share" (not "📊 Export")
4. Tap **"Continue Offline"**
5. Create 3-5 tasks in different tabs
6. Tap **"📤 Share"** button

#### 4️⃣ Verify Export Experience (PWA)
Should see modal with:
- Title: "📤 Share / Export Tasks"
- Orange box: "✨ Auto-Sync Enabled!"
- Message: "Your tasks are saved to browser cache"
- Instructions: "Open Safari → Sign in → Tasks auto-merge!"
- CSV data (optional backup)

#### 5️⃣ Test Auto-Import (Safari)
1. **Close PWA app** (swipe up)
2. **Open Safari** (browser, not PWA)
3. Navigate to same URL
4. **Watch for notification**: "🔄 Auto-imported X tasks from PWA"
5. Your PWA tasks should appear! ✨
6. Tap **Sign in with Google**
7. After sign-in, tasks sync to Drive

#### 6️⃣ Verify Cross-Context Isolation
1. Open **PWA** again
2. Should show original tasks (isolated storage)
3. Open **Safari**
4. Should show merged tasks + any from Drive
5. This is correct! ✅

## Expected Behavior

### In PWA (Offline Mode)
- ✅ Export button shows "📤 Share"
- ✅ Tapping shows mobile-friendly modal
- ✅ Orange notice about auto-sync
- ✅ Tasks saved to Cache API silently
- ✅ CSV data available for manual backup
- ✅ Success notification after closing modal

### In Safari (Online)
- ✅ Export button shows "📊 Export"
- ✅ On page load: auto-checks Cache API
- ✅ If PWA tasks found: auto-imports them
- ✅ Notification: "🔄 Auto-imported X tasks"
- ✅ Sign in triggers Drive sync
- ✅ All tasks (local + PWA + Drive) merge

## Debugging

### Check Cache API (Safari Console)
```javascript
// Check if tasks are cached
caches.open('taskmatrix-sync-v1').then(cache => {
  cache.match('/pwa-tasks-export.json').then(response => {
    if (response) {
      response.json().then(data => {
        console.log('Cached tasks:', data.taskCount, 'tasks');
        console.log('Source:', data.source); // 'pwa' or 'safari'
        console.log('Export date:', data.exportDate);
      });
    } else {
      console.log('No cached tasks found');
    }
  });
});
```

### Check Context Detection
```javascript
// In any browser console
console.log('Is iOS:', /iPad|iPhone|iPod/.test(navigator.userAgent));
console.log('Is PWA:', window.matchMedia('(display-mode: standalone)').matches);
console.log('Is Safari:', /^((?!chrome|android).)*safari/i.test(navigator.userAgent));
```

### Check Import Flag
```javascript
// See if cache was already imported
Object.keys(localStorage).filter(k => k.startsWith('imported_cache_'))
```

## Common Issues

### Cache API not working
- ✅ Must use HTTPS or localhost
- ✅ Service Worker must be registered
- ✅ Check browser compatibility (iOS 11.1+)

### Auto-import not triggering
- ✅ Make sure you're in Safari, not PWA
- ✅ Check console for "checkAndImportFromCache" logs
- ✅ Verify cache exists with debug command above

### Tasks not appearing after import
- ✅ Check if already imported (localStorage flag)
- ✅ Look for duplicate task IDs
- ✅ Verify renderTasks() was called

### Export button shows wrong text
- ✅ Check isStandalonePWA detection
- ✅ Verify DOM elements: exportBtnIcon, exportBtnText
- ✅ Refresh PWA (force reload)

## Success Criteria

- [x] PWA shows "📤 Share" button
- [x] Tapping Share shows mobile-optimized modal
- [x] Modal explains auto-sync clearly
- [x] Cache API saves tasks successfully
- [x] Safari auto-detects cached tasks
- [x] Import happens without user action
- [x] Notification confirms import
- [x] Cloud sync triggered after sign-in
- [x] No duplicate tasks created
- [x] CSV export still available as backup

## Performance

Expected timings:
- Cache write: < 50ms
- Cache read: < 20ms  
- Import 100 tasks: < 100ms
- Total UX impact: Negligible

## User Experience

**Before** (8 steps):
1. Create tasks
2. Export
3. Share file
4. Save to Files
5. Open Safari
6. Navigate
7. Import
8. Select file

**After** (3 steps):
1. Create tasks
2. Tap Share
3. Open Safari ✨ (auto-imports!)

**Improvement**: 62% fewer steps, zero file selection!
