# Task Matrix - Mobile (iOS + Android)# My WebView App



This folder contains the React Native wrapper for Task Matrix mobile apps.A simple cross-platform mobile app that displays web content using React Native and Expo. Works on iOS, Android, and Web!



## 🎯 Purpose## 🚀 What This App Does



React Native provides a thin wrapper (~10 lines) that loads the HTML app in a WebView. This single codebase handles **BOTH iOS and Android**.- Displays web content in a native app shell

- Currently points to Google.com for testing

## 📦 What's Inside- Has a URL bar to test different websites

- Easy to configure to point to your own server

```

TaskMatrix-Mobile\## 📋 Prerequisites

├── App.js                      # React Native wrapper (WebView)

├── app.json                    # Expo configurationBefore you start, you need to install:

├── package.json                # Dependencies

├── assets\1. **Node.js and npm** (if not already installed)

│   └── html\   - Download from: https://nodejs.org/

│       └── index-v2.html       # Core app (synced from TaskMatrix\)   - Choose the LTS version

├── node_modules\               # Installed packages   - This installs both Node.js and npm

└── .expo\                      # Expo cache

```2. **Expo Go app** on your iPhone

   - Open App Store on your iPhone

## 🚀 Quick Start   - Search for "Expo Go"

   - Install it (it's free!)

### Testing (No Build Required)

## 🔧 Setup Instructions

```powershell

# Install dependencies (first time only)1. **Install dependencies** (first time only):

npm install   ```powershell

   npm install

# Start Expo dev server   ```

npx expo start --tunnel

2. **Start the development server**:

# Scan QR code with:   ```powershell

# - Expo Go app (iOS: App Store, Android: Play Store)   npm start

# - Your device camera (iOS only)   ```

```

3. **Test on your iPhone**:

### Building Production APK/IPA   - A QR code will appear in your terminal

   - Open **Expo Go** app on your iPhone

See `E:\APPS\TaskMatrix\build-mobile.md` for complete instructions.   - Tap "Scan QR code"

   - Point camera at the QR code

**Quick build (Android)**:   - Your app will load instantly!

```powershell

# Sync latest HTML## 📱 Available Commands

Copy-Item "..\TaskMatrix\index.html" -Destination "assets\html\index-v2.html" -Force

- `npm start` - Start the Expo development server

# Build APK- `npm run ios` - Open in iOS simulator (requires Mac)

eas build --platform android --profile preview- `npm run android` - Open in Android emulator

```- `npm run web` - Open in web browser



**Quick build (iOS)**:## 🔄 Changing the URL

```powershell

# Sync latest HTML### Option 1: Use the URL bar in the app

Copy-Item "..\TaskMatrix\index.html" -Destination "assets\html\index-v2.html" -ForceJust type a new URL and tap "Go"



# Build IPA (requires Apple Developer account $99/year)### Option 2: Change the default URL in code

eas build --platform iosOpen `App.js` and change this line:

``````javascript

const [url, setUrl] = useState('https://www.google.com');

## 🔧 Configuration```



### app.jsonChange to your server:

- **name**: "Task Matrix"```javascript

- **slug**: "TaskMatrix-Mobile"const [url, setUrl] = useState('https://your-server.com');

- **version**: "3.0.0"```

- **platforms**: iOS, Android

- **orientation**: "portrait"### Option 3: Remove the URL bar for production

- **icon**: Default Expo icon (customize if needed)In `App.js`, remove or comment out the entire `urlBar` View:

```javascript

### package.json{/* URL Input Bar - You can remove this later for production */}

- **expo**: 54.0.0<View style={styles.urlBar}>

- **react-native-webview**: 13.15.0  ...

- **react**: 19.0.0</View>

- **react-native**: 0.79.1```



## 📱 Platforms## 🌐 Point to Your Own Server



### iOSWhen you're ready to use your own server:

- **Requirements**: 

  - Apple Developer account ($99/year) for production builds1. Replace the URL in `App.js`

  - Or use Expo Go for testing (free)2. Make sure your server returns proper HTML

- **Output**: .ipa file3. Test it using the URL bar first

- **Distribution**: TestFlight (beta) or App Store4. Remove the URL bar for production



### AndroidExample pointing to your server:

- **Requirements**: None (free build)```javascript

- **Output**: .apk fileconst [url, setUrl] = useState('http://192.168.1.100:3000');

- **Distribution**: Share APK directly, users install via "Unknown Sources"```



## 🔄 Syncing HTML**Important:** For local development:

- Use your computer's local IP address (not localhost)

**IMPORTANT**: Always sync the latest HTML before building!- Find it with: `ipconfig` (Windows)

- Your iPhone must be on the same WiFi network

```powershell

Copy-Item "..\TaskMatrix\index.html" -Destination "assets\html\index-v2.html" -Force## 📦 Building for Production

```

### For iOS (requires Apple Developer Account):

Or create a build script (see TaskMatrix\build-mobile.md).```powershell

npx expo build:ios

## 📂 Source of Truth```



**DO NOT** edit `assets\html\index-v2.html` directly!### For Android:

```powershell

Edit `E:\APPS\TaskMatrix\index.html` instead, then sync.npx expo build:android

```

## 🐛 Troubleshooting

### Using EAS Build (recommended):

### "Expo Go not installed"```powershell

Install Expo Go from App Store (iOS) or Play Store (Android).npm install -g eas-cli

eas build --platform ios

### "Network error" / "Can't reach server"eas build --platform android

Use `--tunnel` flag: `npx expo start --tunnel````



### "Module not found"## 🎨 Customization

Run: `npm install`

### Change App Name

### Build fails on EASEdit `app.json`:

- Check you're logged in: `eas whoami````json

- Verify configuration: `eas build:configure`"name": "Your App Name",

- Check free tier limits on Expo dashboard"slug": "your-app-name"

```

## 📖 Documentation

### Change App Icon

- **Main README**: `E:\APPS\TaskMatrix\README.md`Replace files in `assets/` folder:

- **Architecture**: `E:\APPS\TaskMatrix\ARCHITECTURE.md`- `icon.png` - App icon (1024x1024)

- **Build Guide**: `E:\APPS\TaskMatrix\build-mobile.md`- `splash.png` - Splash screen

- `adaptive-icon.png` - Android icon

## 🔗 Links

### Change Bundle ID (for App Store)

- Expo Documentation: https://docs.expo.devEdit `app.json`:

- EAS Build: https://docs.expo.dev/build/introduction/```json

- React Native WebView: https://github.com/react-native-webview/react-native-webview"ios": {

  "bundleIdentifier": "com.yourname.yourapp"

---},

"android": {

**Version**: 3.0.0    "package": "com.yourname.yourapp"

**Framework**: React Native + Expo  }

**Target Platforms**: iOS + Android```


## 🔍 Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Can't scan QR code
- Make sure iPhone and computer are on same WiFi
- Try pressing `w` to open in web browser
- Check firewall settings

### Website not loading
- Check URL is correct (include https://)
- Some websites block WebView (try your own server)
- Check internet connection

### Need to reload app
- Shake your iPhone to open developer menu
- Tap "Reload"

## 📚 Next Steps

1. ✅ Test with Google (done!)
2. Create a simple HTML page on your server
3. Point the app to your server URL
4. Test your own content
5. Remove URL bar and polish UI
6. Build for production

## 🆘 Need Help?

- Expo Documentation: https://docs.expo.dev/
- React Native WebView: https://github.com/react-native-webview/react-native-webview
- Expo Community: https://forums.expo.dev/

## 🎯 Future Enhancements

- Add loading indicator
- Add error handling
- Add offline mode
- Add navigation controls (back/forward)
- Add native features (camera, GPS, etc.)
- Create proper icon and splash screen

---

**Ready to test?** Run `npm start` and scan the QR code with Expo Go!
