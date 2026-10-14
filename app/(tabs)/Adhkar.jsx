import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { useGlobalContext } from "../../context/GlobalProvider";
import Goback from "../../components/Goback";
import { useScrollToTop } from "../../context/ScrollToTopProvider";

const AZKAR_URL = "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json";
const ENGLISH_CATEGORY_NAMES = {
  "\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0635\u0628\u0627\u062d": "Morning Azkar",
  "\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0645\u0633\u0627\u0621": "Evening Azkar",
  "\u0623\u0630\u0643\u0627\u0631 \u0628\u0639\u062f \u0627\u0644\u0633\u0644\u0627\u0645 \u0645\u0646 \u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0645\u0641\u0631\u0648\u0636\u0629": "After Prayer",
  "\u062a\u0633\u0627\u0628\u064a\u062d": "Tasbih",
  "\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u0646\u0648\u0645": "Before Sleep",
  "\u0630\u0643\u0627\u0631 \u0627\u0644\u0627\u0633\u062a\u064a\u0642\u0627\u0638": "after waking up",
  "\u0623\u062f\u0639\u064a\u0629 \u0642\u0631\u0622\u0646\u064a\u0629": "Quranic Duas",
  "\u0623\u062f\u0639\u064a\u0629 \u0627\u0644\u0623\u0646\u0628\u064a\u0627\u0621": "Prophets' Duas",
};

const isAzkarEntry = (item) =>
  item && typeof item === "object" && typeof item.content === "string" && item.content !== "stop";

export default function Adhkar() {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { languages } = useGlobalContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadAzkar = async () => {
      try {
        const response = await fetch(AZKAR_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Azkar request failed (${response.status})`);

        const data = await response.json();
        const nextCategories = Object.entries(data)
          .map(([name, entries]) => ({
            name,
            items: (Array.isArray(entries) ? entries.flat(Infinity) : []).filter(isAzkarEntry),
          }))
          .filter((category) => category.items.length > 0);

        if (nextCategories.length === 0) throw new Error("No Azkar categories were returned.");
        setCategories(nextCategories);
        setSelectedCategory((current) =>
          nextCategories.some((category) => category.name === current)
            ? current
            : nextCategories[0].name,
        );
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadAzkar();
    return () => controller.abort();
  }, [retryKey]);

  const currentCategory = categories.find((category) => category.name === selectedCategory);

  const increment = (key, target) => {
    setCounts((current) => ({
      ...current,
      [key]: Math.min((current[key] || 0) + 1, target),
    }));
  };

  const resetCount = (key) => {
    setCounts((current) => ({ ...current, [key]: 0 }));
  };

  const retryLoad = () => {
    setLoading(true);
    setError(false);
    setRetryKey((key) => key + 1);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Goback />
      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.title}>{languages ? "\u0627\u0644\u0623\u0630\u0643\u0627\u0631" : "Azkar"}</Text>
        <View style={styles.backButton} />
      </View>

      {loading && categories.length === 0 ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={Colors.blue} />
          <Text style={styles.stateText}>{languages ? "\u062c\u0627\u0631\u064d \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0623\u0630\u0643\u0627\u0631" : "Loading Azkar..."}</Text>
        </View>
      ) : error && categories.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{languages ? "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0623\u0630\u0643\u0627\u0631" : "Could not load Azkar."}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={retryLoad} style={styles.retryButton}>
            <Text style={styles.retryText}>{languages ? "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629" : "Try again"}</Text>
          </TouchableOpacity>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{languages ? "\u0644\u0627 \u062a\u0648\u062c\u062f \u0623\u0630\u0643\u0627\u0631 \u0644\u0639\u0631\u0636\u0647\u0627" : "No Azkar available."}</Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {categories.map((category) => {
              const selected = category.name === selectedCategory;
              const label = languages ? category.name : ENGLISH_CATEGORY_NAMES[category.name] || category.name;
              return (
                <TouchableOpacity
                  key={category.name}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedCategory(category.name)}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                >
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {currentCategory?.items.map((dhikr, index) => {
              const key = `${currentCategory.name}-${index}`;
              const target = Math.max(1, Number.parseInt(String(dhikr.count), 10) || 1);
              const count = counts[key] || 0;
              return (
                <View key={key} style={styles.card}>
                  <Text style={styles.arabic}>{dhikr.content}</Text>
                  {dhikr.description ? <Text style={styles.description}>{dhikr.description}</Text> : null}
                  {dhikr.reference ? <Text style={styles.reference}>{dhikr.reference}</Text> : null}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={languages ? "\u0632\u062f \u0639\u062f\u0627\u062f \u0627\u0644\u0630\u0643\u0631" : `Count dhikr, ${count} of ${target}`}
                      accessibilityState={{ disabled: count >= target }}
                      disabled={count >= target}
                      onPress={() => increment(key, target)}
                      style={styles.countRow}
                    >
                      <Text style={styles.tapHint}>{languages ? "\u0627\u0636\u063a\u0637 \u0644\u0644\u0639\u062f" : "Tap to count"}</Text>
                      <View style={[styles.countBadge, count >= target && styles.countBadgeComplete]}>
                        <Text style={styles.count}>{count} / {target}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={languages ? "\u0625\u0639\u0627\u062f\u0629 \u0639\u062f\u0627\u062f \u0627\u0644\u0630\u0643\u0631" : "Reset dhikr count"}
                      onPress={() => resetCount(key)}
                      style={styles.resetButton}
                    >
                      <MaterialIcons name="refresh" size={17} color={Colors.textGray} />
                      <Text style={styles.resetText}>{languages ? "\u062a\u0635\u0641\u064a\u0631" : "Reset"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { height: 58, marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  title: { color: Colors.text, fontSize: 21, fontWeight: "700" },
  categoryList: {direction:"ltr", paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  categoryChip: { minHeight: 36, paddingHorizontal: 14, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: "rgba(48, 106, 167, 0.3)", backgroundColor: "#0b1b3b" },
  categoryChipSelected: { borderColor: Colors.blue, backgroundColor: "rgba(3, 218, 197, 0.14)" },
  categoryText: { color: "#a9c1e5", fontSize: 12 },
  categoryTextSelected: { color: Colors.blue, fontWeight: "700" },
  list: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 36, gap: 12 },
  card: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: "rgba(48, 106, 167, 0.3)", backgroundColor: "#0b1b3b" },
  arabic: { color: Colors.text, fontSize: 23, lineHeight: 42, textAlign: "right" },
  description: { color: "#a9c1e5", fontSize: 13, lineHeight: 21, marginTop: 10, textAlign: "right" },
  reference: { color: Colors.textGray, fontSize: 11, marginTop: 8, textAlign: "right" },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 15, gap: 10 },
  countRow: { flex: 1, minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tapHint: { color: Colors.blue, fontSize: 12, fontWeight: "600" },
  countBadge: { minWidth: 66, height: 36, paddingHorizontal: 12, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(3, 218, 197, 0.14)" },
  countBadgeComplete: { backgroundColor: "rgba(3, 218, 197, 0.28)" },
  count: { color: Colors.blue, fontSize: 13, fontWeight: "700" },
  resetButton: { height: 36, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 18, backgroundColor: "rgba(145, 169, 206, 0.1)" },
  resetText: { color: Colors.textGray, fontSize: 11, fontWeight: "600" },
  stateContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 24 },
  stateText: { color: "#a9c1e5", fontSize: 14, textAlign: "center" },
  retryButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 18, backgroundColor: "rgba(3, 218, 197, 0.14)" },
  retryText: { color: Colors.blue, fontSize: 13, fontWeight: "700" },
});
