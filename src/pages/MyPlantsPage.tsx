import { Pressable, ScrollView, Text, View } from "react-native";
import { LineChart, PageIntro, ProgressBar, SectionTitle, SensorCard, StatCard, clamp, cropTargets, daysBetween, formatDateDisplay, styles, type Plant, within } from "../shared";

export function MyPlantsPage({
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
              {selectedPlant.variety} - planted {formatDateDisplay(selectedPlant.plantedDate)}
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

