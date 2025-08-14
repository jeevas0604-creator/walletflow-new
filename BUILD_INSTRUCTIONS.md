# WalletFlow APK Build Instructions

## Prerequisites
- Node.js 18+ installed
- Android Studio with Android SDK
- Java Development Kit (JDK) 11 or later

## Build Steps

### 1. Clone and Setup
```bash
git clone [your-github-repo-url]
cd walletflow-new
npm install
```

### 2. Add Android Platform
```bash
npx cap add android
npx cap update android
```

### 3. Build Web Assets
```bash
npm run build
```

### 4. Sync to Native Platform
```bash
npx cap sync android
```

### 5. Open in Android Studio
```bash
npx cap open android
```

### 6. Generate APK in Android Studio
1. In Android Studio: Build → Generate Signed Bundle / APK
2. Choose APK
3. Create/select keystore for signing
4. Build release APK

## Important Notes

- **Permissions**: The app requires SMS reading permissions for transaction analysis
- **Testing**: Test SMS permissions on a real device (not emulator)
- **Signing**: For Play Store distribution, create a proper keystore and sign the APK
- **Development**: Uncomment server section in capacitor.config.ts for hot-reload during development

## File Configuration

- `capacitor.config.ts` - Configured for production builds (server section commented out)
- `android-manifest-permissions.xml` - Lists all required Android permissions
- All Capacitor dependencies are properly installed

## Troubleshooting

1. **SMS Plugin Issues**: Ensure you're testing on a real Android device
2. **Build Failures**: Run `npx cap sync` after any changes to web assets
3. **Permission Denied**: Check that all required permissions are in AndroidManifest.xml

The project is ready for APK generation!