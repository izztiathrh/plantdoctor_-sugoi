import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { PageIntro, SectionTitle, addDays, cropHarvestDays, cropLabels, daysBetween, formatDateDisplay, formatDateLocal, formatMonth, getMonthDays, styles, type CalendarItem, type CropKey } from "../shared";

type CalendarDateEvent = {
  type: "planted" | "harvest";
  item: CalendarItem;
};

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
  const [reminderMessage, setReminderMessage] = useState("");
  const days = getMonthDays(calendarMonth);
  const month = calendarMonth.getMonth();
  const year = calendarMonth.getFullYear();
  const todayIso = formatDateLocal(new Date());
  const suggestedNextPlanting = addDays(harvestInput, 2);
  const suggestedHarvest = addDays(dateInput, cropHarvestDays[cropInput]);
  const eventsByDate = items.reduce<Record<string, CalendarDateEvent[]>>(
    (acc, item) => {
      if (!acc[item.plantedDate]) acc[item.plantedDate] = [];
      if (!acc[item.harvestDate]) acc[item.harvestDate] = [];
      acc[item.plantedDate].push({ type: "planted", item });
      acc[item.harvestDate].push({ type: "harvest", item });
      return acc;
    },
    {},
  );
  const selectedDateEvents = dateInput ? (eventsByDate[dateInput] ?? []) : [];
  const weeklyEvents = useMemo(() => {
    const today = new Date(`${todayIso}T00:00:00`);
    const end = new Date(today);
    end.setDate(end.getDate() + 6);
    const entries = Object.entries(eventsByDate).flatMap(([date, events]) =>
      events.map((event) => ({
        date,
        type: event.type,
        plantName: event.item.plantName,
        cropKey: event.item.cropKey,
      })),
    );

    return entries
      .filter((entry) => {
        const current = new Date(`${entry.date}T00:00:00`);
        return current >= today && current <= end;
      })
      .sort((left, right) => left.date.localeCompare(right.date));
  }, [eventsByDate, todayIso]);

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
            style={({ pressed }) => [
              styles.monthButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.monthButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>{formatMonth(calendarMonth)}</Text>
          <Pressable
            onPress={() => setCalendarMonth(new Date(year, month + 1, 1))}
            style={({ pressed }) => [
              styles.monthButton,
              pressed && styles.buttonPressed,
            ]}
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
            const dayEvents = iso ? (eventsByDate[iso] ?? []) : [];
            const plantedCount = dayEvents.filter(
              (event) => event.type === "planted",
            ).length;
            const harvestCount = dayEvents.filter(
              (event) => event.type === "harvest",
            ).length;
            return (
              <Pressable
                key={`${iso ?? "blank"}-${index}`}
                disabled={!iso}
                onPress={() => iso && setDateInput(iso)}
                style={[
                  styles.dayCell,
                  iso === todayIso && styles.dayCellToday,
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
                {(plantedCount > 0 || harvestCount > 0) && (
                  <View style={styles.dayEventRow}>
                    {plantedCount > 0 && (
                      <View
                        style={[
                          styles.dayEventBadge,
                          styles.dayEventBadgePlanted,
                        ]}
                      >
                        <Text style={styles.dayEventBadgeText}>P{plantedCount}</Text>
                      </View>
                    )}
                    {harvestCount > 0 && (
                      <View
                        style={[
                          styles.dayEventBadge,
                          styles.dayEventBadgeHarvest,
                        ]}
                      >
                        <Text style={styles.dayEventBadgeText}>H{harvestCount}</Text>
                      </View>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.calendarLegendRow}>
          <View style={styles.calendarLegendItem}>
            <View style={[styles.legendSwatch, styles.dayEventBadgePlanted]} />
            <Text style={styles.metricText}>P = planted</Text>
          </View>
          <View style={styles.calendarLegendItem}>
            <View style={[styles.legendSwatch, styles.dayEventBadgeHarvest]} />
            <Text style={styles.metricText}>H = harvest</Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>
          Date details for {formatDateDisplay(dateInput)}
        </Text>
        {selectedDateEvents.length === 0 ? (
          <Text style={styles.bodyText}>
            No schedule on this date yet. Tap any date in the calendar to plan.
          </Text>
        ) : (
          selectedDateEvents.map((event, index) => (
            <View
              key={`${event.item.id}-${event.type}-${index}`}
              style={styles.dateDetailRow}
            >
              <View
                style={[
                  styles.dateDetailType,
                  event.type === "planted"
                    ? styles.dayEventBadgePlanted
                    : styles.dayEventBadgeHarvest,
                ]}
              >
                <Text style={styles.dayEventBadgeText}>
                  {event.type === "planted" ? "Planted" : "Harvest"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sensorLabel}>{event.item.plantName}</Text>
                <Text style={styles.bodyText}>{cropLabels[event.item.cropKey]}</Text>
                {event.type === "harvest" && (
                  <View style={styles.reminderRow}>
                    <Pressable
                      onPress={() =>
                        setReminderMessage(
                          `Reminder saved for ${formatDateDisplay(addDays(event.item.harvestDate, -1))}: 1 day before ${event.item.plantName} harvest.`,
                        )
                      }
                      style={({ pressed }) => [
                        styles.reminderButton,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Text style={styles.smallButtonText}>1 day before</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        setReminderMessage(
                          `Reminder saved for ${formatDateDisplay(event.item.harvestDate)}: harvest day for ${event.item.plantName}.`,
                        )
                      }
                      style={({ pressed }) => [
                        styles.reminderButton,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Text style={styles.smallButtonText}>On harvest day</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
        {reminderMessage ? <Text style={styles.metricText}>{reminderMessage}</Text> : null}
      </View>

      <SectionTitle title="Weekly Plan" action="Next 7 days" />
      <View style={styles.weeklyPlanList}>
        {weeklyEvents.length === 0 ? (
          <View style={styles.weeklyPlanItem}>
            <Text style={styles.bodyText}>
              No planned planting or harvest events in the next 7 days.
            </Text>
          </View>
        ) : (
          weeklyEvents.map((entry, index) => (
            <View
              key={`${entry.date}-${entry.type}-${entry.plantName}-${index}`}
              style={styles.weeklyPlanItem}
            >
              <Text style={styles.cardTitle}>{formatDateDisplay(entry.date)}</Text>
              <Text style={styles.bodyText}>
                {entry.type === "harvest" ? "Harvest" : "Plant"} {entry.plantName}
              </Text>
              <Text style={styles.metricText}>{cropLabels[entry.cropKey]}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>
          {editingId ? "Modify Plant Date" : "Add Plant Date"}
        </Text>
        <Text style={styles.bodyText}>
          Tap a date in the calendar first, then add the plant details below.
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
        <View style={styles.calendarQuickRow}>
          <Pressable
            onPress={() => setDateInput(todayIso)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.smallButtonText}>Use today</Text>
          </Pressable>
          <Pressable
            onPress={() => setHarvestInput(suggestedHarvest)}
            style={({ pressed }) => [
              styles.quickActionButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.smallButtonText}>Auto harvest</Text>
          </Pressable>
        </View>
        <View style={styles.suggestionBox}>
          <Text style={styles.metricText}>
            Plant date: {formatDateDisplay(dateInput)}
          </Text>
          <Text style={styles.metricText}>
            Harvest date: {formatDateDisplay(harvestInput)}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={dateInput}
          onChangeText={setDateInput}
          placeholder="Planted date (YYYY-MM-DD, advanced)"
        />
        <TextInput
          style={styles.input}
          value={harvestInput}
          onChangeText={setHarvestInput}
          placeholder="Harvest date (YYYY-MM-DD, advanced)"
        />
        <View style={styles.suggestionBox}>
          <Text style={styles.recommendationText}>
            {cropLabels[cropInput]} usually needs {cropHarvestDays[cropInput]}{" "}
            days. Suggested harvest: {formatDateDisplay(suggestedHarvest)}
          </Text>
          <Text style={styles.metricText}>
            Next planting window: {formatDateDisplay(suggestedNextPlanting)}
          </Text>
        </View>
        <Pressable
          onPress={onSave}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
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
            <Text style={styles.bodyText}>
              Planted {formatDateDisplay(item.plantedDate)}
            </Text>
            <Text style={styles.recommendationText}>
              Harvest {formatDateDisplay(item.harvestDate)} - {" "}
              {daysBetween("2026-05-05", item.harvestDate)} days left
            </Text>
          </View>
          <View style={styles.calendarActions}>
            <Pressable
              onPress={() => onEdit(item)}
              style={({ pressed }) => [
                styles.smallButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.smallButtonText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => onDelete(item.id)}
              style={({ pressed }) => [
                styles.smallButton,
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </>
  );
}

