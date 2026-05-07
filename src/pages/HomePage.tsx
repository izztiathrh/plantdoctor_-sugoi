import { Pressable, Text, View } from "react-native";
import { FreshMetric, LineChart, SectionTitle, styles, type CalendarItem, type Plant } from "../shared";

export function HomePage({
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

