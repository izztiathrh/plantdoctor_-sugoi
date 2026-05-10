# GrowMind Plant Doctor

Smart AI plant health monitoring system built with Expo and React Native.

GrowMind helps users track farm sections, monitor plant conditions, schedule harvests, and scan leaf photos for plant health diagnosis. The app works with a built-in offline image analysis fallback, and can optionally use free-tier Gemini or Hugging Face vision APIs when API keys are provided.

## Features

- Plant dashboard with growth score, moisture, humidity, temperature, pH, light, water usage, and energy usage
- Farm section controls for LED, fan, pump, nutrient level, and auto mode
- Plant record management with crop type, variety, planted date, and harvest date
- Calendar view for planting and harvest planning
- Leaf image diagnosis using offline color analysis first
- Optional Gemini and Hugging Face AI image analysis
- Scan history saved locally
- Local login, sign up, password reset, and profile editing with AsyncStorage

## Tech Stack

- Expo 54
- React 19
- React Native 0.81
- TypeScript
- AsyncStorage
- Expo Image Picker
- Expo Image Manipulator
- jpeg-js

## How To Run

### 1. Open The Project Folder

Open PowerShell or the VS Code terminal, then go to the project folder:

```powershell
cd D:\GitHubDesktop\plantdoctor_-sugoi
```

### 2. Install Dependencies

Run this once after downloading or cloning the project:

```powershell
npm install
```

### 3. Start The App In Browser

```powershell
npm run web
```

Expo will start the app and show a local URL in the terminal. Open the URL in your browser if it does not open automatically.

### 4. Login

Use the demo account:

```text
Username: demo
Password: demo123
```

Or create a new account from the sign-up screen.

### Run On Phone Or Emulator

Start Expo:

```powershell
npm start
```

Then:

- Scan the QR code using Expo Go on your phone
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web browser

## Requirements

- Node.js
- npm
- Expo-compatible mobile device, emulator, or browser
- for mobile, download app "Expo Go" to see it on mobile (recommended)

## Optional AI Configuration

The app always runs an offline leaf scan first. API keys are optional.

### Gemini Vision

```powershell
$env:EXPO_PUBLIC_GEMINI_API_KEY="your_gemini_api_key"
```

Optional model override:

```powershell
$env:EXPO_PUBLIC_GEMINI_MODEL="gemini-2.5-flash"
```

### Hugging Face

```powershell
$env:EXPO_PUBLIC_HUGGINGFACE_TOKEN="hf_your_token_here"
```

Optional model override:

```powershell
$env:EXPO_PUBLIC_HUGGINGFACE_MODEL="mesabo/agri-plant-disease-resnet50"
```

After setting environment variables, start the app from the same terminal session:

```powershell
npm run web
```

If no API key or token is configured, the app still works with offline image analysis and does not send images to an external AI service.

## Project Structure

```text
.
|-- App.tsx
|-- src
|   |-- pages
|   |   |-- CalendarPage.tsx
|   |   |-- DoctorPage.tsx
|   |   |-- HomePage.tsx
|   |   |-- LoginScreen.tsx
|   |   |-- MyFarmPage.tsx
|   |   |-- MyPlantsPage.tsx
|   |   `-- ProfileScreen.tsx
|   `-- shared.tsx
|-- assets
|-- package.json
`-- tsconfig.json
```

## Scripts

| Command           | Description            |
| ----------------- | ---------------------- |
| `npm start`       | Start Expo             |
| `npm run web`     | Start Expo for web     |
| `npm run android` | Start Expo for Android |
| `npm run ios`     | Start Expo for iOS     |

## Notes

- Expo public environment variables must be available before the app starts.
- Browser image scanning uses web-compatible analysis.
- Native image scanning uses Expo Image Manipulator before local diagnosis.
- This project is designed as a prototype/demo and stores user data locally.
