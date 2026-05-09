import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { CalendarPage } from "./src/pages/CalendarPage";
import { DoctorPage } from "./src/pages/DoctorPage";
import { HomePage } from "./src/pages/HomePage";
import { LoginScreen } from "./src/pages/LoginScreen";
import { MyFarmPage } from "./src/pages/MyFarmPage";
import { MyPlantsPage } from "./src/pages/MyPlantsPage";
import { ProfileScreen } from "./src/pages/ProfileScreen";
import {
  GrowMindLogo,
  TabIcon,
  addDays,
  analyzeImageWithFreeAi,
  clamp,
  createPlantFromSchedule,
  cropHarvestDays,
  cropTargets,
  cropVarieties,
  daysBetween,
  getAutoRecipe,
  initialCalendar,
  initialPlants,
  initialSections,
  shouldUseCameraPicker,
  storageKey,
  styles,
  tabs,
  type CalendarItem,
  type CropKey,
  type Diagnosis,
  type FarmSection,
  type HarvestReadiness,
  type HomeAlert,
  type SavedPlantDoctorState,
  type ScanHistoryItem,
  type TabKey,
  type UserRecord,
  waitingDiagnosis,
  within,
} from "./src/shared";

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

  async function handleSignUp(
    username: string,
    password: string,
    fullName: string,
    phone?: string,
    email?: string,
  ) {
    if (!username || !password || !fullName)
      return {
        ok: false,
        message: "Full name, username and password required",
      };
    const users = await loadUsers();
    if (users[username])
      return { ok: false, message: "Username already exists" };
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
    plants.find((plant) => plant.id === selectedPlantId) ??
    plants[0] ??
    initialPlants[0];
  const totalWater = plants
    .reduce((sum, plant) => sum + plant.waterToday, 0)
    .toFixed(1);
  const totalEnergy = plants
    .reduce((sum, plant) => sum + plant.energyToday, 0)
    .toFixed(1);
  const avgGrowth =
    plants.length === 0
      ? 0
      : Math.round(
          plants.reduce((sum, plant) => sum + plant.growthScore, 0) /
            plants.length,
        );

  const urgentAlerts = plants
    .map<HomeAlert | null>((plant) => {
      const target = cropTargets[plant.cropKey];
      const section = sections.find((record) => record.plantId === plant.id);
      if (!section) return null;

      if (plant.moisture < target.moisture[0]) {
        const gap = target.moisture[0] - plant.moisture;
        return {
          id: `${plant.id}-moisture`,
          plantId: plant.id,
          sectionId: section.id,
          section: section.name,
          plantName: plant.name,
          issue: "Low moisture",
          severity: gap >= 10 ? "High" : "Medium",
          recommendation: `Moisture is ${plant.moisture}% but target starts at ${target.moisture[0]}%. Increase pump output now.`,
          actionField: "pump",
          actionDelta: gap >= 10 ? 14 : 8,
        };
      }

      if (plant.temp > target.temp[1]) {
        const gap = plant.temp - target.temp[1];
        return {
          id: `${plant.id}-temp-high`,
          plantId: plant.id,
          sectionId: section.id,
          section: section.name,
          plantName: plant.name,
          issue: "Temperature too high",
          severity: gap >= 3 ? "High" : "Medium",
          recommendation: `Temperature is ${plant.temp}C above target max ${target.temp[1]}C. Increase fan cooling and airflow.`,
          actionField: "fan",
          actionDelta: gap >= 3 ? 14 : 8,
        };
      }

      if (plant.temp < target.temp[0]) {
        const gap = target.temp[0] - plant.temp;
        return {
          id: `${plant.id}-temp-low`,
          plantId: plant.id,
          sectionId: section.id,
          section: section.name,
          plantName: plant.name,
          issue: "Temperature too low",
          severity: gap >= 2 ? "Medium" : "Low",
          recommendation: `Temperature is ${plant.temp}C below target minimum ${target.temp[0]}C. Increase LED warmth to stabilize growth.`,
          actionField: "led",
          actionDelta: gap >= 2 ? 10 : 6,
        };
      }

      if (!within(plant.ph, target.ph)) {
        const gap =
          plant.ph < target.ph[0]
            ? target.ph[0] - plant.ph
            : plant.ph - target.ph[1];
        return {
          id: `${plant.id}-ph`,
          plantId: plant.id,
          sectionId: section.id,
          section: section.name,
          plantName: plant.name,
          issue: "pH out of range",
          severity: gap >= 0.8 ? "High" : "Medium",
          recommendation: `pH is ${plant.ph} while target range is ${target.ph[0]}-${target.ph[1]}. Increase nutrient correction dosing.`,
          actionField: "nutrient",
          actionDelta: gap >= 0.8 ? 12 : 8,
        };
      }

      return null;
    })
    .filter((alert): alert is HomeAlert => Boolean(alert));

  const harvestReadiness = plants
    .map<HarvestReadiness>((plant) => {
      const schedule = calendarItems.find((item) => item.plantId === plant.id);
      const harvestDate =
        schedule?.harvestDate ?? addDays(plant.plantedDate, plant.harvestDay);
      const daysLeft = daysBetween("2026-05-05", harvestDate);
      const target = cropTargets[plant.cropKey];
      const stabilityPenalty =
        (within(plant.temp, target.temp) ? 0 : 12) +
        (within(plant.ph, target.ph) ? 0 : 12) +
        (plant.moisture >= target.moisture[0] ? 0 : 16);
      const stabilityScore = clamp(100 - stabilityPenalty, 35, 100);
      const timingScore =
        daysLeft === 0 ? 100 : daysLeft <= 3 ? 88 : daysLeft <= 7 ? 72 : 55;
      const score = Math.round(
        plant.growthScore * 0.5 + timingScore * 0.3 + stabilityScore * 0.2,
      );
      const status = score >= 85 ? "Ready" : score >= 70 ? "Almost Ready" : "Delayed";

      return {
        plantId: plant.id,
        plantName: plant.name,
        section: plant.section,
        harvestDate,
        daysLeft,
        score,
        status,
      };
    })
    .sort((a, b) => b.score - a.score);

  const estimatedHarvestThisWeek = harvestReadiness.filter(
    (entry) => entry.daysLeft <= 7,
  ).length;
  const baselineWater = plants.length * 5.8;
  const waterSavedLiters = Math.max(0, baselineWater - Number(totalWater)).toFixed(1);
  const atRiskPercent =
    plants.length === 0
      ? 0
      : Math.round((urgentAlerts.length / plants.length) * 100);
  const nextHarvest = [...calendarItems].sort((left, right) =>
    left.harvestDate.localeCompare(right.harvestDate),
  )[0];

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

  function applyAlertAction(alert: HomeAlert) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== alert.sectionId) return section;
        return {
          ...section,
          auto: false,
          [alert.actionField]: clamp(
            section[alert.actionField] + alert.actionDelta,
            0,
            100,
          ),
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

    const nextPlantDate = addDays(harvestInput.trim(), 2);
    setPlantInput("New Plant");
    setDateInput(nextPlantDate);
    setHarvestInput(addDays(nextPlantDate, cropHarvestDays[cropInput]));
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

  function normalizeDateInput(value: string) {
    const trimmed = value.trim();
    const slashDate = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (slashDate) {
      const [, day, month, year] = slashDate;
      return `${year}-${month}-${day}`;
    }
    return trimmed;
  }

  function isCompleteIsoDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00`);
    return !Number.isNaN(parsed.getTime());
  }

  function updatePlantedDate(date: string) {
    const normalizedDate = normalizeDateInput(date);
    setDateInput(normalizedDate);
    if (!isCompleteIsoDate(normalizedDate)) return;
    setHarvestInput(addDays(normalizedDate, cropHarvestDays[cropInput]));
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
      setScanHistory((items) =>
        [
          {
            id: `scan-${Date.now()}`,
            imageUri: uri,
            diagnosis,
            scannedAt: new Date().toISOString(),
          },
          ...items,
        ].slice(0, 8),
      );
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
      setScanHistory((items) =>
        [
          {
            id: `scan-${Date.now()}`,
            imageUri: uri,
            diagnosis: failedDiagnosis,
            scannedAt: new Date().toISOString(),
          },
          ...items,
        ].slice(0, 8),
      );
    } finally {
      setIsScanning(false);
    }
  }

  function runDemoScan(diagnosis: Diagnosis) {
    setLeafImageUri(null);
    setScan(diagnosis);
    setScanHistory((items) =>
      [
        {
          id: `demo-${Date.now()}`,
          imageUri: null,
          diagnosis,
          scannedAt: new Date().toISOString(),
        },
        ...items,
      ].slice(0, 8),
    );
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
          <LoginScreen
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onResetPassword={handleResetPassword}
          />
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
          <Pressable
            onPress={() => setIsProfileOpen(true)}
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.buttonPressed,
            ]}
          >
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
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
        >
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
              harvestReadiness={harvestReadiness}
              estimatedHarvestThisWeek={estimatedHarvestThisWeek}
              waterSavedLiters={waterSavedLiters}
              atRiskPercent={atRiskPercent}
              nextHarvest={nextHarvest}
              onRefresh={() => setTick((value) => (value >= 9 ? 1 : value + 1))}
              onApplyAlertAction={applyAlertAction}
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
            style={({ pressed }) => [
              styles.tabItem,
              activeTab === tab && styles.tabItemActive,
              pressed && styles.buttonPressed,
            ]}
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
