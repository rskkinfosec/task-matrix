# TaskMatrix - Build & Launch Guide
**By Kaushal RSK** | rskkinfosec@gmail.com

Quick reference for building and launching TaskMatrix on all platforms.

---

## 🚀 Quick Launch (Development/Testing)

### Desktop App (Electron)
```powershell
cd e:\APPS\TaskMatrix-Desktop
npm install              # First time only
npm start                # Launch desktop app
```

### Windows App (Electron)
```powershell
cd e:\APPS\TaskMatrix-Windows
npm install              # First time only
npm start                # Launch Windows app
```

### Mobile App (iOS/Android - Expo)
```powershell
cd e:\APPS\TaskMatrix-Mobile
npm install              # First time only
npx expo start --tunnel  # Launch with tunnel (recommended)
# OR
npm start                # Launch normal mode
```
**Then:** Scan QR code with Expo Go app on your phone

### Web App (Browser)
```powershell
# Option 1: Direct file
cd e:\APPS\TaskMatrix
start index.html         # Opens in default browser

# Option 2: Local server (recommended)
python -m http.server 8000
# OR
npx serve .
```
**Then:** Open http://localhost:8000

---

## 📦 Production Builds

### Desktop - Windows Executable (.exe)
```powershell
cd e:\APPS\TaskMatrix-Desktop
npm install              # If not done
npm run build            # Creates installer in dist/ folder
```
**Output:** `dist/TaskMatrix-Desktop Setup x.x.x.exe`

### Windows - Native App
```powershell
cd e:\APPS\TaskMatrix-Windows
npm install
npm run build
```
**Output:** `dist/TaskMatrix-Windows Setup x.x.x.exe`

### Mobile - Android APK
```powershell
cd e:\APPS\TaskMatrix-Mobile
npm install -g eas-cli   # First time only (already done)
npx eas-cli login        # Login to Expo account
npx eas-cli build:configure      # First time only
npx eas-cli build --platform android --profile preview
```
**Output:** Download link for APK file
**Distribution:** Share APK directly, users install via "Allow Unknown Sources"

### Mobile - iOS IPA
```powershell
cd e:\APPS\TaskMatrix-Mobile
npx eas-cli build --platform ios
```
**Requirements:** Apple Developer account ($99/year)
**Output:** Download link for IPA file
**Distribution:** TestFlight or App Store

### Web - Static Files
```powershell
# Already built! Just deploy the files:
cd e:\APPS\TaskMatrix
# Upload index.html to any web server
```
**Deploy to:**
- GitHub Pages
- Netlify
- Vercel
- Any web hosting

---

## 🔧 Common Commands

### Mobile App Controls (in Expo terminal)
- `a` - Open Android emulator
- `i` - Open iOS simulator (Mac only)
- `w` - Open in web browser
- `r` - Reload app
- `j` - Open debugger
- `m` - Toggle menu
- `Ctrl+C` - Stop server

### Rebuild After Changes
```powershell
# Desktop/Windows
npm run build

# Mobile (restart dev server)
npx expo start --tunnel

# Web (no build needed, just refresh browser)
```

---

## 📱 Platform-Specific Notes

### iOS Testing on Windows
Since you're on Windows, you can't run iOS Simulator. Options:
1. **Expo Go app** (Recommended) - Free, instant testing
2. **Physical iPhone** - Scan QR code
3. **Mac computer** - For iOS Simulator

### Android Testing
- **Expo Go app** - Easiest, just scan QR code
- **Android Emulator** - Press `a` in Expo terminal
- **Physical device** - Scan QR code with Expo Go

### Desktop vs Windows App
Both are identical - just different project names. Pick one:
- **TaskMatrix-Desktop** - Generic name
- **TaskMatrix-Windows** - Windows-specific name

---

## 🐛 Quick Troubleshooting

### "eas is not recognized" (after installing eas-cli)
```powershell
# Use npx instead:
npx eas-cli --version
npx eas-cli login
npx eas-cli build --platform android
```

### "Port already in use"
```powershell
Get-Process -Name node | Stop-Process -Force
```

### "Module not found"
```powershell
npm install
```

### Expo tunnel not working
```powershell
npx expo start --tunnel
# If still fails, try:
npx expo start
```

### Desktop app won't start
```powershell
rm -r node_modules
npm install
npm start
```

---

## 📊 Build Time Estimates

- **Desktop/Windows Build:** 1-3 minutes
- **Mobile Development:** Instant (Expo Go)
- **Mobile APK Build:** 10-20 minutes (EAS cloud)
- **Mobile IPA Build:** 15-30 minutes (EAS cloud)
- **Web Deploy:** Instant (just copy files)

---

## ✅ Pre-Build Checklist

Before building for production:

- [ ] Update version in `package.json`
- [ ] Update version in `app.json` (mobile)
- [ ] Test on target platform
- [ ] Update app icons (if changed)
- [ ] Check all features work
- [ ] Remove console.log statements
- [ ] Update README if needed

---

## 🎯 Recommended Workflow

**For Development:**
1. Edit `e:\APPS\TaskMatrix\index.html` (source of truth)
2. Test in browser first (fastest)
3. Test on mobile with Expo (instant reload)
4. Test desktop app when ready

**For Distribution:**
1. Test everything works
2. Build desktop/Windows EXE
3. Build mobile APK/IPA
4. Upload web version
5. Share with users!

---

**Last Updated:** November 6, 2025
**Version:** 3.0.0
