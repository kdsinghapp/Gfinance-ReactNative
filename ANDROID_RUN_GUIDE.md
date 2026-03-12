# Android Run Guide - Gfinance

## Issue: "No emulators found" / App won't install

### Solution 1: Create Android Emulator (Recommended)

1. **Open Android Studio**
2. Go to **Tools → Device Manager** (or **AVD Manager**)
3. Click **Create Device**
4. Select a phone (e.g. **Pixel 6**) → **Next**
5. Select a system image (e.g. **API 34** - Tiramisu) → **Download** if needed → **Next**
6. Name it (e.g. `Pixel_6_API_34`) → **Finish**
7. **Start the emulator** by clicking the ▶️ play button
8. Wait for emulator to fully boot
9. Run: `npm run android`

### Solution 2: Use Physical Android Device

1. On your phone: **Settings → About Phone** → Tap **Build Number** 7 times (enables Developer Options)
2. **Settings → Developer Options** → Enable **USB Debugging**
3. Connect phone via USB
4. Run: `adb devices` (verify device is listed)
5. Run: `npm run android`

### Solution 3: If Build Gets Stuck at 99%

Clean and rebuild:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Quick Check: List Available Emulators

```bash
# See if any AVDs exist
emulator -list-avds

# If empty, create one via Android Studio first (Solution 1)
```

### Run on Specific Device (if multiple connected)

```bash
# List devices
adb devices

# Run on specific device
npm run android -- --deviceId=<device_id>
```
