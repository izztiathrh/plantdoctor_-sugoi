# plantdoctor\_-sugoi

Plant Doctor - Smart AI Plant Heath Monitoring System

## Free AI image analysis

Plant Doctor always runs a free offline leaf scan first. To enable the optional free-tier Hugging Face plant disease classifier, create an Expo public env value before starting the app:

```powershell or terminal vscode
$env:EXPO_PUBLIC_HUGGINGFACE_TOKEN="hf_your_token_here"
$env:EXPO_PUBLIC_HUGGINGFACE_TOKEN.Substring(0,3) untuk check api works or not
if output hf_, means working

$env:EXPO_PUBLIC_GEMINI_API_KEY="api key dekat sini"
$env:EXPO_PUBLIC_GEMINI_API_KEY.Substring(0,3)
AIza
npm.cmd run web
```

Optional model override:

```powershell
$env:EXPO_PUBLIC_HUGGINGFACE_MODEL="mesabo/agri-plant-disease-resnet50"
```

Without a token, the app still works using the offline AI fallback and never sends images to an API.
