# 🔄 PWA Update Guide

**How to push updates to your TaskMatrix PWA**

---

## 📋 Update Workflow

### Step-by-Step Process:

#### 1. **Make Your Changes**
Edit any file in `TaskMatrix-PWA-iOS/`:
- `index.html` - App code changes
- `manifest.json` - App metadata
- Icons - Visual updates

#### 2. **Update Service Worker Version** ⚠️ **CRITICAL!**

Open `service-worker.js` and change the version:

```javascript
// Before:
const CACHE_NAME = 'taskmatrix-v1.0.0';

// After (increment the version):
const CACHE_NAME = 'taskmatrix-v1.0.1';  // or v1.1.0, v2.0.0, etc.
```

**Why?** This forces the browser to:
- Clear old cached files
- Download new files
- Show users the latest version

#### 3. **Upload to Server**

**GitHub Pages:**
```bash
git add .
git commit -m "Update: your changes here"
git push
```

**Netlify/Vercel:**
- Just upload files (auto-deploys)

**Manual Server:**
- FTP/SFTP upload files
- Replace old files

#### 4. **Users Get Update Automatically!**

When users open the app:
1. ✅ Old version loads instantly (from cache)
2. 🔄 Service worker checks for updates in background
3. 📥 Downloads new version
4. 💬 Shows prompt: "New version available! Reload?"
5. ✅ User clicks OK → App reloads with new version

---

## ⏱️ Update Timeline

| Action | Time | User Experience |
|--------|------|----------------|
| You upload changes | Instant | - |
| Server updates | 1-5 min | - |
| User opens app | Instant | Sees OLD version |
| Background check | 2-5 sec | Using old version |
| Download new files | 5-10 sec | Still using old |
| Prompt appears | Instant | "Update available?" |
| User clicks OK | Instant | Reloads to NEW version |

**Total:** ~30 seconds from opening app to new version

---

## 🆚 Native App vs PWA Updates

### Native iOS/Android App:
```
✏️ Make changes
🏗️ Build new version (10-20 min)
📤 Upload to App Store
⏳ Wait for review (1-7 days)
✅ Approved
📱 User sees "Update available" in App Store
👆 User manually updates
⏳ Downloads & installs (30 sec - 5 min)
✅ New version
```
**Total Time:** Days to weeks

### PWA (Your App):
```
✏️ Make changes
📤 Upload to server (instant)
📱 User opens app
🔄 Auto-checks for update
📥 Auto-downloads in background
💬 Shows prompt (optional)
✅ New version
```
**Total Time:** Seconds to minutes

---

## 🎯 Update Strategies

### Strategy 1: Manual Updates (Current Setup)
- User gets prompt: "Update available?"
- User clicks OK to update
- **Pro:** User controls when to update
- **Con:** Some users might ignore

### Strategy 2: Silent Auto-Update
Remove the confirm dialog for seamless updates:

```javascript
// In index.html, change this:
if (confirm('📱 New version available! Reload to update?')) {
    window.location.reload();
}

// To this (auto-reload):
setTimeout(() => {
    window.location.reload();
}, 2000); // Waits 2 seconds, then auto-updates
```

**Pro:** Everyone always on latest version  
**Con:** Might interrupt user's work

### Strategy 3: Next-Launch Update
Update only when user closes and reopens:

```javascript
// Don't reload immediately, just set a flag
localStorage.setItem('updateAvailable', 'true');

// On next app open, check and update
if (localStorage.getItem('updateAvailable')) {
    localStorage.removeItem('updateAvailable');
    window.location.reload();
}
```

**Pro:** Non-disruptive  
**Con:** Slight delay in getting updates

---

## ✅ Update Checklist

Before pushing an update:

- [ ] Made your code changes
- [ ] Tested locally (`python -m http.server 8000`)
- [ ] **Updated version in `service-worker.js`** ⚠️ CRITICAL!
- [ ] Committed changes (if using Git)
- [ ] Uploaded to server
- [ ] Tested on real device
- [ ] Verified update prompt appears
- [ ] Confirmed new version loads after update

---

## 🐛 Troubleshooting Updates

### Problem: Users not getting updates

**Solution 1:** Check service worker version
```javascript
// Did you increment this?
const CACHE_NAME = 'taskmatrix-v1.0.1'; // Must be NEW version
```

**Solution 2:** Hard refresh
Tell users to:
- Safari: Settings → Clear History and Website Data
- Or: Delete app from home screen and reinstall

**Solution 3:** Check browser console
Open Safari DevTools:
- Look for service worker errors
- Check if new version is downloading

### Problem: Update prompt not showing

**Possible causes:**
- Version number wasn't changed in service-worker.js
- Files not actually uploaded to server
- Browser cache issue
- Service worker not registering

**Fix:**
1. Verify files uploaded
2. Check version number changed
3. Clear browser cache
4. Reinstall app

### Problem: Old version keeps showing

**Nuclear option:**
```javascript
// Add to service-worker.js temporarily:
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => caches.delete(cache))
            );
        })
    );
});
```
This clears ALL caches on next load.

---

## 📊 Version Numbering

Use semantic versioning:

```
v1.0.0
│ │ │
│ │ └─ Patch (bug fixes)
│ └─── Minor (new features)
└───── Major (breaking changes)
```

**Examples:**
- `v1.0.0` → Initial release
- `v1.0.1` → Bug fix
- `v1.1.0` → New feature added
- `v2.0.0` → Major redesign

**Always update in service-worker.js:**
```javascript
const CACHE_NAME = 'taskmatrix-v1.0.1'; // Match your version
```

---

## 🎨 Update Best Practices

### DO:
✅ Increment version number EVERY update  
✅ Test locally before uploading  
✅ Document what changed  
✅ Keep update prompts clear and brief  
✅ Update during off-peak hours if possible  

### DON'T:
❌ Forget to change version number  
❌ Push broken code to production  
❌ Make updates too disruptive  
❌ Change too many things at once  
❌ Skip testing on real device  

---

## 📱 User Communication

### Inform users about updates:

**Option 1: In-app changelog**
Add to your app:
```javascript
const VERSION = '1.0.1';
const CHANGELOG = `
v1.0.1 (Nov 7, 2025)
- Fixed bug in task editing
- Improved notification timing
- Performance enhancements
`;
```

**Option 2: Update notification text**
Make it informative:
```javascript
confirm('📱 New version 1.0.1 available!\n\n✨ Bug fixes & improvements\n\nReload now?')
```

---

## 🚀 Quick Reference

### Every time you make changes:

```powershell
# 1. Edit files
# 2. Update version in service-worker.js
# 3. Test locally
python -m http.server 8000

# 4. Upload (GitHub example)
git add .
git commit -m "v1.0.1: Your changes"
git push

# 5. Users get update automatically!
```

---

## 💡 Pro Tip: Update Log

Keep a log of versions:

```javascript
// In index.html
const APP_VERSION = '1.0.1';
const LAST_UPDATED = '2025-11-07';

console.log(`TaskMatrix PWA v${APP_VERSION} (${LAST_UPDATED})`);
```

This helps with debugging and tracking.

---

## Summary

| Aspect | Native App | PWA |
|--------|-----------|-----|
| **Update Process** | Manual store submission | Upload files |
| **Review Time** | 1-7 days | Instant |
| **User Action** | Manual download | Auto or prompt |
| **Rollback** | Submit new version | Revert files |
| **Testing** | TestFlight required | Direct URL testing |
| **Distribution** | Store approval | Instant |

**Bottom Line:** PWA updates are MUCH faster and easier than native apps! 🎉

---

**Remember:** Change the version number in `service-worker.js` EVERY time you update! This is the most important step.

**Version:** 1.0.0  
**Last Updated:** November 7, 2025
