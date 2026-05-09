import * as ImageManipulator from "expo-image-manipulator";
import jpeg from "jpeg-js";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

export type TabKey = "My Farm" | "My Plants" | "Home" | "Calendar" | "Doctor";

export type CropKey = "lettuce" | "basil" | "strawberry" | "spinach";

export type Plant = {
  id: string;
  cropKey: CropKey;
  name: string;
  section: string;
  variety: string;
  plantedDate: string;
  harvestDay: number;
  temp: number;
  humidity: number;
  moisture: number;
  ph: number;
  light: number;
  waterToday: number;
  energyToday: number;
  growthScore: number;
  history: number[];
};

export type FarmSection = {
  id: string;
  name: string;
  plantId: string;
  led: number;
  fan: number;
  pump: number;
  nutrient: number;
  auto: boolean;
};

export type CalendarItem = {
  id: string;
  plantId: string;
  plantName: string;
  cropKey: CropKey;
  plantedDate: string;
  harvestDate: string;
};

export type HomeAlert = {
  id: string;
  plantId: string;
  sectionId: string;
  section: string;
  plantName: string;
  issue: string;
  severity: "High" | "Medium" | "Low";
  recommendation: string;
  actionField: "pump" | "fan" | "nutrient" | "led";
  actionDelta: number;
};

export type HarvestReadiness = {
  plantId: string;
  plantName: string;
  section: string;
  harvestDate: string;
  daysLeft: number;
  score: number;
  status: "Ready" | "Almost Ready" | "Delayed";
};

export type DiagnosisMetrics = {
  plantScore: number;
  greenRatio: number;
  yellowRatio: number;
  brownRatio: number;
};

export type Diagnosis = {
  title: string;
  confidence: number;
  color: string;
  symptoms: string;
  action: string;
  isPlant: boolean;
  source?: string;
  aiLabel?: string;
  aiError?: string;
  metrics?: DiagnosisMetrics;
};

export type ScanHistoryItem = {
  id: string;
  imageUri: string | null;
  diagnosis: Diagnosis;
  scannedAt: string;
};

export type SavedPlantDoctorState = {
  selectedPlantId: string;
  plantRecords: Plant[];
  sections: FarmSection[];
  calendarItems: CalendarItem[];
  scanHistory: ScanHistoryItem[];
};

export type UserRecord = {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  email?: string;
};

export const tabs: TabKey[] = ["My Farm", "My Plants", "Home", "Calendar", "Doctor"];

export const cropTargets: Record<
  CropKey,
  {
    temp: [number, number];
    humidity: [number, number];
    moisture: [number, number];
    ph: [number, number];
  }
> = {
  lettuce: {
    temp: [18, 23],
    humidity: [55, 70],
    moisture: [64, 78],
    ph: [5.8, 6.4],
  },
  basil: {
    temp: [21, 27],
    humidity: [50, 65],
    moisture: [58, 74],
    ph: [5.9, 6.6],
  },
  strawberry: {
    temp: [18, 25],
    humidity: [55, 68],
    moisture: [60, 75],
    ph: [5.7, 6.5],
  },
  spinach: {
    temp: [17, 24],
    humidity: [54, 72],
    moisture: [66, 82],
    ph: [6.0, 7.0],
  },
};

export const initialPlants: Plant[] = [
  {
    id: "p1",
    cropKey: "lettuce",
    name: "Plant A",
    section: "Section 1",
    variety: "Butterhead lettuce",
    plantedDate: "2026-04-12",
    harvestDay: 31,
    temp: 24.1,
    humidity: 62,
    moisture: 61,
    ph: 6.7,
    light: 74,
    waterToday: 4.2,
    energyToday: 1.8,
    growthScore: 86,
    history: [66, 71, 76, 78, 84, 86],
  },
  {
    id: "p2",
    cropKey: "basil",
    name: "Plant B",
    section: "Section 2",
    variety: "Genovese basil",
    plantedDate: "2026-04-18",
    harvestDay: 28,
    temp: 25.6,
    humidity: 58,
    moisture: 69,
    ph: 6.2,
    light: 81,
    waterToday: 3.5,
    energyToday: 2.1,
    growthScore: 91,
    history: [70, 75, 77, 82, 88, 91],
  },
  {
    id: "p3",
    cropKey: "strawberry",
    name: "Plant C",
    section: "Section 3",
    variety: "Albion strawberry",
    plantedDate: "2026-03-29",
    harvestDay: 48,
    temp: 23.4,
    humidity: 71,
    moisture: 73,
    ph: 6.1,
    light: 88,
    waterToday: 5.1,
    energyToday: 2.8,
    growthScore: 79,
    history: [58, 62, 67, 72, 76, 79],
  },
];

export const initialSections: FarmSection[] = [
  {
    id: "s1",
    name: "Section 1",
    plantId: "p1",
    led: 76,
    fan: 74,
    pump: 48,
    nutrient: 62,
    auto: true,
  },
  {
    id: "s2",
    name: "Section 2",
    plantId: "p2",
    led: 84,
    fan: 42,
    pump: 38,
    nutrient: 34,
    auto: true,
  },
  {
    id: "s3",
    name: "Section 3",
    plantId: "p3",
    led: 88,
    fan: 58,
    pump: 64,
    nutrient: 42,
    auto: false,
  },
];

export const initialCalendar: CalendarItem[] = [
  {
    id: "c1",
    plantId: "p1",
    plantName: "Plant A",
    cropKey: "lettuce",
    plantedDate: "2026-04-12",
    harvestDate: "2026-05-13",
  },
  {
    id: "c2",
    plantId: "p2",
    plantName: "Plant B",
    cropKey: "basil",
    plantedDate: "2026-04-18",
    harvestDate: "2026-05-16",
  },
  {
    id: "c3",
    plantId: "p3",
    plantName: "Plant C",
    cropKey: "strawberry",
    plantedDate: "2026-03-29",
    harvestDate: "2026-05-16",
  },
];

export const cropHarvestDays: Record<CropKey, number> = {
  lettuce: 31,
  basil: 28,
  strawberry: 48,
  spinach: 30,
};

export const cropLabels: Record<CropKey, string> = {
  lettuce: "Lettuce",
  basil: "Basil",
  strawberry: "Strawberry",
  spinach: "Spinach",
};

export const cropVarieties: Record<CropKey, string> = {
  lettuce: "Butterhead lettuce",
  basil: "Genovese basil",
  strawberry: "Albion strawberry",
  spinach: "Space F1 spinach",
};

export const waitingDiagnosis: Diagnosis = {
  title: "Take or upload a plant image",
  confidence: 0,
  color: "#9aa1a8",
  symptoms:
    "Plant Doctor needs a leaf photo before it can verify and diagnose the plant.",
  action: "Use the camera or upload a close-up image of a plant leaf.",
  isPlant: false,
  source: "Free offline AI",
};

export const storageKey = "plantdoctor:v2";

export const demoScans: Array<{
  label: string;
  diagnosis: Diagnosis;
}> = [
  {
    label: "Healthy basil",
    diagnosis: {
      title: "Healthy leaf growth",
      confidence: 94,
      color: "#2d7d4a",
      symptoms:
        "The demo scan shows strong green coverage with no obvious yellowing or dry edges.",
      action:
        "Maintain the current watering cycle, keep airflow steady, and rescan in one week.",
      isPlant: true,
      source: "Demo mode",
      metrics: {
        plantScore: 92,
        greenRatio: 84,
        yellowRatio: 5,
        brownRatio: 2,
      },
    },
  },
  {
    label: "Yellow stress",
    diagnosis: {
      title: "Possible nutrient stress",
      confidence: 87,
      color: "#d49a24",
      symptoms:
        "The demo scan shows yellow leaf areas that may point to chlorosis, low nitrogen, or light imbalance.",
      action:
        "Check nutrient strength, verify pH, trim badly affected leaves, and rescan after 3 days.",
      isPlant: true,
      source: "Demo mode",
      metrics: {
        plantScore: 73,
        greenRatio: 57,
        yellowRatio: 26,
        brownRatio: 4,
      },
    },
  },
  {
    label: "Dry edges",
    diagnosis: {
      title: "Possible dry edge burn",
      confidence: 82,
      color: "#c14f3d",
      symptoms:
        "The demo scan shows brown or dry regions that may be caused by heat stress, disease, or irregular watering.",
      action:
        "Remove damaged leaves, lower heat exposure, stabilize moisture, and rescan in 48 hours.",
      isPlant: true,
      source: "Demo mode",
      metrics: {
        plantScore: 68,
        greenRatio: 52,
        yellowRatio: 9,
        brownRatio: 23,
      },
    },
  },
];

export const huggingFaceImageModel =
  getPublicEnv("EXPO_PUBLIC_HUGGINGFACE_MODEL") ??
  "mesabo/agri-plant-disease-resnet50";
export const huggingFaceApiUrl = `https://router.huggingface.co/hf-inference/models/${huggingFaceImageModel}`;
export const geminiVisionModel =
  getPublicEnv("EXPO_PUBLIC_GEMINI_MODEL") ?? "gemini-2.5-flash";

export function getPublicEnv(key: string) {
  return (globalThis as any).process?.env?.[key] as string | undefined;
}

export function shortenAiError(message: string) {
  return message.length > 120 ? `${message.slice(0, 117)}...` : message;
}

export function aiText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(aiText).filter(Boolean).join(" ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function within(value: number, range: [number, number]) {
  return value >= range[0] && value <= range[1];
}

export function daysBetween(startDate: string, endDate = "2026-05-05") {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

export function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

export function getAutoRecipe(plant: Plant) {
  const recipes: Record<
    CropKey,
    Pick<FarmSection, "led" | "fan" | "pump" | "nutrient">
  > = {
    lettuce: { led: 68, fan: 72, pump: 56, nutrient: 60 },
    basil: { led: 82, fan: 48, pump: 42, nutrient: 46 },
    strawberry: { led: 88, fan: 62, pump: 66, nutrient: 52 },
    spinach: { led: 64, fan: 68, pump: 58, nutrient: 48 },
  };
  const base = recipes[plant.cropKey];
  const target = cropTargets[plant.cropKey];

  return {
    led: clamp(base.led + (plant.light > 85 ? -4 : 0), 0, 100),
    fan: clamp(base.fan + (plant.temp > target.temp[1] ? 10 : 0), 0, 100),
    pump: clamp(
      base.pump + (plant.moisture < target.moisture[0] ? 12 : 0),
      0,
      100,
    ),
    nutrient: clamp(
      base.nutrient + (!within(plant.ph, target.ph) ? 10 : 0),
      0,
      100,
    ),
  };
}

export function createPlantFromSchedule({
  id,
  cropKey,
  name,
  section,
  plantedDate,
}: {
  id: string;
  cropKey: CropKey;
  name: string;
  section: string;
  plantedDate: string;
}): Plant {
  const target = cropTargets[cropKey];
  const center = {
    temp: (target.temp[0] + target.temp[1]) / 2,
    humidity: Math.round((target.humidity[0] + target.humidity[1]) / 2),
    moisture: Math.round((target.moisture[0] + target.moisture[1]) / 2),
    ph: Number(((target.ph[0] + target.ph[1]) / 2).toFixed(1)),
  };

  return {
    id,
    cropKey,
    name,
    section,
    variety: cropVarieties[cropKey],
    plantedDate,
    harvestDay: cropHarvestDays[cropKey],
    temp: center.temp,
    humidity: center.humidity,
    moisture: center.moisture,
    ph: center.ph,
    light: cropKey === "strawberry" ? 86 : cropKey === "basil" ? 80 : 72,
    waterToday: cropKey === "strawberry" ? 5.0 : 3.8,
    energyToday: cropKey === "strawberry" ? 2.7 : 1.9,
    growthScore: 82,
    history: [64, 68, 72, 75, 79, 82],
  };
}

export function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from(
      { length: totalDays },
      (_, index) => new Date(year, month, index + 1),
    ),
  ];
}

export function formatMonth(date: Date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(date: string | Date) {
  const value = typeof date === "string" ? new Date(`${date}T00:00:00`) : date;
  if (Number.isNaN(value.getTime())) {
    return typeof date === "string" ? date : "--/--/----";
  }
  const day = `${value.getDate()}`.padStart(2, "0");
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
}

export function classifyPlantImageFromMetrics(
  metrics: Diagnosis["metrics"],
): Diagnosis {
  if (!metrics) return waitingDiagnosis;

  const { plantScore, greenRatio, yellowRatio, brownRatio } = metrics;

  if (plantScore < 30 || greenRatio < 18) {
    return {
      title: "Image rejected",
      confidence: clamp(Math.round(96 - plantScore), 72, 96),
      color: "#c14f3d",
      symptoms: `Plant-like pixels are too low. Green coverage is ${greenRatio}% and plant score is ${plantScore}%.`,
      action:
        "Please upload or capture a clear plant leaf photo. GrowMind rejects selfies, screenshots, dark images, and non-plant objects.",
      isPlant: false,
      metrics,
    };
  }

  if (yellowRatio + brownRatio > greenRatio * 1.4) {
    return {
      title: "Image rejected",
      confidence: 86,
      color: "#c14f3d",
      symptoms: `The image has too little leaf-green dominance. Green is ${greenRatio}%, while yellow/brown signals are ${yellowRatio + brownRatio}%.`,
      action:
        "Use a closer plant leaf photo with the leaf filling most of the frame.",
      isPlant: false,
      metrics,
    };
  }

  if (yellowRatio > 18 && yellowRatio > brownRatio) {
    return {
      title: "Nitrogen deficiency likely",
      confidence: clamp(72 + yellowRatio, 78, 94),
      color: "#f0b429",
      symptoms: `Verified plant image. Yellow coverage is ${yellowRatio}%, suggesting chlorosis or nutrient stress.`,
      action:
        "Increase nitrogen by 8 percent, keep pH in range, and rescan after 48 hours.",
      isPlant: true,
      metrics,
    };
  }

  if (brownRatio > 12) {
    return {
      title: "Leaf burn or disease risk",
      confidence: clamp(74 + brownRatio, 78, 93),
      color: "#a45c37",
      symptoms: `Verified plant image. Brown or dry coverage is ${brownRatio}%, which may indicate edge burn, disease, or heat stress.`,
      action:
        "Check LED distance, lower canopy temperature, and isolate the tray if spots spread.",
      isPlant: true,
      metrics,
    };
  }

  if (greenRatio > 34 && yellowRatio < 12 && brownRatio < 8) {
    return {
      title: "Healthy growth",
      confidence: clamp(82 + Math.round(greenRatio / 4), 84, 97),
      color: "#3f9b63",
      symptoms: `Verified plant image. Green coverage is ${greenRatio}% with low yellow and brown stress signals.`,
      action:
        "Maintain the current crop profile and learned light/pump schedule.",
      isPlant: true,
      metrics,
    };
  }

  return {
    title: "Mild stress detected",
    confidence: clamp(72 + Math.round(plantScore / 5), 76, 90),
    color: "#d6604d",
    symptoms: `Verified plant image. Plant score is ${plantScore}%, but color balance suggests early stress.`,
    action:
      "Inspect leaf underside, stabilize humidity, and rescan under brighter natural light.",
    isPlant: true,
    metrics,
  };
}

export const base64Chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export function base64ToBytes(base64: string) {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  const bytes: number[] = [];

  for (let index = 0; index < clean.length; index += 4) {
    const encoded1 = base64Chars.indexOf(clean.charAt(index));
    const encoded2 = base64Chars.indexOf(clean.charAt(index + 1));
    const encoded3 = base64Chars.indexOf(clean.charAt(index + 2));
    const encoded4 = base64Chars.indexOf(clean.charAt(index + 3));
    const chr1 = (encoded1 << 2) | (encoded2 >> 4);
    const chr2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    const chr3 = ((encoded3 & 3) << 6) | encoded4;

    bytes.push(chr1);
    if (encoded3 !== 64 && encoded3 !== -1) bytes.push(chr2);
    if (encoded4 !== 64 && encoded4 !== -1) bytes.push(chr3);
  }

  return new Uint8Array(bytes);
}

export function analyzeRgbaPixels(
  data: Uint8Array | Uint8ClampedArray,
  pixelCount: number,
): Diagnosis {
  let greenPixels = 0;
  let yellowPixels = 0;
  let brownPixels = 0;
  let plantPixels = 0;
  let usefulPixels = 0;

  for (let index = 0; index < pixelCount * 4; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3] ?? 255;
    const brightness = (red + green + blue) / 3;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (alpha < 80 || brightness < 28 || brightness > 245 || saturation < 0.12)
      continue;
    usefulPixels += 1;

    const isGreen = green > red * 1.12 && green > blue * 1.12 && green > 55;
    const isYellow =
      red > 120 && green > 105 && blue < 115 && Math.abs(red - green) < 70;
    const isBrown =
      red > 75 && green > 38 && green < 135 && blue < 105 && red > blue * 1.25;

    if (isGreen) greenPixels += 1;
    if (isYellow) yellowPixels += 1;
    if (isBrown) brownPixels += 1;
    if (isGreen || isYellow || isBrown) plantPixels += 1;
  }

  if (usefulPixels < pixelCount * 0.12) {
    return {
      title: "Image rejected",
      confidence: 94,
      color: "#c14f3d",
      symptoms:
        "The image is too dark, blank, or low-detail for plant verification.",
      action: "Upload or take a clearer leaf photo with visible plant texture.",
      isPlant: false,
      metrics: { plantScore: 0, greenRatio: 0, yellowRatio: 0, brownRatio: 0 },
    };
  }

  return classifyPlantImageFromMetrics({
    plantScore: Math.round((plantPixels / usefulPixels) * 100),
    greenRatio: Math.round((greenPixels / usefulPixels) * 100),
    yellowRatio: Math.round((yellowPixels / usefulPixels) * 100),
    brownRatio: Math.round((brownPixels / usefulPixels) * 100),
  });
}

export async function analyzeImageOnDevice(uri: string): Promise<Diagnosis> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 96 } }],
    {
      base64: true,
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  if (!manipulated.base64) {
    throw new Error("No base64 image data returned");
  }

  const decoded = jpeg.decode(base64ToBytes(manipulated.base64), {
    useTArray: true,
  });
  return analyzeRgbaPixels(decoded.data, decoded.width * decoded.height);
}

export async function loadImageForAnalysis(uri: string) {
  const web = globalThis as any;
  const response = await fetch(uri);
  const blob = await response.blob();

  if (web.createImageBitmap) {
    return web.createImageBitmap(blob);
  }

  const objectUrl = web.URL.createObjectURL(blob);
  return new Promise<any>((resolve, reject) => {
    const img = web.document.createElement("img");
    img.onload = () => {
      web.URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      web.URL.revokeObjectURL(objectUrl);
      reject(new Error("Image failed to load"));
    };
    img.src = objectUrl;
  });
}

export async function analyzeImageOnWeb(uri: string): Promise<Diagnosis> {
  if (Platform.OS !== "web") {
    return analyzeImageOnDevice(uri);
  }

  const image = await loadImageForAnalysis(uri);
  const web = globalThis as any;
  const canvas = web.document.createElement("canvas");
  const size = 96;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    return {
      title: "Image could not be verified",
      confidence: 0,
      color: "#c14f3d",
      symptoms:
        "The image loaded, but this browser did not expose pixel analysis.",
      action:
        "Try a JPG/PNG image in desktop Chrome so GrowMind can verify plant pixels.",
      isPlant: false,
    };
  }
  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  return analyzeRgbaPixels(pixels, size * size);
}

export function withFreeAiSource(diagnosis: Diagnosis): Diagnosis {
  return {
    ...diagnosis,
    source: diagnosis.source ?? "Free offline AI",
  };
}

export function shouldAskOnlineAi(diagnosis: Diagnosis) {
  const metrics = diagnosis.metrics;

  if (diagnosis.isPlant) return true;
  if (!metrics) return false;

  return (
    metrics.plantScore >= 45 ||
    metrics.greenRatio >= 12 ||
    metrics.yellowRatio + metrics.brownRatio >= 28
  );
}

export function formatAiLabel(label: string) {
  return label
    .replace(/___/g, " - ")
    .replace(/__/g, " - ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function diagnosisFromAiLabel(
  label: string,
  score: number,
  fallback: Diagnosis,
): Diagnosis {
  const readableLabel = formatAiLabel(label);
  const confidence = clamp(Math.round(score * 100), 1, 99);
  const lowerLabel = readableLabel.toLowerCase();
  const isHealthy = lowerLabel.includes("healthy");
  const isDisease =
    lowerLabel.includes("blight") ||
    lowerLabel.includes("rust") ||
    lowerLabel.includes("spot") ||
    lowerLabel.includes("mildew") ||
    lowerLabel.includes("rot") ||
    lowerLabel.includes("scab") ||
    lowerLabel.includes("virus") ||
    lowerLabel.includes("mold") ||
    lowerLabel.includes("scorch") ||
    lowerLabel.includes("mite");

  if (isHealthy) {
    return {
      ...fallback,
      title: "AI says healthy leaf",
      confidence,
      color: "#3f9b63",
      symptoms: `The free AI model classified this as ${readableLabel}. Local pixel checks also measured green/yellow/brown plant signals.`,
      action:
        "Maintain the current crop profile and scan again if color or texture changes.",
      isPlant: true,
      source: "Hugging Face free-tier API",
      aiLabel: readableLabel,
    };
  }

  if (isDisease) {
    return {
      ...fallback,
      title: "AI disease match",
      confidence,
      color: "#d6604d",
      symptoms: `The free AI model matched this leaf to ${readableLabel}. Treat this as a screening result, not a lab diagnosis.`,
      action:
        "Isolate the affected tray, remove damaged leaves, stabilize humidity, and rescan after treatment.",
      isPlant: true,
      source: "Hugging Face free-tier API",
      aiLabel: readableLabel,
    };
  }

  return {
    ...fallback,
    confidence: Math.max(fallback.confidence, confidence),
    symptoms: `${fallback.symptoms} The free AI model returned ${readableLabel}.`,
    source: "Hugging Face free-tier API",
    aiLabel: readableLabel,
  };
}

export async function imageUriToBase64ForAi(uri: string) {
  if (Platform.OS !== "web") {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224 } }],
      {
        base64: true,
        compress: 0.85,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    if (!manipulated.base64) {
      throw new Error("No base64 image data returned");
    }

    return {
      base64: manipulated.base64,
      mimeType: "image/jpeg",
    };
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  const web = globalThis as any;

  return new Promise<{ base64: string; mimeType: string }>(
    (resolve, reject) => {
      const reader = new web.FileReader();
      reader.onloadend = () => {
        const result = String(reader.result ?? "");
        const [, base64 = ""] = result.split(",");
        resolve({
          base64,
          mimeType: blob.type || "image/jpeg",
        });
      };
      reader.onerror = () => reject(new Error("Image failed to convert"));
      reader.readAsDataURL(blob);
    },
  );
}

export function extractJsonObject(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini returned text instead of JSON");
  }

  return JSON.parse(text.slice(start, end + 1)) as {
    title?: unknown;
    confidence?: number;
    isPlant?: boolean;
    symptoms?: unknown;
    action?: unknown;
  };
}

export async function analyzeImageWithGemini(
  image: { base64: string; mimeType: string },
  localDiagnosis: Diagnosis,
  apiKey: string,
): Promise<Diagnosis> {
  const metricsHint = localDiagnosis.metrics
    ? `Local RGB scan: plantScore ${localDiagnosis.metrics.plantScore}%, green ${localDiagnosis.metrics.greenRatio}%, yellow ${localDiagnosis.metrics.yellowRatio}%, brown ${localDiagnosis.metrics.brownRatio}%.`
    : "Local RGB scan did not return metrics.";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiVisionModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: image.mimeType,
                  data: image.base64,
                },
              },
              {
                text: `You are Plant Doctor for a student vertical-farming app. Analyze this image for plant health. The local RGB scan may be wrong for red, yellow, brown, dry, or variegated real plants, so judge the actual image yourself. ${metricsHint} Return only JSON with keys title, confidence, isPlant, symptoms, action. Confidence must be 0-100. If it is clearly not a real plant, set isPlant false.`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Gemini HTTP ${response.status}: ${shortenAiError(responseText)}`,
    );
  }

  const payload = JSON.parse(responseText) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const result = extractJsonObject(text);
  const confidence =
    typeof result.confidence === "number"
      ? clamp(Math.round(result.confidence), 1, 99)
      : localDiagnosis.confidence;
  const isPlant = result.isPlant ?? localDiagnosis.isPlant;
  const title = aiText(result.title);
  const symptoms = aiText(result.symptoms);
  const action = aiText(result.action);

  return {
    ...localDiagnosis,
    title: title || localDiagnosis.title,
    confidence,
    color: isPlant
      ? title.toLowerCase().includes("healthy")
        ? "#3f9b63"
        : localDiagnosis.color
      : "#c14f3d",
    symptoms: symptoms || localDiagnosis.symptoms,
    action: action || localDiagnosis.action,
    isPlant,
    source: "Gemini free-tier vision API",
    aiLabel: title,
  };
}

export async function analyzeImageWithFreeAi(uri: string): Promise<Diagnosis> {
  const localDiagnosis = withFreeAiSource(await analyzeImageOnWeb(uri));
  const geminiKey = getPublicEnv("EXPO_PUBLIC_GEMINI_API_KEY");
  const huggingFaceToken = getPublicEnv("EXPO_PUBLIC_HUGGINGFACE_TOKEN");

  if (!shouldAskOnlineAi(localDiagnosis)) {
    return localDiagnosis;
  }

  try {
    const image = await imageUriToBase64ForAi(uri);

    if (geminiKey) {
      return await analyzeImageWithGemini(image, localDiagnosis, geminiKey);
    }

    if (!huggingFaceToken) {
      return localDiagnosis;
    }

    const response = await fetch(huggingFaceApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${huggingFaceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: image.base64,
        parameters: { top_k: 3 },
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${shortenAiError(responseText)}`,
      );
    }

    const predictions = JSON.parse(responseText) as Array<{
      label?: string;
      score?: number;
    }>;
    const topPrediction = predictions
      .filter((item) => item.label && typeof item.score === "number")
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];

    if (!topPrediction?.label || topPrediction.score === undefined) {
      return localDiagnosis;
    }

    return diagnosisFromAiLabel(
      topPrediction.label,
      topPrediction.score,
      localDiagnosis,
    );
  } catch (error) {
    return {
      ...localDiagnosis,
      source: "Free offline AI, API unavailable",
      aiError:
        error instanceof Error
          ? shortenAiError(error.message)
          : "Unknown API error",
    };
  }
}

export function shouldUseCameraPicker() {
  return Platform.OS !== "web";
}

export function getScanStatus(diagnosis: Diagnosis) {
  if (!diagnosis.isPlant) return "Not verified";
  if (diagnosis.confidence >= 85) return "High confidence";
  if (diagnosis.confidence >= 65) return "Medium confidence";
  return "Needs clearer photo";
}

export function getTreatmentSteps(diagnosis: Diagnosis) {
  const title = diagnosis.title.toLowerCase();
  const symptoms = diagnosis.symptoms.toLowerCase();

  if (!diagnosis.isPlant) {
    return [
      "Retake the photo with one leaf filling most of the frame.",
      "Avoid dark backgrounds, selfies, screenshots, and blurry photos.",
      "Use a JPG or PNG image under bright natural light.",
    ];
  }

  if (title.includes("healthy")) {
    return [
      "Continue the current watering and nutrient schedule.",
      "Keep airflow stable around the plant canopy.",
      "Scan again next week to compare leaf condition.",
    ];
  }

  if (title.includes("yellow") || symptoms.includes("yellow")) {
    return [
      "Check nutrient level and pH before adding more fertilizer.",
      "Remove badly yellowed leaves so the plant can focus on new growth.",
      "Reduce intense light if yellowing appears near the leaf tips.",
    ];
  }

  if (
    title.includes("brown") ||
    title.includes("dry") ||
    symptoms.includes("brown") ||
    symptoms.includes("dry")
  ) {
    return [
      "Trim dry or infected leaf edges using clean scissors.",
      "Stabilize watering so the tray does not swing between wet and dry.",
      "Improve airflow and isolate the plant if spots continue spreading.",
    ];
  }

  return [
    "Inspect the underside of leaves for pests or spreading spots.",
    "Keep the plant isolated from healthy trays until symptoms improve.",
    "Repeat the scan after treatment to confirm recovery.",
  ];
}

export function getPreventionTips(diagnosis: Diagnosis) {
  if (!diagnosis.isPlant) {
    return [
      "Use one clear plant photo per scan.",
      "Capture leaves in daylight or bright white light.",
    ];
  }

  return [
    "Avoid overhead watering on leaves.",
    "Clean tools before moving between plants.",
    "Track pH, moisture, and light after every diagnosis.",
  ];
}

export function getRescanAdvice(diagnosis: Diagnosis) {
  if (!diagnosis.isPlant) return "Retake now";
  if (diagnosis.confidence < 65) return "Retake with clearer image";
  if (diagnosis.title.toLowerCase().includes("healthy"))
    return "Scan again in 7 days";
  return "Scan again in 2-3 days";
}

export function createScanReport(item: ScanHistoryItem | null, scan: Diagnosis) {
  const diagnosis = item?.diagnosis ?? scan;
  const scannedAt = item
    ? new Date(item.scannedAt).toLocaleString()
    : "Current session";
  return [
    "PlantDoctor Health Report",
    `Date: ${scannedAt}`,
    `Status: ${diagnosis.title}`,
    `Confidence: ${diagnosis.confidence}%`,
    `Source: ${diagnosis.source ?? "Offline analysis"}`,
    `Symptoms: ${diagnosis.symptoms}`,
    `Recommended action: ${diagnosis.action}`,
    `Next scan: ${getRescanAdvice(diagnosis)}`,
  ].join("\n");
}

export function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const iconColor = active ? "#ffffff" : "#76827a";

  if (tab === "Home") {
    return (
      <View style={styles.tabIconBox}>
        <View style={[styles.homeRoof, { borderBottomColor: iconColor }]} />
        <View style={[styles.homeBase, { backgroundColor: iconColor }]} />
      </View>
    );
  }

  if (tab === "My Farm") {
    return (
      <View style={styles.tabIconBox}>
        <View style={[styles.farmLine, { backgroundColor: iconColor }]} />
        <View style={styles.farmRack}>
          <View style={[styles.farmTray, { backgroundColor: iconColor }]} />
          <View style={[styles.farmTray, { backgroundColor: iconColor }]} />
        </View>
      </View>
    );
  }

  if (tab === "My Plants") {
    return (
      <View style={styles.tabIconBox}>
        <View style={[styles.plantStemIcon, { backgroundColor: iconColor }]} />
        <View style={[styles.plantLeafIcon, { backgroundColor: iconColor }]} />
        <View
          style={[
            styles.plantLeafIcon,
            styles.plantLeafIconRight,
            { backgroundColor: iconColor },
          ]}
        />
      </View>
    );
  }

  if (tab === "Calendar") {
    return (
      <View style={[styles.calendarIcon, { borderColor: iconColor }]}>
        <View style={[styles.calendarTop, { backgroundColor: iconColor }]} />
        <View style={styles.calendarDots}>
          <View style={[styles.calendarDot, { backgroundColor: iconColor }]} />
          <View style={[styles.calendarDot, { backgroundColor: iconColor }]} />
          <View style={[styles.calendarDot, { backgroundColor: iconColor }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.doctorIcon, { borderColor: iconColor }]}>
      <View
        style={[styles.doctorCrossVertical, { backgroundColor: iconColor }]}
      />
      <View
        style={[styles.doctorCrossHorizontal, { backgroundColor: iconColor }]}
      />
    </View>
  );
}


export function GrowMindLogo() {
  return (
    <View style={styles.logoLockup}>
      <Image
        source={require("../assets/plantdoctor-icon.png")}
        style={styles.logoImage}
        resizeMode="cover"
      />
      <View>
        <View style={styles.logoWordRow}>
          <Text style={styles.logoWordGrow}>Plant</Text>
          <Text style={styles.logoWordMind}>Doctor</Text>
        </View>
        <Text style={styles.subtitle}>Precision Farm Assistant</Text>
      </View>
    </View>
  );
}


export function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.pageIntro}>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}


export function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}


export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.sensorLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}


export function FreshMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <View style={styles.freshMetric}>
      <Text style={styles.freshMetricLabel}>{label}</Text>
      <Text style={styles.freshMetricValue}>{value}</Text>
      <Text style={styles.freshMetricNote}>{note}</Text>
    </View>
  );
}


export function SensorCard({
  label,
  value,
  target,
  status,
}: {
  label: string;
  value: string;
  target: string;
  status: boolean;
}) {
  return (
    <View style={styles.sensorCard}>
      <View
        style={[styles.statusDot, status ? styles.statusOk : styles.statusWarn]}
      />
      <Text style={styles.sensorLabel}>{label}</Text>
      <Text style={styles.sensorValue}>{value}</Text>
      <Text style={styles.sensorTarget}>Target {target}</Text>
      <Text
        style={[styles.sensorStatus, status ? styles.okText : styles.warnText]}
      >
        {status ? "Optimal" : "Needs action"}
      </Text>
    </View>
  );
}


export function AlertRow({ text }: { text: string }) {
  return (
    <View style={styles.alertRow}>
      <View style={styles.alertIcon}>
        <Text style={styles.alertIconText}>!</Text>
      </View>
      <Text style={styles.alertText}>{text}</Text>
    </View>
  );
}


export function ControlAdjuster({
  label,
  value,
  disabled,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={[styles.controlCard, disabled && styles.controlCardDisabled]}>
      <View style={styles.controlHeader}>
        <Text style={styles.controlLabel}>{label}</Text>
        <Text
          style={[styles.controlState, disabled && styles.controlStateDisabled]}
        >
          {disabled ? "AUTO" : `${value}%`}
        </Text>
      </View>
      <ProgressBar value={value} color={disabled ? "#8aa096" : "#2d7d4a"} />
      <View style={styles.adjustRow}>
        <Pressable
          disabled={disabled}
          onPress={onMinus}
          style={({ pressed }) => [
            styles.adjustButton,
            disabled && styles.adjustButtonDisabled,
            pressed && !disabled && styles.buttonPressed,
          ]}
        >
          <Text style={styles.adjustText}>-</Text>
        </Pressable>
        <Pressable
          disabled={disabled}
          onPress={onPlus}
          style={({ pressed }) => [
            styles.adjustButton,
            disabled && styles.adjustButtonDisabled,
            pressed && !disabled && styles.buttonPressed,
          ]}
        >
          <Text style={styles.adjustText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}


export function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${clamp(value, 0, 100)}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}


export function LineChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return (
    <View style={styles.chart}>
      {values.map((value, index) => {
        const height = 18 + ((value - min) / Math.max(max - min, 1)) * 74;
        return (
          <View key={`${value}-${index}`} style={styles.chartColumn}>
            <View style={[styles.chartBar, { height }]} />
          </View>
        );
      })}
    </View>
  );
}



export const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#edf2ec",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  logoLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
  },
  logoWordRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  logoWordGrow: {
    fontSize: 29,
    fontWeight: "900",
    color: "#173e2b",
  },
  logoWordMind: {
    fontSize: 29,
    fontWeight: "900",
    color: "#4f7b34",
  },
  subtitle: {
    fontSize: 13,
    color: "#65716a",
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2d7d4a",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#234030",
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 18,
    paddingBottom: 110,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  pageIntro: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 16,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#17251d",
    marginBottom: 6,
  },
  hero: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "#dce5dc",
    gap: 12,
  },
  homeHero: {
    backgroundColor: "#dff1e7",
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "#b8d9c5",
    gap: 14,
  },
  homeHeroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  homeMood: {
    color: "#143523",
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 30,
  },
  scoreBubble: {
    flexShrink: 0,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#b8d9c5",
  },
  scoreBubbleValue: {
    color: "#214b35",
    fontSize: 27,
    fontWeight: "900",
  },
  scoreBubbleLabel: {
    color: "#5d7568",
    fontSize: 11,
    fontWeight: "900",
  },
  canopyScene: {
    height: 112,
    backgroundColor: "#f8fff9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  canopyStem: {
    width: 9,
    height: 68,
    borderRadius: 5,
    backgroundColor: "#3c7c4f",
  },
  canopyLeaf: {
    position: "absolute",
    width: 76,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#6ab879",
    top: 34,
  },
  canopyLeafLeft: {
    left: "35%",
    transform: [{ rotate: "-24deg" }],
  },
  canopyLeafRight: {
    right: "35%",
    top: 22,
    transform: [{ rotate: "24deg" }],
  },
  canopyTray: {
    width: "62%",
    height: 18,
    borderRadius: 6,
    backgroundColor: "#2f3b34",
  },
  homeHeroText: {
    color: "#315541",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  homeRefreshButton: {
    backgroundColor: "#214b35",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  homeMetricRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  freshMetric: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 13,
    minHeight: 98,
  },
  freshMetricLabel: {
    color: "#5f6e66",
    fontSize: 12,
    fontWeight: "900",
  },
  freshMetricValue: {
    color: "#17251d",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 8,
  },
  freshMetricNote: {
    color: "#6c7b72",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  briefCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 16,
    gap: 8,
  },
  impactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  impactCard: {
    width: "48.4%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 12,
    gap: 4,
  },
  impactCardWide: {
    width: "100%",
  },
  impactValue: {
    color: "#17251d",
    fontSize: 20,
    fontWeight: "900",
  },
  impactNote: {
    color: "#6a766f",
    fontSize: 11,
    fontWeight: "800",
  },
  readinessList: {
    gap: 8,
  },
  readinessCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 12,
    gap: 6,
  },
  readinessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  readinessBadge: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  readinessBadgeReady: {
    backgroundColor: "#2d7d4a",
  },
  readinessBadgeAlmost: {
    backgroundColor: "#e0a33a",
  },
  readinessBadgeDelayed: {
    backgroundColor: "#c14f3d",
  },
  readinessBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
  },
  alertCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  alertHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  alertSeverity: {
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  alertSeverityHigh: {
    backgroundColor: "#c14f3d",
  },
  alertSeverityMedium: {
    backgroundColor: "#e0a33a",
  },
  alertSeverityLow: {
    backgroundColor: "#5f8e6d",
  },
  alertSeverityText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
  },
  alertActionButton: {
    borderRadius: 8,
    backgroundColor: "#e3f1e8",
    borderWidth: 1,
    borderColor: "#c9dfcf",
    alignItems: "center",
    paddingVertical: 9,
  },
  alertActionText: {
    color: "#235b37",
    fontSize: 12,
    fontWeight: "900",
  },
  heroLabel: {
    color: "#66736b",
    fontSize: 13,
    fontWeight: "800",
  },
  heroScore: {
    fontSize: 52,
    fontWeight: "900",
    color: "#17251d",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    width: "48.4%",
    minHeight: 95,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dce5dc",
  },
  statValue: {
    marginTop: 7,
    color: "#17251d",
    fontSize: 24,
    fontWeight: "900",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dce5dc",
    marginBottom: 12,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    color: "#17251d",
    fontSize: 18,
    fontWeight: "900",
  },
  bodyText: {
    color: "#58645d",
    lineHeight: 20,
    fontSize: 14,
  },
  autoBadge: {
    backgroundColor: "#eef2ef",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  autoBadgeActive: {
    backgroundColor: "#214b35",
  },
  autoText: {
    color: "#5b675f",
    fontWeight: "900",
    fontSize: 12,
  },
  autoTextActive: {
    color: "#ffffff",
  },
  autoHint: {
    backgroundColor: "#eef7f1",
    color: "#2d6340",
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },
  plantRail: {
    gap: 10,
    paddingBottom: 12,
  },
  plantPill: {
    minWidth: 120,
    height: 70,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 12,
  },
  plantPillActive: {
    backgroundColor: "#214b35",
    borderColor: "#214b35",
  },
  plantPillText: {
    color: "#17251d",
    fontWeight: "900",
  },
  plantPillMeta: {
    color: "#66736b",
    marginTop: 4,
    fontSize: 12,
  },
  plantPillTextActive: {
    color: "#ffffff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  sensorCard: {
    width: "48.4%",
    minHeight: 126,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dce5dc",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  statusOk: {
    backgroundColor: "#2d7d4a",
  },
  statusWarn: {
    backgroundColor: "#d6604d",
  },
  sensorLabel: {
    fontSize: 12,
    color: "#6b766f",
    fontWeight: "800",
  },
  sensorValue: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "900",
    color: "#17251d",
  },
  sensorTarget: {
    marginTop: 4,
    color: "#6d7971",
    fontSize: 11,
    fontWeight: "700",
  },
  sensorStatus: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "900",
  },
  okText: {
    color: "#2d7d4a",
  },
  warnText: {
    color: "#c14f3d",
  },
  metricText: {
    color: "#66736b",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#17251d",
  },
  sectionAction: {
    fontSize: 12,
    color: "#69756e",
    fontWeight: "800",
    maxWidth: 170,
    textAlign: "right",
  },
  alertRow: {
    backgroundColor: "#fff9ed",
    borderColor: "#f2dcaa",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  alertIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#f0b429",
    alignItems: "center",
    justifyContent: "center",
  },
  alertIconText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  alertText: {
    flex: 1,
    color: "#594a1f",
    fontWeight: "800",
    lineHeight: 19,
  },
  controlCard: {
    backgroundColor: "#f7faf7",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dce5dc",
    gap: 10,
  },
  controlCardDisabled: {
    backgroundColor: "#eef2ef",
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlLabel: {
    color: "#17251d",
    fontWeight: "900",
    fontSize: 15,
  },
  controlState: {
    color: "#2d7d4a",
    fontWeight: "900",
  },
  controlStateDisabled: {
    color: "#718078",
  },
  adjustRow: {
    flexDirection: "row",
    gap: 8,
  },
  adjustButton: {
    flex: 1,
    backgroundColor: "#214b35",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 9,
  },
  adjustButtonDisabled: {
    backgroundColor: "#a8b5ad",
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  adjustText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#dfe8df",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  chart: {
    height: 122,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: "82%",
    borderRadius: 5,
    backgroundColor: "#65a871",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 16,
    gap: 10,
  },
  monthCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 14,
    marginBottom: 12,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthTitle: {
    color: "#17251d",
    fontSize: 20,
    fontWeight: "900",
  },
  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#e3f1e8",
    alignItems: "center",
    justifyContent: "center",
  },
  monthButtonText: {
    color: "#235b37",
    fontSize: 24,
    fontWeight: "900",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekText: {
    flex: 1,
    textAlign: "center",
    color: "#69756e",
    fontSize: 12,
    fontWeight: "900",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285%",
    aspectRatio: 1,
    borderRadius: 0,
    backgroundColor: "#f7faf7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e8e1",
  },
  dayCellSelected: {
    backgroundColor: "#214b35",
    borderColor: "#214b35",
  },
  dayText: {
    color: "#39483f",
    fontWeight: "900",
    fontSize: 12,
  },
  dayTextSelected: {
    color: "#ffffff",
  },
  dayCellToday: {
    borderColor: "#86b696",
    borderWidth: 2,
  },
  dayEventRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  dayEventBadge: {
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  dayEventBadgePlanted: {
    backgroundColor: "#79b18a",
  },
  dayEventBadgeHarvest: {
    backgroundColor: "#f0b429",
  },
  dayEventBadgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "900",
  },
  calendarLegendRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  calendarLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  dateDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f7faf7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 10,
  },
  dateDetailType: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  reminderRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  reminderButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d6e5da",
    backgroundColor: "#f4faf6",
    alignItems: "center",
    paddingVertical: 8,
  },
  weeklyPlanList: {
    gap: 8,
  },
  weeklyPlanItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 12,
    gap: 4,
  },
  calendarQuickRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c9dfcf",
    backgroundColor: "#eef7f1",
    alignItems: "center",
    paddingVertical: 10,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#f0b429",
    marginTop: 3,
  },
  cropChoiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropChoice: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    backgroundColor: "#f7faf7",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  cropChoiceActive: {
    backgroundColor: "#214b35",
    borderColor: "#214b35",
  },
  cropChoiceText: {
    color: "#4c5c53",
    fontSize: 12,
    fontWeight: "900",
  },
  cropChoiceTextActive: {
    color: "#ffffff",
  },
  suggestionBox: {
    backgroundColor: "#eef7f1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c9dfcf",
    padding: 12,
  },
  input: {
    minHeight: 46,
    backgroundColor: "#f7faf7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    paddingHorizontal: 12,
    color: "#17251d",
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#214b35",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  smallButton: {
    backgroundColor: "#e3f1e8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
    flexShrink: 0,
    maxWidth: "100%",
  },
  smallButtonText: {
    color: "#235b37",
    fontWeight: "900",
    fontSize: 12,
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f1e8",
    alignItems: "center",
    justifyContent: "center",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#214b35",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  profileGlyph: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileGlyphHead: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#ffffff",
    marginBottom: 2,
  },
  profileGlyphBody: {
    width: 14,
    height: 8,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: "#ffffff",
  },
  profileInitials: {
    color: "#214b35",
    fontWeight: "900",
    fontSize: 16,
  },
  profileIcon: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 20,
  },
  signOutIcon: {
    width: 20,
    height: 20,
  },
  signOutSymbol: {
    color: "#235b37",
    fontSize: 18,
    fontWeight: "900",
  },
  loginLogo: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 6,
  },
  deleteButton: {
    backgroundColor: "#fde8e3",
  },
  deleteButtonText: {
    color: "#c14f3d",
    fontWeight: "900",
    fontSize: 12,
  },
  calendarCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 14,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  calendarActions: {
    gap: 8,
    justifyContent: "center",
  },
  scanner: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 16,
  },
  cameraFrame: {
    height: 330,
    backgroundColor: "#1a2520",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  scanLeaf: {
    width: 148,
    height: 210,
    borderRadius: 74,
    backgroundColor: "#3f9b63",
    transform: [{ rotate: "-18deg" }],
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  scanLine: {
    position: "absolute",
    width: "86%",
    height: 3,
    backgroundColor: "#d9ffec",
    top: 150,
  },
  cameraText: {
    position: "absolute",
    bottom: 18,
    color: "#d8eee0",
    fontWeight: "900",
  },
  scanActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  demoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  demoButton: {
    flexGrow: 1,
    minWidth: "31%",
    backgroundColor: "#eef7f1",
    borderColor: "#c9dfcf",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#245038",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  scanButton: {
    backgroundColor: "#214b35",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    flex: 1,
  },
  cameraButton: {
    backgroundColor: "#5f6f3b",
  },
  uploadButton: {
    backgroundColor: "#386f96",
  },
  scanButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
  },
  diagnosisCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    overflow: "hidden",
  },
  diagnosisStrip: {
    height: 8,
  },
  diagnosisBody: {
    padding: 16,
    gap: 10,
  },
  diagnosisHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  diagnosisTitle: {
    flex: 1,
    color: "#17251d",
    fontSize: 20,
    fontWeight: "900",
  },
  confidenceBadge: {
    minWidth: 62,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  confidenceText: {
    fontSize: 17,
    fontWeight: "900",
  },
  recommendationText: {
    color: "#245038",
    lineHeight: 21,
    fontSize: 14,
    fontWeight: "800",
  },
  careGrid: {
    gap: 10,
  },
  careCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 14,
    gap: 8,
  },
  careText: {
    color: "#4f5f55",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  explainCard: {
    backgroundColor: "#f8fcf9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dcebdc",
    padding: 14,
    gap: 8,
  },
  checklistCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 14,
    gap: 6,
  },
  historyList: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce5dc",
    padding: 12,
    gap: 10,
  },
  historyItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2ef",
    paddingBottom: 10,
  },
  historyImage: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: "#dce5dc",
  },
  historyDemoImage: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: "#e8f2eb",
    alignItems: "center",
    justifyContent: "center",
  },
  historyDemoLeaf: {
    width: 28,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#65a871",
    transform: [{ rotate: "-18deg" }],
  },
  historyTextWrap: {
    flex: 1,
  },
  historyTitle: {
    color: "#17251d",
    fontSize: 14,
    fontWeight: "900",
  },
  reportCard: {
    backgroundColor: "#17251d",
    borderRadius: 8,
    padding: 14,
  },
  reportText: {
    color: "#ecf5ed",
    fontFamily: Platform.select({ ios: "Courier", default: "monospace" }),
    fontSize: 12,
    lineHeight: 18,
  },
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    maxWidth: 760,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d3ddd3",
    padding: 7,
    flexDirection: "row",
    gap: 5,
    zIndex: 20,
  },
  tabItem: {
    flex: 1,
    minHeight: 56,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: "#214b35",
  },
  tabIconBox: {
    width: 24,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  homeBase: {
    width: 15,
    height: 10,
    borderRadius: 2,
  },
  farmLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginBottom: 3,
  },
  farmRack: {
    width: 22,
    gap: 3,
  },
  farmTray: {
    height: 4,
    borderRadius: 2,
  },
  plantStemIcon: {
    width: 3,
    height: 18,
    borderRadius: 2,
    position: "absolute",
    bottom: 1,
  },
  plantLeafIcon: {
    width: 13,
    height: 9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 2,
    position: "absolute",
    left: 3,
    top: 5,
    transform: [{ rotate: "-28deg" }],
  },
  plantLeafIconRight: {
    left: 10,
    top: 3,
    transform: [{ rotate: "28deg" }],
  },
  calendarIcon: {
    width: 22,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    overflow: "hidden",
  },
  calendarTop: {
    height: 5,
  },
  calendarDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 3,
    paddingTop: 4,
  },
  calendarDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  doctorIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorCrossVertical: {
    position: "absolute",
    width: 4,
    height: 13,
    borderRadius: 2,
  },
  doctorCrossHorizontal: {
    position: "absolute",
    width: 13,
    height: 4,
    borderRadius: 2,
  },
  tabText: {
    color: "#7a867e",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#ffffff",
  },
});
