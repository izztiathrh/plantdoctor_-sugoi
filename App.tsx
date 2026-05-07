import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jpeg from "jpeg-js";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type TabKey = "My Farm" | "My Plants" | "Home" | "Calendar" | "Doctor";

type CropKey = "lettuce" | "basil" | "strawberry" | "spinach";

type Plant = {
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

type FarmSection = {
  id: string;
  name: string;
  plantId: string;
  led: number;
  fan: number;
  pump: number;
  nutrient: number;
  auto: boolean;
};

type CalendarItem = {
  id: string;
  plantId: string;
  plantName: string;
  cropKey: CropKey;
  plantedDate: string;
  harvestDate: string;
};

type DiagnosisMetrics = {
  plantScore: number;
  greenRatio: number;
  yellowRatio: number;
  brownRatio: number;
};

type Diagnosis = {
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

type ScanHistoryItem = {
  id: string;
  imageUri: string | null;
  diagnosis: Diagnosis;
  scannedAt: string;
};

type SavedPlantDoctorState = {
  selectedPlantId: string;
  plantRecords: Plant[];
  sections: FarmSection[];
  calendarItems: CalendarItem[];
  scanHistory: ScanHistoryItem[];
};

type UserRecord = {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  email?: string;
};

function LoginScreen({
  onLogin,
  onSignUp,
  onResetPassword,
}: {
  onLogin: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  onSignUp: (username: string, password: string, fullName: string, phone?: string, email?: string) => Promise<{ ok: boolean; message?: string }>;
  onResetPassword: (username: string, newPassword: string) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgot">("signIn");
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  async function submitSignIn() {
    setError(null);
    setLoading(true);
    try {
      const result = await onLogin(username.trim(), password);
      if (!result.ok) setError(result.message ?? "Sign in failed");
    } catch {
      setError("Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitSignUp() {
    setError(null);
    setLoading(true);
    try {
      const result = await onSignUp(
        username.trim(),
        password,
        fullName.trim(),
        phone.trim() || undefined,
        email.trim() || undefined,
      );
      if (!result.ok) setError(result.message ?? "Sign up failed");
    } catch {
      setError("Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset() {
    setError(null);
    setResetMessage(null);
    setLoading(true);
    try {
      const newPass = "newpass123";
      const result = await onResetPassword(username.trim(), newPass);
      if (!result.ok) setError(result.message ?? "Reset failed");
      else setResetMessage(`Password reset. New password: ${newPass}`);
    } catch {
      setError("Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ width: "100%", maxWidth: 520, alignSelf: "center" }}>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Image
          source={require("./assets/plantdoctor-icon.png")}
          style={styles.loginLogo}
          resizeMode="cover"
        />
      </View>

      <View style={styles.pageIntro}>
        <Text style={styles.pageTitle}>{mode === "signIn" ? "Sign in to Plant Doctor" : mode === "signUp" ? "Create your account" : "Reset password"}</Text>
        <Text style={styles.bodyText}>{mode === "signIn" ? "Enter your credentials to continue." : mode === "signUp" ? "Provide basic information to create an account." : "Enter your username to reset password."}</Text>
      </View>

      <View style={styles.formCard}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          <Pressable onPress={() => setMode("signIn")} style={[{ padding: 8, borderRadius: 8 }, mode === "signIn" && { backgroundColor: "#eef7f1" }]}>
            <Text style={{ fontWeight: "900", color: mode === "signIn" ? "#214b35" : "#58645d" }}>Sign in</Text>
          </Pressable>
          <Pressable onPress={() => setMode("signUp")} style={[{ padding: 8, borderRadius: 8 }, mode === "signUp" && { backgroundColor: "#eef7f1" }]}>
            <Text style={{ fontWeight: "900", color: mode === "signUp" ? "#214b35" : "#58645d" }}>Sign up</Text>
          </Pressable>
          <Pressable onPress={() => setMode("forgot")} style={[{ padding: 8, borderRadius: 8 }, mode === "forgot" && { backgroundColor: "#eef7f1" }]}>
            <Text style={{ fontWeight: "900", color: mode === "forgot" ? "#214b35" : "#58645d" }}>Forgot</Text>
          </Pressable>
        </View>

        {(mode === "signIn" || mode === "signUp" || mode === "forgot") && (
          <>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>Username</Text>
            <TextInput value={username} onChangeText={setUsername} placeholder="username" style={styles.input} autoCapitalize="none" />
          </>
        )}

        {mode !== "forgot" && (
          <>
            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry style={styles.input} />
          </>
        )}

        {mode === "signUp" && (
          <>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>Full name</Text>
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Your full name" style={styles.input} />

            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>Email (optional)</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" style={styles.input} keyboardType="email-address" />

            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>Phone number (optional)</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="09xx xxx xxxx" style={styles.input} keyboardType="phone-pad" />
          </>
        )}

        {error && <Text style={{ color: "#c14f3d", marginTop: 8, fontWeight: "800" }}>{error}</Text>}
        {resetMessage && <Text style={{ color: "#2d7d4a", marginTop: 8, fontWeight: "800" }}>{resetMessage}</Text>}

        {mode === "signIn" && (
          <>
            <Pressable onPress={submitSignIn} style={[styles.primaryButton, { marginTop: 14, opacity: loading ? 0.7 : 1 }]} disabled={loading}>
              <Text style={styles.primaryButtonText}>{loading ? "Signing in..." : "Sign in"}</Text>
            </Pressable>
            <Text style={{ marginTop: 10, color: "#58645d", fontSize: 13 }}>Demo credentials: username "demo" and password "demo123".</Text>
          </>
        )}

        {mode === "signUp" && (
          <Pressable onPress={submitSignUp} style={[styles.primaryButton, { marginTop: 14, opacity: loading ? 0.7 : 1 }]} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "Creating..." : "Create account"}</Text>
          </Pressable>
        )}

        {mode === "forgot" && (
          <Pressable onPress={submitReset} style={[styles.primaryButton, { marginTop: 14, opacity: loading ? 0.7 : 1 }]} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "Resetting..." : "Reset password"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function ProfileScreen({
  username,
  onClose,
  onSignOut,
}: {
  username: string | null;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!username) return;
      try {
        const raw = await AsyncStorage.getItem("plantdoctor:users");
        const users = raw ? (JSON.parse(raw) as Record<string, UserRecord>) : {};
        const record = users[username];
        if (record) setUserRecord(record);
        else setUserRecord({ username, password: "", fullName: username, email: undefined, phone: undefined });
      } catch {
        setUserRecord({ username, password: "", fullName: username, email: undefined, phone: undefined });
      }
    }

    load();
  }, [username]);

  async function submitPasswordChange() {
    setPasswordError(null);
    setPasswordMessage(null);

    if (!username) {
      setPasswordError("No user is signed in");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("Enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem("plantdoctor:users");
      const users = raw ? (JSON.parse(raw) as Record<string, UserRecord>) : {};
      const record = users[username];
      if (!record) {
        setPasswordError("User not found");
        return;
      }

      users[username] = { ...record, password: newPassword };
      await AsyncStorage.setItem("plantdoctor:users", JSON.stringify(users));
      setPasswordMessage("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordOpen(false);
    } catch {
      setPasswordError("Could not update password");
    }
  }

  return (
    <View>
      <View style={styles.pageIntro}>
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.bodyText}>Account details for {userRecord?.username ?? "user"}.</Text>
      </View>

      <View style={styles.formCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={[styles.loginLogo, { width: 64, height: 64, borderRadius: 12, alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ fontSize: 28, fontWeight: "900", color: "#214b35" }}>{userRecord?.fullName ? userRecord.fullName[0].toUpperCase() : username ? username[0].toUpperCase() : "U"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{userRecord?.fullName ?? "User"}</Text>
            <Text style={styles.bodyText}>Username: {userRecord?.username ?? username ?? "-"}</Text>
          </View>
        </View>

        <View style={{ marginTop: 16, gap: 8 }}>
          <Text style={styles.bodyText}>Full name: {userRecord?.fullName ?? "Not provided"}</Text>
          <Text style={styles.bodyText}>Username: {userRecord?.username ?? "Not provided"}</Text>
          <Text style={styles.bodyText}>Phone number: {userRecord?.phone ?? "Not provided"}</Text>
          <Text style={styles.bodyText}>Email: {userRecord?.email ?? "No email provided"}</Text>
        </View>

        <Pressable onPress={() => setChangePasswordOpen((current) => !current)} style={[styles.smallButton, { marginTop: 16 }]}>
          <Text style={styles.smallButtonText}>{changePasswordOpen ? "Cancel password change" : "Change password"}</Text>
        </Pressable>

        {changePasswordOpen && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "900", marginBottom: 6 }}>New password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              style={styles.input}
            />

            <Text style={{ fontWeight: "900", marginTop: 12, marginBottom: 6 }}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              style={styles.input}
            />

            {passwordError && <Text style={{ color: "#c14f3d", marginTop: 8, fontWeight: "800" }}>{passwordError}</Text>}
            {passwordMessage && <Text style={{ color: "#2d7d4a", marginTop: 8, fontWeight: "800" }}>{passwordMessage}</Text>}

            <Pressable onPress={submitPasswordChange} style={[styles.primaryButton, { marginTop: 14 }]}>
              <Text style={styles.primaryButtonText}>Save password</Text>
            </Pressable>
          </View>
        )}

        <Pressable onPress={onSignOut} style={[styles.primaryButton, { marginTop: 16 }]}>
          <Text style={styles.primaryButtonText}>Sign out</Text>
        </Pressable>

        <Pressable onPress={onClose} style={[styles.smallButton, { marginTop: 8 }]}>
          <Text style={styles.smallButtonText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const tabs: TabKey[] = ["My Farm", "My Plants", "Home", "Calendar", "Doctor"];

const cropTargets: Record<
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

const initialPlants: Plant[] = [
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

const initialSections: FarmSection[] = [
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

const initialCalendar: CalendarItem[] = [
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

const cropHarvestDays: Record<CropKey, number> = {
  lettuce: 31,
  basil: 28,
  strawberry: 48,
  spinach: 30,
};

const cropLabels: Record<CropKey, string> = {
  lettuce: "Lettuce",
  basil: "Basil",
  strawberry: "Strawberry",
  spinach: "Spinach",
};

const cropVarieties: Record<CropKey, string> = {
  lettuce: "Butterhead lettuce",
  basil: "Genovese basil",
  strawberry: "Albion strawberry",
  spinach: "Space F1 spinach",
};

const waitingDiagnosis: Diagnosis = {
  title: "Take or upload a plant image",
  confidence: 0,
  color: "#9aa1a8",
  symptoms:
    "Plant Doctor needs a leaf photo before it can verify and diagnose the plant.",
  action: "Use the camera or upload a close-up image of a plant leaf.",
  isPlant: false,
  source: "Free offline AI",
};

const storageKey = "plantdoctor:v2";

const demoScans: Array<{
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

const huggingFaceImageModel =
  getPublicEnv("EXPO_PUBLIC_HUGGINGFACE_MODEL") ??
  "mesabo/agri-plant-disease-resnet50";
const huggingFaceApiUrl = `https://router.huggingface.co/hf-inference/models/${huggingFaceImageModel}`;
const geminiVisionModel =
  getPublicEnv("EXPO_PUBLIC_GEMINI_MODEL") ?? "gemini-2.5-flash";

function getPublicEnv(key: string) {
  return (globalThis as any).process?.env?.[key] as string | undefined;
}

function shortenAiError(message: string) {
  return message.length > 120 ? `${message.slice(0, 117)}...` : message;
}

function aiText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(aiText).filter(Boolean).join(" ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function within(value: number, range: [number, number]) {
  return value >= range[0] && value <= range[1];
}

function daysBetween(startDate: string, endDate = "2026-05-05") {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function getAutoRecipe(plant: Plant) {
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

function createPlantFromSchedule({
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

function getMonthDays(monthDate: Date) {
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

function formatMonth(date: Date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function classifyPlantImageFromMetrics(
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

const base64Chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function base64ToBytes(base64: string) {
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

function analyzeRgbaPixels(
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

async function analyzeImageOnDevice(uri: string): Promise<Diagnosis> {
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

async function loadImageForAnalysis(uri: string) {
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

async function analyzeImageOnWeb(uri: string): Promise<Diagnosis> {
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

function withFreeAiSource(diagnosis: Diagnosis): Diagnosis {
  return {
    ...diagnosis,
    source: diagnosis.source ?? "Free offline AI",
  };
}

function shouldAskOnlineAi(diagnosis: Diagnosis) {
  const metrics = diagnosis.metrics;

  if (diagnosis.isPlant) return true;
  if (!metrics) return false;

  return (
    metrics.plantScore >= 45 ||
    metrics.greenRatio >= 12 ||
    metrics.yellowRatio + metrics.brownRatio >= 28
  );
}

function formatAiLabel(label: string) {
  return label
    .replace(/___/g, " - ")
    .replace(/__/g, " - ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function diagnosisFromAiLabel(
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

async function imageUriToBase64ForAi(uri: string) {
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

function extractJsonObject(text: string) {
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

async function analyzeImageWithGemini(
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

async function analyzeImageWithFreeAi(uri: string): Promise<Diagnosis> {
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

function shouldUseCameraPicker() {
  return Platform.OS !== "web";
}

function getScanStatus(diagnosis: Diagnosis) {
  if (!diagnosis.isPlant) return "Not verified";
  if (diagnosis.confidence >= 85) return "High confidence";
  if (diagnosis.confidence >= 65) return "Medium confidence";
  return "Needs clearer photo";
}

function getTreatmentSteps(diagnosis: Diagnosis) {
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

function getPreventionTips(diagnosis: Diagnosis) {
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

function getRescanAdvice(diagnosis: Diagnosis) {
  if (!diagnosis.isPlant) return "Retake now";
  if (diagnosis.confidence < 65) return "Retake with clearer image";
  if (diagnosis.title.toLowerCase().includes("healthy")) return "Scan again in 7 days";
  return "Scan again in 2-3 days";
}

function createScanReport(item: ScanHistoryItem | null, scan: Diagnosis) {
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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("Home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState("p1");
  const [plantRecords, setPlantRecords] = useState(initialPlants);
  const [sections, setSections] = useState(initialSections);
  const [calendarItems, setCalendarItems] = useState(initialCalendar);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [plantInput, setPlantInput] = useState("New Plant");
  const [cropInput, setCropInput] = useState<CropKey>("strawberry");
  const [dateInput, setDateInput] = useState("2026-05-05");
  const [harvestInput, setHarvestInput] = useState(
    addDays("2026-05-05", cropHarvestDays.strawberry),
  );
  const [calendarMonth, setCalendarMonth] = useState(
    new Date("2026-05-01T00:00:00"),
  );
  const [leafImageUri, setLeafImageUri] = useState<string | null>(null);
  const [scan, setScan] = useState<Diagnosis>(waitingDiagnosis);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasLoadedSavedState, setHasLoadedSavedState] = useState(false);
  const [tick, setTick] = useState(2);

  useEffect(() => {
    async function loadSavedState() {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (!saved) return;
        const parsed = JSON.parse(saved) as Partial<SavedPlantDoctorState>;
        if (parsed.plantRecords?.length) {
          setPlantRecords(parsed.plantRecords);
        }
        if (parsed.sections?.length) {
          setSections(parsed.sections);
        }
        if (parsed.calendarItems?.length) {
          setCalendarItems(parsed.calendarItems);
        }
        if (parsed.selectedPlantId) {
          setSelectedPlantId(parsed.selectedPlantId);
        }
        if (parsed.scanHistory?.length) {
          setScanHistory(parsed.scanHistory.slice(0, 8));
          setScan(parsed.scanHistory[0].diagnosis);
          setLeafImageUri(parsed.scanHistory[0].imageUri);
        }
      } catch {
        // The app can continue with starter data if saved JSON is unavailable.
      } finally {
        setHasLoadedSavedState(true);
      }
    }

    loadSavedState();
  }, []);

  useEffect(() => {
    async function loadAuth() {
      try {
        const token = await AsyncStorage.getItem("plantdoctor:auth");
        if (token) {
          setAuthUser(token);
          setIsAuthenticated(true);
        }
      } catch {
        // ignore
      }
    }

    loadAuth();
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedState) return;
    const savedState: SavedPlantDoctorState = {
      selectedPlantId,
      plantRecords,
      sections,
      calendarItems,
      scanHistory,
    };
    AsyncStorage.setItem(storageKey, JSON.stringify(savedState)).catch(() => {
      // Persistence failure should not block the hackathon demo flow.
    });
  }, [
    calendarItems,
    hasLoadedSavedState,
    plantRecords,
    scanHistory,
    sections,
    selectedPlantId,
  ]);

  async function loadUsers(): Promise<Record<string, UserRecord>> {
    try {
      const raw = await AsyncStorage.getItem("plantdoctor:users");
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, UserRecord>;
    } catch {
      return {};
    }
  }

  async function saveUsers(users: Record<string, UserRecord>) {
    try {
      await AsyncStorage.setItem("plantdoctor:users", JSON.stringify(users));
    } catch {
      // ignore
    }
  }

  async function handleLogin(username: string, password: string) {
    const users = await loadUsers();

    // Allow built-in demo credentials when no users saved
    if (username === "demo" && password === "demo123") {
      try {
        await AsyncStorage.setItem("plantdoctor:auth", username);
      } catch {}
      setAuthUser(username);
      setIsAuthenticated(true);
      return { ok: true };
    }

    const user = users[username];
    if (user && user.password === password) {
      try {
        await AsyncStorage.setItem("plantdoctor:auth", username);
      } catch {}
      setAuthUser(username);
      setIsAuthenticated(true);
      return { ok: true };
    }

    return { ok: false, message: "Invalid username or password" };
  }

  async function handleSignUp(username: string, password: string, fullName: string, phone?: string, email?: string) {
    if (!username || !password || !fullName) return { ok: false, message: "Full name, username and password required" };
    const users = await loadUsers();
    if (users[username]) return { ok: false, message: "Username already exists" };
    users[username] = { username, password, fullName, phone, email };
    await saveUsers(users);
    try {
      await AsyncStorage.setItem("plantdoctor:auth", username);
    } catch {}
    setAuthUser(username);
    setIsAuthenticated(true);
    return { ok: true };
  }

  async function handleResetPassword(username: string, newPassword: string) {
    const users = await loadUsers();
    const user = users[username];
    if (!user) return { ok: false, message: "User not found" };
    user.password = newPassword;
    users[username] = user;
    await saveUsers(users);
    return { ok: true };
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("plantdoctor:auth");
    } catch {
      // ignore
    }
    setAuthUser(null);
    setIsAuthenticated(false);
    setIsProfileOpen(false);
  }

  const plants = useMemo(() => {
    const wave = Math.sin(tick / 2);
    return plantRecords.map((plant, index) => ({
      ...plant,
      temp: Number((plant.temp + wave * (index + 0.6)).toFixed(1)),
      humidity: Math.round(plant.humidity + Math.cos(tick / 3 + index) * 4),
      moisture: Math.round(plant.moisture + wave * 3),
      ph: Number((plant.ph + Math.cos(tick / 4 + index) * 0.12).toFixed(1)),
      growthScore: clamp(Math.round(plant.growthScore + wave * 4), 40, 99),
    }));
  }, [plantRecords, tick]);

  const selectedPlant =
    plants.find((plant) => plant.id === selectedPlantId) ?? plants[0];
  const totalWater = plants
    .reduce((sum, plant) => sum + plant.waterToday, 0)
    .toFixed(1);
  const totalEnergy = plants
    .reduce((sum, plant) => sum + plant.energyToday, 0)
    .toFixed(1);
  const avgGrowth = Math.round(
    plants.reduce((sum, plant) => sum + plant.growthScore, 0) / plants.length,
  );
  const urgentAlerts = plants.filter((plant) => {
    const target = cropTargets[plant.cropKey];
    return (
      !within(plant.temp, target.temp) ||
      !within(plant.ph, target.ph) ||
      plant.moisture < target.moisture[0]
    );
  });

  function updateSection(
    sectionId: string,
    field: keyof FarmSection,
    deltaOrValue: number | boolean,
  ) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section;
        const plant =
          plants.find((item) => item.id === section.plantId) ?? plants[0];
        if (typeof deltaOrValue === "boolean") {
          return deltaOrValue
            ? { ...section, ...getAutoRecipe(plant), auto: true }
            : { ...section, auto: false };
        }
        if (section.auto) return section;
        const currentValue = section[field];
        if (typeof currentValue !== "number") return section;
        return {
          ...section,
          [field]: clamp(currentValue + deltaOrValue, 0, 100),
        };
      }),
    );
  }

  function saveCalendarItem() {
    if (!plantInput.trim() || !dateInput.trim() || !harvestInput.trim()) return;

    if (editingId) {
      const existingItem = calendarItems.find((item) => item.id === editingId);
      setCalendarItems((items) =>
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                plantName: plantInput.trim(),
                cropKey: cropInput,
                plantedDate: dateInput.trim(),
                harvestDate: harvestInput.trim(),
              }
            : item,
        ),
      );
      if (existingItem) {
        setPlantRecords((records) =>
          records.map((plant) =>
            plant.id === existingItem.plantId
              ? {
                  ...plant,
                  name: plantInput.trim(),
                  cropKey: cropInput,
                  variety: cropVarieties[cropInput],
                  plantedDate: dateInput.trim(),
                  harvestDay: cropHarvestDays[cropInput],
                }
              : plant,
          ),
        );
      }
      setEditingId(null);
    } else {
      const timestamp = Date.now();
      const plantId = `p${timestamp}`;
      const sectionId = `s${timestamp}`;
      const sectionName = `Section ${sections.length + 1}`;
      const newPlant = createPlantFromSchedule({
        id: plantId,
        cropKey: cropInput,
        name: plantInput.trim(),
        section: sectionName,
        plantedDate: dateInput.trim(),
      });
      const autoRecipe = getAutoRecipe(newPlant);

      setPlantRecords((records) => [...records, newPlant]);
      setSections((records) => [
        ...records,
        {
          id: sectionId,
          name: sectionName,
          plantId,
          auto: true,
          ...autoRecipe,
        },
      ]);
      setCalendarItems((items) => [
        ...items,
        {
          id: `c${timestamp}`,
          plantId,
          plantName: plantInput.trim(),
          cropKey: cropInput,
          plantedDate: dateInput.trim(),
          harvestDate: harvestInput.trim(),
        },
      ]);
      setSelectedPlantId(plantId);
    }

    setPlantInput("New Plant");
    setCropInput("strawberry");
    setDateInput("2026-05-05");
    setHarvestInput(addDays("2026-05-05", cropHarvestDays.strawberry));
  }

  function editCalendarItem(item: CalendarItem) {
    setEditingId(item.id);
    setPlantInput(item.plantName);
    setCropInput(item.cropKey);
    setDateInput(item.plantedDate);
    setHarvestInput(item.harvestDate);
  }

  function updateCalendarCrop(cropKey: CropKey) {
    setCropInput(cropKey);
    setHarvestInput(addDays(dateInput, cropHarvestDays[cropKey]));
  }

  function updatePlantedDate(date: string) {
    setDateInput(date);
    setHarvestInput(addDays(date, cropHarvestDays[cropInput]));
  }

  function deleteCalendarItem(id: string) {
    const item = calendarItems.find((calendarItem) => calendarItem.id === id);
    setCalendarItems((items) =>
      items.filter((calendarItem) => calendarItem.id !== id),
    );

    if (!item) return;
    setPlantRecords((records) =>
      records.filter((plant) => plant.id !== item.plantId),
    );
    setSections((records) =>
      records.filter((section) => section.plantId !== item.plantId),
    );
    if (selectedPlantId === item.plantId) {
      const fallbackPlant = plantRecords.find(
        (plant) => plant.id !== item.plantId,
      );
      setSelectedPlantId(fallbackPlant?.id ?? "p1");
    }
  }

  function handleTabPress(tab: TabKey) {
    setIsProfileOpen(false);
    setActiveTab(tab);
  }

  async function runPlantScan(uri = leafImageUri) {
    if (!uri) {
      setScan(waitingDiagnosis);
      return;
    }

    setIsScanning(true);
    try {
      const diagnosis = await analyzeImageWithFreeAi(uri);
      setScan(diagnosis);
      setScanHistory((items) => [
        {
          id: `scan-${Date.now()}`,
          imageUri: uri,
          diagnosis,
          scannedAt: new Date().toISOString(),
        },
        ...items,
      ].slice(0, 8));
    } catch {
      const failedDiagnosis = {
        title: "Image could not be verified",
        confidence: 0,
        color: "#c14f3d",
        symptoms:
          "GrowMind could not read the uploaded image pixels, so it will not guess.",
        action:
          "Try a JPG or PNG image, avoid screenshots from protected apps, and upload a clear leaf photo.",
        isPlant: false,
      };
      setScan(failedDiagnosis);
      setScanHistory((items) => [
        {
          id: `scan-${Date.now()}`,
          imageUri: uri,
          diagnosis: failedDiagnosis,
          scannedAt: new Date().toISOString(),
        },
        ...items,
      ].slice(0, 8));
    } finally {
      setIsScanning(false);
    }
  }

  function runDemoScan(diagnosis: Diagnosis) {
    setLeafImageUri(null);
    setScan(diagnosis);
    setScanHistory((items) => [
      {
        id: `demo-${Date.now()}`,
        imageUri: null,
        diagnosis,
        scannedAt: new Date().toISOString(),
      },
      ...items,
    ].slice(0, 8));
  }

  async function pickLeafImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLeafImageUri(uri);
      setScan({
        ...waitingDiagnosis,
        title: "Image ready to scan",
        symptoms:
          "The selected image is loaded. Press Scan to verify plant coverage and diagnose it.",
        action: "Use Scan after selecting a leaf photo.",
      });
      await runPlantScan(uri);
    }
  }

  async function takeLeafPhoto() {
    if (!shouldUseCameraPicker()) {
      await pickLeafImage();
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setScan({
        title: "Camera permission needed",
        confidence: 0,
        color: "#c14f3d",
        symptoms: "GrowMind cannot open the camera without permission.",
        action: "Allow camera access, or use Upload image instead.",
        isPlant: false,
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLeafImageUri(uri);
      setScan({
        ...waitingDiagnosis,
        title: "Photo ready to scan",
        symptoms:
          "The camera photo is loaded. Press Scan to verify plant coverage and diagnose it.",
        action: "Use Scan after taking a close-up leaf photo.",
      });
      await runPlantScan(uri);
    }
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.app}>
        <StatusBar style="dark" />
        <View style={styles.contentInner}>
          <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} onResetPassword={handleResetPassword} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <GrowMindLogo />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Pressable onPress={() => setIsProfileOpen(true)} style={styles.profileButton}>
            <View style={styles.profileGlyph}>
              <View style={styles.profileGlyphHead} />
              <View style={styles.profileGlyphBody} />
            </View>
          </Pressable>
        </View>
      </View>

      {isProfileOpen ? (
        <View style={styles.contentInner}>
          <ProfileScreen
            username={authUser}
            onClose={() => setIsProfileOpen(false)}
            onSignOut={handleLogout}
          />
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {activeTab === "My Farm" && (
          <MyFarmPage
            plants={plants}
            sections={sections}
            onUpdateSection={updateSection}
          />
        )}

        {activeTab === "My Plants" && (
          <MyPlantsPage
            plants={plants}
            selectedPlant={selectedPlant}
            setSelectedPlantId={setSelectedPlantId}
            onRefresh={() => setTick((value) => (value >= 9 ? 1 : value + 1))}
          />
        )}

        {activeTab === "Home" && (
          <HomePage
            plants={plants}
            avgGrowth={avgGrowth}
            totalWater={totalWater}
            totalEnergy={totalEnergy}
            urgentAlerts={urgentAlerts}
            nextHarvest={calendarItems[0]}
            onRefresh={() => setTick((value) => (value >= 9 ? 1 : value + 1))}
          />
        )}

        {activeTab === "Calendar" && (
          <CalendarPage
            items={calendarItems}
            editingId={editingId}
            plantInput={plantInput}
            cropInput={cropInput}
            dateInput={dateInput}
            harvestInput={harvestInput}
            calendarMonth={calendarMonth}
            setPlantInput={setPlantInput}
            setCropInput={updateCalendarCrop}
            setDateInput={updatePlantedDate}
            setHarvestInput={setHarvestInput}
            setCalendarMonth={setCalendarMonth}
            onSave={saveCalendarItem}
            onEdit={editCalendarItem}
            onDelete={deleteCalendarItem}
          />
        )}

        {activeTab === "Doctor" && (
          <DoctorPage
            imageUri={leafImageUri}
            scan={scan}
            scanHistory={scanHistory}
            isScanning={isScanning}
            onPickImage={pickLeafImage}
            onTakePhoto={takeLeafPhoto}
            onRunScan={() => runPlantScan()}
            onDemoScan={runDemoScan}
          />
        )}
      </ScrollView>
      )}

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
          >
            <TabIcon tab={tab} active={activeTab === tab} />
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const iconColor = active ? "#ffffff" : "#76827a";

  if (tab === "Home") {
    return (
      <View style={styles.tabIconBox}>
        <View
          style={[
            styles.homeRoof,
            { borderBottomColor: iconColor },
          ]}
        />
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
      <View style={[styles.doctorCrossVertical, { backgroundColor: iconColor }]} />
      <View style={[styles.doctorCrossHorizontal, { backgroundColor: iconColor }]} />
    </View>
  );
}

function HomePage({
  plants,
  avgGrowth,
  totalWater,
  totalEnergy,
  urgentAlerts,
  nextHarvest,
  onRefresh,
}: {
  plants: Plant[];
  avgGrowth: number;
  totalWater: string;
  totalEnergy: string;
  urgentAlerts: Plant[];
  nextHarvest?: CalendarItem;
  onRefresh: () => void;
}) {
  const bestPlant = plants.reduce(
    (best, plant) => (plant.growthScore > best.growthScore ? plant : best),
    plants[0],
  );
  const farmMood =
    avgGrowth >= 86
      ? "Thriving"
      : avgGrowth >= 75
        ? "Needs light tuning"
        : "Needs attention";

  return (
    <>
      <View style={styles.homeHero}>
        <View style={styles.homeHeroTop}>
          <View>
            <Text style={styles.heroLabel}>Today in your farm</Text>
            <Text style={styles.homeMood}>{farmMood}</Text>
          </View>
          <View style={styles.scoreBubble}>
            <Text style={styles.scoreBubbleValue}>{avgGrowth}</Text>
            <Text style={styles.scoreBubbleLabel}>score</Text>
          </View>
        </View>
        <View style={styles.canopyScene}>
          <View style={styles.canopyStem} />
          <View style={[styles.canopyLeaf, styles.canopyLeafLeft]} />
          <View style={[styles.canopyLeaf, styles.canopyLeafRight]} />
          <View style={styles.canopyTray} />
        </View>
        <Text style={styles.homeHeroText}>
          {bestPlant.name} is your strongest tray today. GrowMind is balancing
          water, energy, and harvest timing across {plants.length} sections.
        </Text>
        <Pressable onPress={onRefresh} style={styles.homeRefreshButton}>
          <Text style={styles.primaryButtonText}>Refresh live sensors</Text>
        </Pressable>
      </View>

      <View style={styles.homeMetricRow}>
        <FreshMetric
          label="Water"
          value={`${totalWater} L`}
          note="used today"
        />
        <FreshMetric label="Energy" value={`${totalEnergy}`} note="kWh today" />
        <FreshMetric
          label="Harvest"
          value={nextHarvest?.harvestDate.slice(5) ?? "--"}
          note="next date"
        />
      </View>

      <SectionTitle
        title="Morning Brief"
        action={`${urgentAlerts.length} alerts`}
      />
      <View style={styles.briefCard}>
        <Text style={styles.cardTitle}>
          {urgentAlerts.length === 0
            ? "Everything is stable"
            : `${urgentAlerts.length} section needs action`}
        </Text>
        <Text style={styles.bodyText}>
          {urgentAlerts.length === 0
            ? "All active plants are inside their crop target range."
            : `${urgentAlerts[0].section} is drifting outside its crop profile. Check pH, moisture, or temperature first.`}
        </Text>
      </View>

      <SectionTitle title="Growth Pulse" action="Last 6 checks" />
      <LineChart values={[68, 72, 75, 78, 83, avgGrowth]} />
    </>
  );
}

function MyFarmPage({
  plants,
  sections,
  onUpdateSection,
}: {
  plants: Plant[];
  sections: FarmSection[];
  onUpdateSection: (
    sectionId: string,
    field: keyof FarmSection,
    deltaOrValue: number | boolean,
  ) => void;
}) {
  return (
    <>
      <PageIntro
        title="My Farm"
        text="Control each rack section using plant-specific profiles for LEDs, fans, hydroponic pumps, and nutrient dosing."
      />
      {sections.map((section) => {
        const plant =
          plants.find((item) => item.id === section.plantId) ?? plants[0];
        return (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{section.name}</Text>
                <Text style={styles.bodyText}>
                  {plant.name} - {plant.variety}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  onUpdateSection(section.id, "auto", !section.auto)
                }
                style={[
                  styles.autoBadge,
                  section.auto && styles.autoBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.autoText,
                    section.auto && styles.autoTextActive,
                  ]}
                >
                  {section.auto ? "AUTO" : "MANUAL"}
                </Text>
              </Pressable>
            </View>
            {section.auto && (
              <Text style={styles.autoHint}>
                Auto is active. GrowMind is controlling this section from the{" "}
                {plant.variety} profile.
              </Text>
            )}
            <ControlAdjuster
              disabled={section.auto}
              label="LED spectrum"
              value={section.led}
              onMinus={() => onUpdateSection(section.id, "led", -5)}
              onPlus={() => onUpdateSection(section.id, "led", 5)}
            />
            <ControlAdjuster
              disabled={section.auto}
              label="Cooling fan"
              value={section.fan}
              onMinus={() => onUpdateSection(section.id, "fan", -5)}
              onPlus={() => onUpdateSection(section.id, "fan", 5)}
            />
            <ControlAdjuster
              disabled={section.auto}
              label="Hydro pump"
              value={section.pump}
              onMinus={() => onUpdateSection(section.id, "pump", -5)}
              onPlus={() => onUpdateSection(section.id, "pump", 5)}
            />
            <ControlAdjuster
              disabled={section.auto}
              label="Nutrient mix"
              value={section.nutrient}
              onMinus={() => onUpdateSection(section.id, "nutrient", -5)}
              onPlus={() => onUpdateSection(section.id, "nutrient", 5)}
            />
          </View>
        );
      })}
    </>
  );
}

function MyPlantsPage({
  plants,
  selectedPlant,
  setSelectedPlantId,
  onRefresh,
}: {
  plants: Plant[];
  selectedPlant: Plant;
  setSelectedPlantId: (id: string) => void;
  onRefresh: () => void;
}) {
  const target = cropTargets[selectedPlant.cropKey];
  const age = daysBetween(selectedPlant.plantedDate);
  const progress = clamp(
    Math.round((age / selectedPlant.harvestDay) * 100),
    0,
    100,
  );

  return (
    <>
      <PageIntro
        title="My Plants"
        text="Inspect real-time sensor readings, growth metrics, resource consumption, and historical trends for every plant."
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plantRail}
      >
        {plants.map((plant) => (
          <Pressable
            key={plant.id}
            onPress={() => setSelectedPlantId(plant.id)}
            style={[
              styles.plantPill,
              selectedPlant.id === plant.id && styles.plantPillActive,
            ]}
          >
            <Text
              style={[
                styles.plantPillText,
                selectedPlant.id === plant.id && styles.plantPillTextActive,
              ]}
            >
              {plant.name}
            </Text>
            <Text
              style={[
                styles.plantPillMeta,
                selectedPlant.id === plant.id && styles.plantPillTextActive,
              ]}
            >
              {plant.section}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{selectedPlant.name}</Text>
            <Text style={styles.bodyText}>
              {selectedPlant.variety} - planted {selectedPlant.plantedDate}
            </Text>
          </View>
          <Pressable onPress={onRefresh} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Refresh</Text>
          </Pressable>
        </View>
        <ProgressBar value={progress} color="#2d7d4a" />
        <Text style={styles.metricText}>
          {progress}% toward expected harvest window
        </Text>
      </View>

      <View style={styles.grid}>
        <SensorCard
          label="Temperature"
          value={`${selectedPlant.temp} C`}
          target={`${target.temp[0]}-${target.temp[1]} C`}
          status={within(selectedPlant.temp, target.temp)}
        />
        <SensorCard
          label="Humidity"
          value={`${selectedPlant.humidity}%`}
          target={`${target.humidity[0]}-${target.humidity[1]}%`}
          status={within(selectedPlant.humidity, target.humidity)}
        />
        <SensorCard
          label="Moisture"
          value={`${selectedPlant.moisture}%`}
          target={`${target.moisture[0]}-${target.moisture[1]}%`}
          status={within(selectedPlant.moisture, target.moisture)}
        />
        <SensorCard
          label="Water pH"
          value={`${selectedPlant.ph}`}
          target={`${target.ph[0]}-${target.ph[1]}`}
          status={within(selectedPlant.ph, target.ph)}
        />
      </View>

      <SectionTitle title="Resources" action="Daily usage" />
      <View style={styles.summaryGrid}>
        <StatCard label="Water" value={`${selectedPlant.waterToday} L`} />
        <StatCard label="Energy" value={`${selectedPlant.energyToday} kWh`} />
      </View>
      <SectionTitle title="Historical Growth" action="Last 6 checks" />
      <LineChart values={selectedPlant.history} />
    </>
  );
}

function CalendarPage({
  items,
  editingId,
  plantInput,
  cropInput,
  dateInput,
  harvestInput,
  calendarMonth,
  setPlantInput,
  setCropInput,
  setDateInput,
  setHarvestInput,
  setCalendarMonth,
  onSave,
  onEdit,
  onDelete,
}: {
  items: CalendarItem[];
  editingId: string | null;
  plantInput: string;
  cropInput: CropKey;
  dateInput: string;
  harvestInput: string;
  calendarMonth: Date;
  setPlantInput: (value: string) => void;
  setCropInput: (value: CropKey) => void;
  setDateInput: (value: string) => void;
  setHarvestInput: (value: string) => void;
  setCalendarMonth: (value: Date) => void;
  onSave: () => void;
  onEdit: (item: CalendarItem) => void;
  onDelete: (id: string) => void;
}) {
  const days = getMonthDays(calendarMonth);
  const month = calendarMonth.getMonth();
  const year = calendarMonth.getFullYear();
  const suggestedNextPlanting = addDays(harvestInput, 2);

  return (
    <>
      <PageIntro
        title="Calendar"
        text="Add, modify, and delete planted dates so users can plan harvest and next planting cycles."
      />
      <View style={styles.monthCard}>
        <View style={styles.monthHeader}>
          <Pressable
            onPress={() => setCalendarMonth(new Date(year, month - 1, 1))}
            style={styles.monthButton}
          >
            <Text style={styles.monthButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>{formatMonth(calendarMonth)}</Text>
          <Pressable
            onPress={() => setCalendarMonth(new Date(year, month + 1, 1))}
            style={styles.monthButton}
          >
            <Text style={styles.monthButtonText}>›</Text>
          </Pressable>
        </View>
        <View style={styles.weekRow}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.weekText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            const iso = day ? formatDateLocal(day) : undefined;
            const events = iso
              ? items.filter(
                  (item) =>
                    item.plantedDate === iso || item.harvestDate === iso,
                )
              : [];
            return (
              <Pressable
                key={`${iso ?? "blank"}-${index}`}
                disabled={!iso}
                onPress={() => iso && setDateInput(iso)}
                style={[
                  styles.dayCell,
                  iso === dateInput && styles.dayCellSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    iso === dateInput && styles.dayTextSelected,
                  ]}
                >
                  {day ? day.getDate() : ""}
                </Text>
                {events.length > 0 && <View style={styles.eventDot} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>
          {editingId ? "Modify Plant Date" : "Add Plant Date"}
        </Text>
        <TextInput
          style={styles.input}
          value={plantInput}
          onChangeText={setPlantInput}
          placeholder="Plant name"
        />
        <View style={styles.cropChoiceRow}>
          {(Object.keys(cropLabels) as CropKey[]).map((cropKey) => (
            <Pressable
              key={cropKey}
              onPress={() => setCropInput(cropKey)}
              style={[
                styles.cropChoice,
                cropInput === cropKey && styles.cropChoiceActive,
              ]}
            >
              <Text
                style={[
                  styles.cropChoiceText,
                  cropInput === cropKey && styles.cropChoiceTextActive,
                ]}
              >
                {cropLabels[cropKey]}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={dateInput}
          onChangeText={setDateInput}
          placeholder="Planted date YYYY-MM-DD"
        />
        <TextInput
          style={styles.input}
          value={harvestInput}
          onChangeText={setHarvestInput}
          placeholder="Harvest date YYYY-MM-DD"
        />
        <View style={styles.suggestionBox}>
          <Text style={styles.recommendationText}>
            {cropLabels[cropInput]} usually needs {cropHarvestDays[cropInput]}{" "}
            days. Suggested harvest:{" "}
            {addDays(dateInput, cropHarvestDays[cropInput])}
          </Text>
          <Text style={styles.metricText}>
            Next planting window: {suggestedNextPlanting}
          </Text>
        </View>
        <Pressable onPress={onSave} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {editingId ? "Save changes" : "Add schedule"}
          </Text>
        </Pressable>
      </View>

      <SectionTitle
        title="Planting Schedule"
        action={`${items.length} records`}
      />
      {items.map((item) => (
        <View key={item.id} style={styles.calendarCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.plantName}</Text>
            <Text style={styles.sensorLabel}>{cropLabels[item.cropKey]}</Text>
            <Text style={styles.bodyText}>Planted {item.plantedDate}</Text>
            <Text style={styles.recommendationText}>
              Harvest {item.harvestDate} -{" "}
              {daysBetween("2026-05-05", item.harvestDate)} days left
            </Text>
          </View>
          <View style={styles.calendarActions}>
            <Pressable onPress={() => onEdit(item)} style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => onDelete(item.id)}
              style={[styles.smallButton, styles.deleteButton]}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </>
  );
}

function GrowMindLogo() {
  return (
    <View style={styles.logoLockup}>
      <Image
        source={require("./assets/plantdoctor-icon.png")}
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

function DoctorPage({
  imageUri,
  scan,
  scanHistory,
  isScanning,
  onPickImage,
  onTakePhoto,
  onRunScan,
  onDemoScan,
}: {
  imageUri: string | null;
  scan: Diagnosis;
  scanHistory: ScanHistoryItem[];
  isScanning: boolean;
  onPickImage: () => void;
  onTakePhoto: () => void;
  onRunScan: () => void;
  onDemoScan: (diagnosis: Diagnosis) => void;
}) {
  const latestHistory = scanHistory[0] ?? null;
  const report = createScanReport(latestHistory, scan);
  const treatmentSteps = getTreatmentSteps(scan);
  const preventionTips = getPreventionTips(scan);

  return (
    <>
      <PageIntro
        title="Doctor"
        text="Take or upload a plant photo. Strict mode rejects anything that does not look like a leaf-dominant plant image."
      />
      <View style={styles.scanner}>
        <View style={styles.cameraFrame}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.uploadedImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.scanLeaf} />
          )}
          <View style={styles.scanLine} />
          <Text style={styles.cameraText}>
            {imageUri ? "Selected plant image" : "No image selected"}
          </Text>
        </View>
        <View style={styles.scanActions}>
          <Pressable
            onPress={onTakePhoto}
            style={[styles.scanButton, styles.cameraButton]}
          >
            <Text style={styles.scanButtonText}>Take photo</Text>
          </Pressable>
          <Pressable
            onPress={onPickImage}
            style={[styles.scanButton, styles.uploadButton]}
          >
            <Text style={styles.scanButtonText}>Upload</Text>
          </Pressable>
          <Pressable onPress={onRunScan} style={styles.scanButton}>
            <Text style={styles.scanButtonText}>Scan</Text>
          </Pressable>
        </View>
        <View style={styles.demoRow}>
          {demoScans.map((demo) => (
            <Pressable
              key={demo.label}
              onPress={() => onDemoScan(demo.diagnosis)}
              style={styles.demoButton}
            >
              <Text style={styles.demoButtonText}>{demo.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <SectionTitle
        title="Diagnosis"
        action={isScanning ? "Scanning image" : getScanStatus(scan)}
      />
      <View style={styles.diagnosisCard}>
        <View
          style={[styles.diagnosisStrip, { backgroundColor: scan.color }]}
        />
        <View style={styles.diagnosisBody}>
          <View style={styles.diagnosisHeader}>
            <Text style={styles.diagnosisTitle}>{scan.title}</Text>
            <View style={[styles.confidenceBadge, { borderColor: scan.color }]}>
              <Text style={[styles.confidenceText, { color: scan.color }]}>
                {scan.confidence}%
              </Text>
            </View>
          </View>
          <Text style={styles.bodyText}>{scan.symptoms}</Text>
          <Text style={styles.recommendationText}>{scan.action}</Text>
          {scan.metrics && (
            <Text style={styles.metricText}>
              Plant score {scan.metrics.plantScore}% | Green{" "}
              {scan.metrics.greenRatio}% | Yellow {scan.metrics.yellowRatio}% |
              Brown {scan.metrics.brownRatio}%
            </Text>
          )}
          {scan.source && (
            <Text style={styles.metricText}>
              AI source: {scan.source}
              {scan.aiLabel ? ` | Match: ${scan.aiLabel}` : ""}
            </Text>
          )}
          {scan.aiError && (
            <Text style={styles.metricText}>API error: {scan.aiError}</Text>
          )}
        </View>
      </View>

      <SectionTitle title="Care Plan" action={getRescanAdvice(scan)} />
      <View style={styles.careGrid}>
        <View style={styles.careCard}>
          <Text style={styles.cardTitle}>Treatment steps</Text>
          {treatmentSteps.map((step, index) => (
            <Text key={step} style={styles.careText}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
        <View style={styles.careCard}>
          <Text style={styles.cardTitle}>Prevention</Text>
          {preventionTips.map((tip) => (
            <Text key={tip} style={styles.careText}>
              - {tip}
            </Text>
          ))}
        </View>
      </View>

      <SectionTitle title="Scan History" action={`${scanHistory.length} saved`} />
      <View style={styles.historyList}>
        {scanHistory.length === 0 ? (
          <Text style={styles.bodyText}>
            No scans saved yet. Upload a plant image or run demo mode to create
            a history record.
          </Text>
        ) : (
          scanHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              {item.imageUri ? (
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.historyImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.historyDemoImage}>
                  <View style={styles.historyDemoLeaf} />
                </View>
              )}
              <View style={styles.historyTextWrap}>
                <Text style={styles.historyTitle}>{item.diagnosis.title}</Text>
                <Text style={styles.metricText}>
                  {new Date(item.scannedAt).toLocaleString()} |{" "}
                  {item.diagnosis.confidence}% confidence
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <SectionTitle title="Report" action="Demo ready" />
      <View style={styles.reportCard}>
        <Text style={styles.reportText}>{report}</Text>
      </View>
    </>
  );
}

function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.pageIntro}>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.sensorLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function FreshMetric({
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

function SensorCard({
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

function AlertRow({ text }: { text: string }) {
  return (
    <View style={styles.alertRow}>
      <View style={styles.alertIcon}>
        <Text style={styles.alertIconText}>!</Text>
      </View>
      <Text style={styles.alertText}>{text}</Text>
    </View>
  );
}

function ControlAdjuster({
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
          style={[styles.adjustButton, disabled && styles.adjustButtonDisabled]}
        >
          <Text style={styles.adjustText}>-</Text>
        </Pressable>
        <Pressable
          disabled={disabled}
          onPress={onPlus}
          style={[styles.adjustButton, disabled && styles.adjustButtonDisabled]}
        >
          <Text style={styles.adjustText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
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

function LineChart({ values }: { values: number[] }) {
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

const styles = StyleSheet.create({
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
