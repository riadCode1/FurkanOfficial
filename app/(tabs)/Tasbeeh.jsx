import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Vibration, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useGlobalContext } from "../../context/GlobalProvider";
import Goback from "../../components/Goback";
import { useScrollToTop } from "../../context/ScrollToTopProvider";

const TARGETS = [33, 99, 100];
const VIBRATION_STORAGE_KEY = "tasbeehVibrationEnabled";
const RING_STROKE = 4;
const DHIKRS = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", name: "Subhanallah", meaning: "Glory be to Allah" },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", name: "Alhamdulillah", meaning: "Praise be to Allah" },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", name: "Allahu Akbar", meaning: "Allah is the Greatest" },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", name: "Astaghfirullah", meaning: "I seek forgiveness from Allah" },
  { id: "tahlil", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", name: "La ilaha illa Allah", meaning: "There is no deity but Allah" },
];

const ARABIC_DHIKR_INFO = {
  subhanallah: { name: "التسبيح", meaning: "تنزيه الله عن كل نقص" },
  alhamdulillah: { name: "التحميد", meaning: "الثناء على الله وشكره" },
  allahuakbar: { name: "التكبير", meaning: "الله أعظم من كل شيء" },
  astaghfirullah: { name: "الاستغفار", meaning: "طلب المغفرة من الله" },
  tahlil: { name: "التهليل", meaning: "إفراد الله بالعبادة" },
};

export default function Tasbeeh() {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { languages, track } = useGlobalContext();
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [target, setTarget] = useState(33);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKRS[0]);
  const ringSize = Math.min(width - 112, 250);
  const ringRadius = (ringSize - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const progress = target ? count / target : 0;

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(VIBRATION_STORAGE_KEY)
      .then((storedValue) => {
        if (isMounted && storedValue !== null) setVibrationEnabled(storedValue === "true");
      })
      .catch((error) => console.warn("Failed to load Tasbeeh vibration preference:", error));

    return () => { isMounted = false; };
  }, []);

  const toggleVibration = () => {
    const nextValue = !vibrationEnabled;
    setVibrationEnabled(nextValue);
    AsyncStorage.setItem(VIBRATION_STORAGE_KEY, String(nextValue)).catch((error) =>
      console.warn("Failed to save Tasbeeh vibration preference:", error),
    );
  };

  const increment = () => {
    if (vibrationEnabled) {
      Vibration.vibrate(10);
    }
    if (count + 1 >= target) {
      setCount(0);
      setRounds((value) => value + 1);
      return;
    }
    setCount((value) => value + 1);
  };

  const reset = () => {
    setCount(0);
    setRounds(0);
  };

  const selectTarget = (value) => {
    setTarget(value);
    setCount(0);
    setRounds(0);
  };

  const selectDhikr = (dhikr) => {
    setSelectedDhikr(dhikr);
    setCount(0);
    setRounds(0);
  };

  return (
    <LinearGradient colors={["#12C7A0", "#00AFAE", "#149AB5"]} locations={[0, 0.52, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Goback />
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View style={styles.headerSpacer} />
            <View style={styles.heading}>
              <Text style={styles.headingEyebrow}>{languages ? "وِردُكَ اليومي" : "YOUR DAILY DHIKR"}</Text>
              <Text style={styles.headingTitle}>{languages ? "عداد التسبيح" : "Count your Tasbeeh"}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.counterCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.liveMark} />
              <Pressable
                accessibilityRole="switch"
                accessibilityLabel={languages ? "Vibration" : "Counter vibration"}
                accessibilityState={{ checked: vibrationEnabled }}
                onPress={toggleVibration}
                style={[styles.vibrationButton, vibrationEnabled && styles.vibrationButtonEnabled]}
              >
                <MaterialIcons name="vibration" size={18} color={vibrationEnabled ? Colors.blue : "#A6C4C6"} />
              </Pressable>
              <Text style={styles.cardCaption}>{languages ? "التسبيح" : "TASBEEH COUNTER"}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={languages ? "إعادة التعيين" : "Reset counter"} onPress={reset} style={styles.resetButton}>
                <MaterialIcons name="restart-alt" size={19} color="#A6C4C6" />
              </Pressable>
            </View>

            <Text style={styles.dhikrText}>{selectedDhikr.arabic}</Text>
            <Text style={styles.dhikrTranslation}>
              {languages ? ARABIC_DHIKR_INFO[selectedDhikr.id].meaning : selectedDhikr.meaning}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={languages ? "زيادة العداد" : "Increment Tasbeeh counter"}
              accessibilityHint={languages ? `العدد ${count} من ${target}` : `Count ${count} of ${target}`}
              onPress={increment}
              style={styles.counterButton}
            >
              <Svg pointerEvents="none" width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} style={StyleSheet.absoluteFill}>
                <Circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringRadius}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={RING_STROKE}
                  fill="none"
                />
                <Circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringRadius}
                  stroke="#F8A51B"
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={circumference * (1 - progress)}
                  fill="none"
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                />
              </Svg>
              <Text style={styles.countNumber}>{count}</Text>
              <Text style={styles.tapHint}>{languages ? "اضغط للعد" : "TAP TO COUNT"}</Text>
            </Pressable>

            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>{languages ? "الجولات" : "ROUNDS"}</Text>
                <Text style={styles.statValue}>{rounds}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statRight}>
                <Text style={styles.statLabel}>{languages ? "الهدف" : "PROGRESS"}</Text>
                <Text style={styles.statValue}>{count} / {target}</Text>
              </View>
            </View>
          </View>

          <View style={styles.targetSection}>
            <Text style={styles.targetTitle}>{languages ? "اختر الذكر" : "Choose a dhikr"}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dhikrOptions}>
              {DHIKRS.map((dhikr) => {
                const selected = selectedDhikr.id === dhikr.id;
                return (
                  <Pressable
                    key={dhikr.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectDhikr(dhikr)}
                    style={[styles.dhikrOption, selected && styles.dhikrOptionSelected]}
                  >
                    <Text style={[styles.dhikrOptionText, selected && styles.dhikrOptionTextSelected]}>
                      {languages ? ARABIC_DHIKR_INFO[dhikr.id].name : dhikr.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={styles.targetTitle}>{languages ? "اختر هدفك" : "Choose a target"}</Text>
            <View style={styles.targetRow}>
              {TARGETS.map((value) => {
                const selected = target === value;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectTarget(value)}
                    style={[styles.targetOption, selected && styles.targetOptionSelected]}
                  >
                    <Text style={[styles.targetValue, selected && styles.targetValueSelected]}>{value}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={languages ? "زيادة العداد" : "Increment Tasbeeh counter"}
        accessibilityHint={languages ? `العدد ${count} من ${target}` : `Count ${count} of ${target}`}
        onPress={increment}
        style={({ pressed }) => [
          styles.countAction,
          { bottom: insets.bottom + (track ? 154 : 84) },
          pressed && styles.countActionPressed,
        ]}
      >
        <MaterialIcons name="add" size={30} color={Colors.background} />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center", paddingHorizontal: 20, paddingTop: 22, paddingBottom: 220 },
  topBar: { width: "100%", minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  backButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: "rgba(5, 74, 81, 0.3)" },
  headerSpacer: { width: 42, height: 42 },
  heading: { flex: 1, alignItems: "center", marginBottom: 0 },
  headingEyebrow: { color: "rgba(255,255,255,0.78)", fontSize: 10, fontWeight: "800", letterSpacing: 2.4 },
  headingTitle: { color: "#FFFFFF", fontSize: 25, lineHeight: 34, fontWeight: "800", marginTop: 2 },
  counterCard: {
    width: "100%",
    maxWidth: 390,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.17)",
    backgroundColor: "#07353B",
    shadowColor: "#003E41",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 9,
  },
  cardTopRow: { width: "100%", height: 30, flexDirection: "row", alignItems: "center" },
  liveMark: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.blue },
  cardCaption: { flex: 1, marginStart: 8, color: "#A6C4C6", fontSize: 9, fontWeight: "800", letterSpacing: 1.6 },
  vibrationButton: { width: 34, height: 34, marginEnd: 6, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.07)" },
  vibrationButtonEnabled: { backgroundColor: "rgba(3,218,197,0.13)" },
  resetButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.07)" },
  dhikrText: { color: "#F6F8ED", fontSize: 22, lineHeight: 34, fontWeight: "600", marginTop: 8 },
  dhikrTranslation: { color: "#8CAEB0", fontSize: 11, marginTop: 1 },
  counterButton: { width: 250, height: 250, maxWidth: "100%", marginTop: 8, alignItems: "center", justifyContent: "center", borderRadius: 140 },
  countAction: {
    position: "absolute",
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.62)",
    backgroundColor: "#F8A51B",
    elevation: 10,
    shadowColor: "#003E41",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 9,
  },
  countActionPressed: { transform: [{ scale: 0.94 }] },
  countNumber: { color: "#F8A51B", fontSize: 66, lineHeight: 78, fontWeight: "300", fontVariant: ["tabular-nums"] },
  tapHint: { color: "#9FC0C1", fontSize: 9, fontWeight: "800", letterSpacing: 1.8, marginTop: 1 },
  statsRow: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 6, marginTop: 7 },
  statDivider: { width: 1, height: 31, backgroundColor: "rgba(255,255,255,0.14)" },
  statRight: { alignItems: "flex-end" },
  statLabel: { color: "#86A9AA", fontSize: 9, fontWeight: "800", letterSpacing: 1.4 },
  statValue: { color: "#F2F8F4", fontSize: 14, fontWeight: "700", marginTop: 3 },
  targetSection: { width: "100%", maxWidth: 390, marginTop: 17 },
  dhikrOptions: { gap: 8, paddingRight: 2 },
  dhikrOption: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.13)",
  },
  dhikrOptionSelected: { borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" },
  dhikrOptionText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  dhikrOptionTextSelected: { color: "#087A75" },
  targetTitle: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "700", marginBottom: 9, marginStart: 3 },
  targetRow: { flexDirection: "row", gap: 9 },
  targetOption: { flex: 1, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.13)" },
  targetOptionSelected: { borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" },
  targetValue: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  targetValueSelected: { color: "#087A75" },
});
