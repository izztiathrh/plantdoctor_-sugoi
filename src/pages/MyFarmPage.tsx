import { Pressable, Text, View } from "react-native";
import { ControlAdjuster, PageIntro, styles, type FarmSection, type Plant } from "../shared";

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

