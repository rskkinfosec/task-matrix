# Task Matrix - Desktop (Windows/Linux/macOS)

This folder contains the Electron wrapper for Task Matrix desktop apps.

## 🎯 Purpose

Electron provides a cross-platform desktop environment (Chromium + Node.js) that loads the HTML app. This single codebase can build for Windows, Linux, and macOS.

## 📦 What's Inside

```
TaskMatrix-Desktop\
├── main.js                     # Electron window manager
├── package.json                # Dependencies & build config
├── index.html                  # Core app (synced from TaskMatrix\)
├── node_modules\               # Installed packages
└── dist\                       # Built executables (after build)
    ├── Task Matrix 3.0.0.exe   # Portable version
    └── Task Matrix Setup 3.0.0.exe  # Installer
```

## 🚀 Quick Start

### Testing (No Build Required)

```powershell
# Install dependencies (first time only)
npm install

# Run in dev mode
npm start
```

### Building Production Executables

**Automated build** (from TaskMatrix folder):
```powershell
cd ..\TaskMatrix
.\build-desktop.ps1
```

**Manual build**:
```powershell
# Sync latest HTML
Copy-Item "..\TaskMatrix\index.html" -Destination "index.html" -Force

# Build Windows executable
npm run build:win
```

## 🔧 Configuration

### package.json
- **name**: "task-matrix"
- **version**: "3.0.0"
- **main**: "main.js"
- **electron**: 39.1.0
- **electron-builder**: 26.0.12

### Build Settings (in package.json)
```json
"build": {
  "appId": "com.taskmatrix.app",
  "productName": "Task Matrix",
  "win": {
    "target": ["nsis", "portable"],
    "icon": "assets/icon.ico"
  }
}
```

## 🖥️ Platforms

### Windows ✅ (Current)
- **Output**: 
  - `Task Matrix 3.0.0.exe` (portable, no install)
  - `Task Matrix Setup 3.0.0.exe` (installer with shortcuts)
- **Size**: ~95 MB each
- **Distribution**: Share files directly

### Linux 🔜 (Ready to Build)
Update package.json:
```json
"linux": {
  "target": ["AppImage", "deb"],
  "category": "Utility"
}
```
Build: `npm run build:linux` (requires Linux or WSL)

### macOS 🔜 (Ready to Build)
Update package.json:
```json
"mac": {
  "target": ["dmg", "zip"],
  "category": "public.app-category.productivity"
}
```
Build: `npm run build:mac` (requires macOS)

## 🔄 Syncing HTML

**IMPORTANT**: Always sync the latest HTML before building!

```powershell
Copy-Item "..\TaskMatrix\index.html" -Destination "index.html" -Force
```

Or use the automated script: `TaskMatrix\build-desktop.ps1`

## 📂 Source of Truth

**DO NOT** edit `index.html` in this folder directly!

Edit `E:\APPS\TaskMatrix\index.html` instead, then sync.

## 🐛 Troubleshooting

### "Module not found"
Run: `npm install`

### Build fails with signing error
- Signing is disabled in package.json
- If error persists, check file permissions

### PowerShell script blocked
Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

### "npm command not found"
Install Node.js from https://nodejs.org

## 📖 Documentation

- **Main README**: `E:\APPS\TaskMatrix\README.md`
- **Architecture**: `E:\APPS\TaskMatrix\ARCHITECTURE.md`
- **Build Script**: `E:\APPS\TaskMatrix\build-desktop.ps1`

## 🔗 Links

- Electron Documentation: https://www.electronjs.org/docs
- electron-builder: https://www.electron.build
- Node.js: https://nodejs.org

---

**Version**: 3.0.0  
**Framework**: Electron  
**Target Platforms**: Windows ✅ | Linux 🔜 | macOS 🔜
