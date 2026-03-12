# Map Setup Guide – Create Order (iOS & Android)

## Summary of Changes

1. **Map integration** – MapView shows pickup (green marker) and drop (red marker) locations
2. **Address search** – Google Places autocomplete for pickup and drop
3. **Current location** – "Use Current Location" button for pickup
4. **Geocoding** – Manual address entry is geocoded on submit
5. **Google Maps API key** – Centralized in `src/Api/index.tsx`

---

## Android Setup

Android is already configured:

- Google Maps API key is in `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="AIzaSyDgFGS91BvviXh_f-nmvtEggUHJcaGyUwA"/>
  ```
- Location permissions are present (ACCESS_FINE_LOCATION, etc.)

**Run:**
```bash
npm run android
```

---

## iOS Setup

### 1. Podfile

`react-native-maps` Google provider is already added in `ios/Podfile`:

```ruby
rn_maps_path = '../node_modules/react-native-maps'
pod 'react-native-google-maps', :path => rn_maps_path
```

(For react-native-maps v1.15.x use `react-native-google-maps`. v1.23.0+ uses `react-native-maps/Google`.)

### 2. AppDelegate.swift

Google Maps API key is already set in `ios/Gfinance/AppDelegate.swift`:

```swift
import GoogleMaps

// In didFinishLaunchingWithOptions:
GMSServices.provideAPIKey("AIzaSyDgFGS91BvviXh_f-nmvtEggUHJcaGyUwA")
```

### 3. Run Pod Install

From the project root:

```bash
cd ios && pod install
```

### 4. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Use your API key: `AIzaSyDgFGS91BvviXh_f-nmvtEggUHJcaGyUwA`
3. Enable:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Places API** (for address autocomplete)
   - **Geocoding API** (for address → coordinates)

### 5. Run iOS

```bash
npm run ios
```

---

## Create Order Flow

1. **Map** – Shows pickup and drop markers when both are set
2. **Pickup** – Use Search or "Use Current Location"
3. **Drop** – Use Search
4. **Manual address** – Type or paste address; coordinates are geocoded on submit

---

## API Key Location

- **Code:** `src/Api/index.tsx` → `GOOGLE_MAPS_APIKEY`
- **Android:** `android/app/src/main/AndroidManifest.xml`
- **iOS:** `ios/Gfinance/AppDelegate.swift`
