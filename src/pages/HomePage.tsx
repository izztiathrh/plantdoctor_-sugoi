import { Pressable, Text, View } from "react-native";
import { FreshMetric, LineChart, SectionTitle, formatDateDisplay, styles, type CalendarItem, type HarvestReadiness, type HomeAlert, type Plant } from "../shared";

export function HomePage({
  plants,
  avgGrowth,
  totalWater,
  totalEnergy,
  urgentAlerts,
  harvestReadiness,
  estimatedHarvestThisWeek,
  waterSavedLiters,
  atRiskPercent,
  nextHarvest,
  onRefresh,
  onApplyAlertAction,
}: {
  plants: Plant[];
  avgGrowth: number;
  totalWater: string;
  totalEnergy: string;
  urgentAlerts: HomeAlert[];
  harvestReadiness: HarvestReadiness[];
  estimatedHarvestThisWeek: number;
  waterSavedLiters: string;
  atRiskPercent: number;
  nextHarvest?: CalendarItem;
  onRefresh: () => void;
  onApplyAlertAction: (alert: HomeAlert) => void;
}) {
  const bestPlant =
    plants.length > 0
      ? plants.reduce(
          (best, plant) =>
            plant.growthScore > best.growthScore ? plant : best,
          plants[0],
        )
      : null;
  const farmMood =
    avgGrowth >= 86
      ? "Thriving"
      : avgGrowth >= 75
        ? "Needs light tuning"
        : "Needs attention";
  const harvestTodo = harvestReadiness
    .filter((entry) => entry.daysLeft <= 30)
    .slice(0, 5);
  const topReadiness = harvestReadiness.slice(0, 3);

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
          {bestPlant
            ? `${bestPlant.name} is your strongest tray today. PlantDoctor is balancing water, energy, and harvest timing across ${plants.length} sections.`
            : "No plants tracked yet. Add your first schedule to start live monitoring and optimization."}
        </Text>
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => [
            styles.homeRefreshButton,
            pressed && styles.buttonPressed,
          ]}
        >
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
          value={nextHarvest ? formatDateDisplay(nextHarvest.harvestDate) : "--"}
          note="next date"
        />
      </View>

      <SectionTitle title="Harvest Todo" action="Next 30 days" />
      <View style={styles.readinessList}>
        {harvestTodo.length === 0 ? (
          <View style={styles.briefCard}>
            <Text style={styles.bodyText}>
              No harvests are due in the next month.
            </Text>
          </View>
        ) : (
          harvestTodo.map((entry) => (
            <View key={`${entry.plantId}-${entry.harvestDate}`} style={styles.weeklyPlanItem}>
              <View style={styles.readinessHeader}>
                <View>
                  <Text style={styles.cardTitle}>{entry.plantName}</Text>
                  <Text style={styles.sensorLabel}>{formatDateDisplay(entry.harvestDate)}</Text>
                </View>
                <View
                  style={[
                    styles.readinessBadge,
                    entry.status === "Ready"
                      ? styles.readinessBadgeReady
                      : entry.status === "Almost Ready"
                        ? styles.readinessBadgeAlmost
                        : styles.readinessBadgeDelayed,
                  ]}
                >
                  <Text style={styles.readinessBadgeText}>{entry.status}</Text>
                </View>
              </View>
              <Text style={styles.bodyText}>{entry.daysLeft} days left to harvest</Text>
              <Text style={styles.metricText}>Plan harvesting and next planting in the same month list.</Text>
            </View>
          ))
        )}
      </View>

      <SectionTitle title="Impact Snapshot" action="Outcome-first" />
      <View style={styles.impactGrid}>
        <View style={styles.impactCard}>
          <Text style={styles.sensorLabel}>Estimated harvest</Text>
          <Text style={styles.impactValue}>{estimatedHarvestThisWeek}</Text>
          <Text style={styles.impactNote}>plants ready in 7 days</Text>
        </View>
        <View style={styles.impactCard}>
          <Text style={styles.sensorLabel}>Water saved</Text>
          <Text style={styles.impactValue}>{waterSavedLiters} L</Text>
          <Text style={styles.impactNote}>vs manual baseline</Text>
        </View>
        <View style={[styles.impactCard, styles.impactCardWide]}>
          <Text style={styles.sensorLabel}>Plants at risk</Text>
          <Text style={styles.impactValue}>{atRiskPercent}%</Text>
          <Text style={styles.impactNote}>
            sections currently outside target conditions
          </Text>
        </View>
      </View>

      <SectionTitle title="Harvest Readiness" action="Prioritized" />
      <View style={styles.readinessList}>
        {topReadiness.length === 0 ? (
          <View style={styles.briefCard}>
            <Text style={styles.bodyText}>
              Add planting schedules to compute readiness forecasts.
            </Text>
          </View>
        ) : (
          topReadiness.map((entry) => (
            <View key={entry.plantId} style={styles.readinessCard}>
              <View style={styles.readinessHeader}>
                <View>
                  <Text style={styles.cardTitle}>{entry.plantName}</Text>
                  <Text style={styles.sensorLabel}>{entry.section}</Text>
                </View>
                <View
                  style={[
                    styles.readinessBadge,
                    entry.status === "Ready"
                      ? styles.readinessBadgeReady
                      : entry.status === "Almost Ready"
                        ? styles.readinessBadgeAlmost
                        : styles.readinessBadgeDelayed,
                  ]}
                >
                  <Text style={styles.readinessBadgeText}>{entry.status}</Text>
                </View>
              </View>
              <Text style={styles.bodyText}>
                Score {entry.score}/100 | Harvest {formatDateDisplay(entry.harvestDate)}
              </Text>
              <Text style={styles.metricText}>{entry.daysLeft} days remaining</Text>
            </View>
          ))
        )}
      </View>

      <SectionTitle
        title="Morning Brief"
        action={`${urgentAlerts.length} alerts`}
      />
      {urgentAlerts.length === 0 ? (
        <View style={styles.briefCard}>
          <Text style={styles.cardTitle}>Everything is stable</Text>
          <Text style={styles.bodyText}>
            All active plants are inside their crop target range.
          </Text>
        </View>
      ) : (
        urgentAlerts.slice(0, 4).map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertHead}>
              <View>
                <Text style={styles.cardTitle}>{alert.section}</Text>
                <Text style={styles.sensorLabel}>
                  {alert.plantName} - {alert.issue}
                </Text>
              </View>
              <View
                style={[
                  styles.alertSeverity,
                  alert.severity === "High"
                    ? styles.alertSeverityHigh
                    : alert.severity === "Medium"
                      ? styles.alertSeverityMedium
                      : styles.alertSeverityLow,
                ]}
              >
                <Text style={styles.alertSeverityText}>{alert.severity}</Text>
              </View>
            </View>
            <Text style={styles.bodyText}>{alert.recommendation}</Text>
            <Pressable
              onPress={() => onApplyAlertAction(alert)}
              style={({ pressed }) => [
                styles.alertActionButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.alertActionText}>Apply suggested fix</Text>
            </Pressable>
          </View>
        ))
      )}

      <SectionTitle title="Growth Pulse" action="Last 6 checks" />
      <LineChart values={[68, 72, 75, 78, 83, avgGrowth]} />
    </>
  );
}

