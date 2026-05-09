import { Pressable, Text, View } from "react-native";
import { AlertRow, ControlAdjuster, FreshMetric, PageIntro, SectionTitle, styles, type FarmSection, type Plant } from "../shared";

export function MyFarmPage({
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
  const avgLed = Math.round(
    sections.reduce((sum, section) => sum + section.led, 0) / sections.length,
  );
  const avgPump = Math.round(
    sections.reduce((sum, section) => sum + section.pump, 0) / sections.length,
  );
  const avgNutrient = Math.round(
    sections.reduce((sum, section) => sum + section.nutrient, 0) / sections.length,
  );
  const lowSupplyAlerts = sections.flatMap((section) => {
    const alerts: string[] = [];
    if (section.pump < 40) alerts.push(`${section.name} water level is low`);
    if (section.nutrient < 40) alerts.push(`${section.name} nutrient level is low`);
    if (section.led < 55) alerts.push(`${section.name} LED capacity is low`);
    return alerts;
  });

  return (
    <>
      <PageIntro
        title="My Farm"
        text="Control each rack section using plant-specific profiles for LEDs, fans, hydroponic pumps, and nutrient dosing."
      />
      <SectionTitle title="Supply Monitor" action="Notify when low" />
      <View style={styles.homeMetricRow}>
        <FreshMetric label="Water level" value={`${avgPump}%`} note="reservoir" />
        <FreshMetric label="Nutrient level" value={`${avgNutrient}%`} note="mix" />
        <FreshMetric label="LED capacity" value={`${avgLed}%`} note="lighting" />
      </View>
      {lowSupplyAlerts.length === 0 ? (
        <View style={styles.briefCard}>
          <Text style={styles.bodyText}>
            Water, nutrient, and LED levels are within safe range.
          </Text>
        </View>
      ) : (
        lowSupplyAlerts.slice(0, 4).map((alert) => (
          <AlertRow key={alert} text={alert} />
        ))
      )}
      {sections.map((section) => {
        const plant =
          plants.find((item) => item.id === section.plantId) ?? plants[0];
        if (!plant) {
          return (
            <View key={section.id} style={styles.sectionCard}>
              <Text style={styles.bodyText}>
                No plant assigned to this section yet.
              </Text>
            </View>
          );
        }
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
                style={({ pressed }) => [
                  styles.autoBadge,
                  section.auto && styles.autoBadgeActive,
                  pressed && styles.buttonPressed,
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

