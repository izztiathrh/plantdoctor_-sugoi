import { Image, Pressable, Text, View } from "react-native";
import { PageIntro, SectionTitle, createScanReport, demoScans, getPreventionTips, getRescanAdvice, getScanStatus, getTreatmentSteps, styles, type Diagnosis, type ScanHistoryItem } from "../shared";

export function DoctorPage({
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

      <SectionTitle
        title="Scan History"
        action={`${scanHistory.length} saved`}
      />
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

