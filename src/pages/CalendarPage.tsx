import { Pressable, Text, TextInput, View } from "react-native";
import { PageIntro, SectionTitle, addDays, cropHarvestDays, cropLabels, daysBetween, formatDateLocal, formatMonth, getMonthDays, styles, type CalendarItem, type CropKey } from "../shared";

export function CalendarPage({
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

