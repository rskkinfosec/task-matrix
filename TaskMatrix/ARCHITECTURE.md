# Task Matrix - Architecture Documentation

## Overview

Task Matrix uses a **single-source-of-truth architecture** where one HTML file serves as the core application for all platforms (Windows, Linux, macOS, iOS, Android).

## Folder Structure

```
E:\APPS\
├── TaskMatrix\                    # 🎯 SOURCE OF TRUTH
│   ├── index.html                 # Core application (2000+ lines)
│   ├── build-desktop.ps1          # Build script for desktop
│   ├── build-mobile.md            # Build instructions for mobile
│   └── ARCHITECTURE.md            # This file
│
├── TaskMatrix-Desktop\            # 🖥️ DESKTOP (Electron)
│   ├── main.js                    # Electron window manager
│   ├── package.json               # Desktop dependencies
│   ├── index.html                 # Auto-synced from source
│   └── dist\                      # Built executables (.exe)
│
└── TaskMatrix-Mobile\             # 📱 MOBILE (React Native)
    ├── App.js                     # React Native wrapper (~10 lines)
    ├── app.json                   # Expo configuration
    ├── package.json               # Mobile dependencies
    └── assets\html\
        └── index-v2.html          # Auto-synced from source
```

## Platform Technologies

### Desktop (Windows/Linux/macOS)
- **Framework**: Electron (Chromium + Node.js)
- **Wrapper**: `main.js` (~50 lines) - Creates window and loads HTML
- **Build Tool**: electron-builder
- **Output**: 
  - Windows: `.exe` (portable) + Setup.exe (installer)
  - Linux: `.AppImage` or `.deb`
  - macOS: `.dmg`
- **Build Command**: `npm run build:win` (in TaskMatrix-Desktop folder)

### Mobile (iOS + Android)
- **Framework**: React Native with Expo
- **Wrapper**: `App.js` (~10 lines) - WebView component loading HTML
- **Build Service**: EAS (Expo Application Services) - Cloud builds
- **Output**:
  - Android: `.apk` (direct install) or `.aab` (Play Store)
  - iOS: `.ipa` (TestFlight/App Store)
- **Build Command**: `eas build --platform android` or `eas build --platform ios`

## Core Application (index.html)

The `E:\APPS\TaskMatrix\index.html` file contains the entire application:

### Features
- Eisenhower Matrix with 4 quadrants (Q1-Q4)
- Multi-tab system: TODAY (aggregated), Family, Official, Self, + custom tabs
- Task management: Create, Edit, Delete, Complete, Recurring
- Import/Export: Excel/CSV support
- Smart notifications: Deadline reminders with configurable intervals
- Settings: Day start/end times, notification preferences
- Priority indicators: Visual cues for high-priority tasks

### Data Storage
- **Technology**: localStorage (browser-based, 5-10MB limit)
- **Keys**:
  - `tasks_v2`: All task data
  - `customTabs`: User-created tabs
  - `appSettings`: User preferences
  - `lastNotificationTime`: Notification state
  - `lastDayStartNotification`, `lastDayEndNotification`: Day boundary reminders

### Dependencies
- **XLSX library** (0.18.5): Excel import/export functionality
- **No framework**: Pure JavaScript (no React/Vue/Angular)
- **Self-contained**: All CSS and JavaScript inline in single HTML file

## Build Process

### Desktop Build Flow
1. Edit `E:\APPS\TaskMatrix\index.html` (source of truth)
2. Run `build-desktop.ps1`:
   - Copies `index.html` → `TaskMatrix-Desktop\index.html`
   - Runs `npm run build:win`
   - electron-builder packages into `.exe` files
3. Output in `TaskMatrix-Desktop\dist\`

### Mobile Build Flow
1. Edit `E:\APPS\TaskMatrix\index.html` (source of truth)
2. Manually sync or create script:
   ```powershell
   Copy-Item "E:\APPS\TaskMatrix\index.html" -Destination "E:\APPS\TaskMatrix-Mobile\assets\html\index-v2.html" -Force
   ```
3. Run EAS build:
   ```powershell
   cd E:\APPS\TaskMatrix-Mobile
   eas build --platform android
   ```
4. Download APK from Expo cloud build service

## Why This Architecture?

### ✅ Advantages
- **Single source of truth**: One file to maintain for all platforms
- **Rapid development**: Edit HTML, rebuild, done
- **No framework lock-in**: Pure HTML/JavaScript, portable forever
- **Offline-first**: localStorage persists data locally
- **Simple deployment**: Just sync HTML and rebuild wrappers
- **Small app size**: Core app is <500KB (wrappers add platform overhead)

### ⚠️ Considerations
- **localStorage limits**: 5-10MB per domain (sufficient for thousands of tasks)
- **No cloud sync**: Data stays on device (could add later with backend)
- **WebView performance**: Slightly slower than native UI (negligible for this use case)
- **Manual sync**: Must remember to copy HTML to mobile/desktop folders before building

## Deployment Targets

### Windows ✅ (Ready)
- Built and tested: `Task Matrix 3.0.0.exe`
- Distribution: Share executable directly (no installation required)

### Linux 🔜 (Ready to build)
- Update `package.json` in TaskMatrix-Desktop
- Run `npm run build:linux` (requires WSL or Linux machine)

### macOS 🔜 (Ready to build)
- Requires macOS machine for building
- Run `npm run build:mac`

### Android 🔜 (Requires EAS setup)
- Install: `npm install -g eas-cli`
- Login: `eas login`
- Build: `eas build --platform android --profile preview`
- Distribution: Share APK directly

### iOS 🔜 (Requires Apple Developer $99/year)
- Same EAS setup as Android
- Build: `eas build --platform ios`
- Distribution: TestFlight (beta) or App Store (production)

## Development Workflow

### Quick Testing
```powershell
# Desktop: Open HTML in browser
start E:\APPS\TaskMatrix\index.html

# Desktop: Run Electron dev mode
cd E:\APPS\TaskMatrix-Desktop
npm start

# Mobile: Run Expo Go
cd E:\APPS\TaskMatrix-Mobile
npx expo start --tunnel
```

### Production Build
```powershell
# Desktop (Windows)
cd E:\APPS\TaskMatrix
.\build-desktop.ps1

# Mobile (Android)
cd E:\APPS\TaskMatrix-Mobile
Copy-Item "..\TaskMatrix\index.html" -Destination "assets\html\index-v2.html" -Force
eas build --platform android --profile preview
```

## Migration Notes

### Old Structure (Deprecated)
- `E:\APPS\ios\` → Renamed to `TaskMatrix-Mobile\`
- `E:\APPS\TaskMatrix-Windows\` → Renamed to `TaskMatrix-Desktop\`

### Why Rename?
- **Clarity**: "ios" folder actually handled BOTH iOS + Android (confusing!)
- **Consistency**: "Mobile" vs "Desktop" clearly indicates platform targets
- **Scalability**: Easier to understand for new developers

## Future Enhancements

### Possible Additions
- Cloud sync (Firebase, Supabase, or custom backend)
- Push notifications (instead of in-app only)
- Real-time collaboration
- Mobile-specific native features (camera, fingerprint)
- Progressive Web App (PWA) version for web browsers

### Current Limitations
- No cloud backup (localStorage only)
- No multi-device sync
- No real-time updates across devices
- WebView performance ceiling (not native UI speed)

---

**Last Updated**: 2025-01-XX (Restructuring completed)
**Version**: 3.0.0
**Maintained By**: [Your Name]
