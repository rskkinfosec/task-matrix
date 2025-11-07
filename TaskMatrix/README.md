# Task Matrix 📊

A multi-platform Eisenhower Matrix task manager built with a single-source-of-truth architecture.

## 🎯 What is This?

Task Matrix helps you organize tasks using the Eisenhower Matrix (4-quadrant prioritization):
- **Q1** (Urgent + Important): Do First - Red
- **Q2** (Not Urgent + Important): Schedule - Yellow
- **Q3** (Urgent + Not Important): Delegate - Blue
- **Q4** (Not Urgent + Not Important): Eliminate - Green

## ✨ Features

- **Multi-tab Organization**: TODAY (aggregated view), Family, Official, Self, + custom tabs
- **Smart Notifications**: Deadline reminders at configurable times (day start/end)
- **Import/Export**: Excel/CSV support with auto tab creation
- **Recurring Tasks**: Daily, weekly, monthly, yearly patterns
- **Priority Indicators**: Visual cues for high-priority tasks on tabs
- **Edit Functionality**: Modify tasks including quadrant changes
- **Mobile-Friendly**: Works on iOS, Android, Windows, Linux, macOS

## 📁 Project Structure

```
TaskMatrix\                  # 🎯 You are here - Source of truth
├── index.html              # Core application (edit this!)
├── build-desktop.ps1       # Build desktop app
├── build-mobile.md         # Mobile build instructions
├── ARCHITECTURE.md         # Technical documentation
└── README.md               # This file
```

### Related Folders
- **TaskMatrix-Mobile**: React Native project (iOS + Android)
- **TaskMatrix-Desktop**: Electron project (Windows/Linux/macOS)

## 🚀 Quick Start

### Desktop (Windows)

1. **Test in browser**:
   ```powershell
   start index.html
   ```

2. **Build executable**:
   ```powershell
   .\build-desktop.ps1
   ```
   Output: `TaskMatrix-Desktop\dist\Task Matrix 3.0.0.exe`

### Mobile (iOS + Android)

See `build-mobile.md` for detailed instructions.

**Quick version**:
```powershell
# Install EAS CLI (first time only)
npm install -g eas-cli

# Login to Expo (first time only)
eas login

# Sync HTML to mobile project
Copy-Item "index.html" -Destination "..\TaskMatrix-Mobile\assets\html\index-v2.html" -Force

# Build Android APK
cd ..\TaskMatrix-Mobile
eas build --platform android --profile preview
```

## 🛠️ Development

### Making Changes

1. **Edit** `index.html` in this folder (source of truth)
2. **Test** in browser or Electron dev mode
3. **Build** for your target platform(s)

### Tech Stack

- **Core**: HTML + JavaScript (pure, no framework)
- **Desktop**: Electron (Chromium + Node.js)
- **Mobile**: React Native with WebView
- **Storage**: localStorage (offline-first)
- **Libraries**: XLSX for Excel import/export

## 📦 Distribution

### Windows ✅ (Ready Now)
- Share `Task Matrix 3.0.0.exe` (portable, no install)
- Or `Task Matrix Setup 3.0.0.exe` (installer with shortcuts)
- No account/registration needed

### Android 🔜 (Setup Required)
- Build APK with EAS (free tier available)
- Share APK directly (no Play Store needed)
- Users enable "Install from Unknown Sources"

### iOS 🔜 (Apple Developer $99/year)
- Build with EAS
- Distribute via TestFlight (beta, up to 10K testers)
- Or submit to App Store

### Linux/macOS 🔜
- Update `TaskMatrix-Desktop\package.json`
- Build on respective platform or use CI/CD

## 📊 Data Storage

All data stored locally in browser's localStorage:
- **tasks_v2**: Task database
- **customTabs**: User-created tabs
- **appSettings**: User preferences
- **lastNotificationTime**: Notification state

**Note**: No cloud sync (data stays on device). Each device has independent data.

## 🔧 Build Scripts

### Desktop Build (`build-desktop.ps1`)
1. Syncs `index.html` → `TaskMatrix-Desktop\index.html`
2. Runs `npm run build:win` in desktop folder
3. Creates executables in `dist\` folder

### Mobile Build (see `build-mobile.md`)
1. Manually sync HTML to mobile folder
2. Run EAS build command
3. Download from Expo cloud

## 📖 Documentation

- **ARCHITECTURE.md**: Technical details, folder structure, platform info
- **build-mobile.md**: Complete mobile build guide
- **build-desktop.ps1**: Automated desktop build script

## 🎨 Customization

### Colors (in index.html)
- Q1: `#fee2e2` (light red)
- Q2: `#fef3c7` (light yellow)
- Q3: `#dbeafe` (light blue)
- Q4: `#d1fae5` (light green)

### Settings (in app)
- Click ⚙️ icon to open settings modal
- Configure day start/end times
- Toggle notifications
- Set minimum reminder interval

### Adding Features
All code is in `index.html` (self-contained):
- HTML structure: Lines 1-200
- CSS: Lines 200-500
- JavaScript: Lines 500-2000+

## 🤝 Contributing

### To Add a Feature:
1. Edit `index.html`
2. Test in browser
3. Rebuild desktop/mobile

### To Fix a Bug:
1. Find code in `index.html`
2. Fix and test
3. Rebuild affected platforms

## 📄 License

MIT License

## 👤 Author

**Kaushal RSK**  
📧 rskkinfosec@gmail.com

## 🐛 Known Issues

- No cloud sync (localStorage only)
- No multi-device synchronization
- Excel export requires desktop browser (mobile uses CSV)
- Notification times must be manually configured per device

## 🗺️ Roadmap

- [ ] Cloud sync option (Firebase/Supabase)
- [ ] Push notifications (instead of in-app only)
- [ ] Dark mode
- [ ] Task templates
- [ ] Sub-tasks support
- [ ] Time tracking enhancements
- [ ] Progressive Web App (PWA) version

---

**Version**: 3.0.0  
**Last Updated**: November 6, 2025  
**Platforms**: Windows ✅ | Linux ✅ | macOS ✅ | iOS ✅ | Android ✅

� **Quick Reference**: See `e:\APPS\BUILD-LAUNCH-GUIDE.md` for all build commands
