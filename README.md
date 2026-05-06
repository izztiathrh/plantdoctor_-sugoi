# plantdoctor\_-sugoi

Plant Doctor - Smart AI Plant Heath Monitoring System

## Free AI image analysis

Plant Doctor always runs a free offline leaf scan first. To enable the optional Gemini free-tier vision API, create a Google AI Studio key and set it before starting the app:

```powershell or terminal vscode
$env:EXPO_PUBLIC_GEMINI_API_KEY="your_gemini_key_here"
$env:EXPO_PUBLIC_GEMINI_API_KEY.Substring(0,3) untuk check api works or not
npm.cmd run web
```

Optional Gemini model override:

```powershell
$env:EXPO_PUBLIC_GEMINI_MODEL="gemini-2.5-flash"
```

Without a key, the app still works using the offline AI fallback and never sends images to an API. Hugging Face tokens are still supported as an experimental fallback, but many plant-disease models are not currently supported by the free HF Inference provider.
