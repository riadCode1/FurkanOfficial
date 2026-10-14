<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { fetchChapterID } from "../app/API/QuranApi";
import { useScrollToTop } from "../context/ScrollToTopProvider";

const Details = ({ id, languages }) => {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    fetchChapterID(id)
      .then((data) => {
        if (!active) return;
        if (!data?.chapter) throw new Error("Chapter details are unavailable.");
        setChapter(data.chapter);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const isArabic = Boolean(languages);
  const revelationPlace = chapter?.revelation_place;
  const isMeccan = revelationPlace?.toLowerCase().includes("mecc") || revelationPlace === "makkah";
  const pageRange = chapter?.pages?.length === 2
    ? `${chapter.pages[0]}–${chapter.pages[1]}`
    : null;
  const openChapterInfo = () => {
    Linking.openURL(`https://quran.com/${id}/info`).catch(() => {});
  };

  const rows = [
    {
      icon: "format-list-numbered",
      label: isArabic ? "رقم السورة" : "Surah number",
      value: chapter?.id || id,
    },
    {
      icon: "menu-book",
      label: isArabic ? "عدد الآيات" : "Verses",
      value: chapter?.verses_count,
    },
    {
      icon: "auto-stories",
      label: isArabic ? "صفحات المصحف" : "Mushaf pages",
      value: pageRange,
    },
    {
      icon: "history-edu",
      label: isArabic ? "ترتيب النزول" : "Revelation order",
      value: chapter?.revelation_order,
    },
    {
      icon: "place",
      label: isArabic ? "مكان النزول" : "Revealed in",
      value: revelationPlace
        ? isArabic
          ? isMeccan ? "مكة" : "المدينة"
          : isMeccan ? "Mecca" : "Medina"
        : null,
    },
    {
      icon: "translate",
      label: isArabic ? "معنى الاسم" : "Name meaning",
      value: chapter?.translated_name?.name,
    },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialIcons name="info-outline" size={20} color={Colors.blue} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>{isArabic ? "دليل السورة" : "CHAPTER GUIDE"}</Text>
          <Text style={styles.title}>{isArabic ? "معلومات السورة" : "About this surah"}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={Colors.blue} />
          <Text style={styles.stateText}>{isArabic ? "جارٍ تحميل المعلومات" : "Loading chapter details…"}</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{isArabic ? "تعذر تحميل معلومات السورة." : "Chapter details could not be loaded."}</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.nameCard}>
            <View style={styles.nameCardTop}>
              <Text style={styles.nameLabel}>{isArabic ? "السورة" : "SURAH"}</Text>
              <Text style={styles.numberPill}>#{chapter?.id || id}</Text>
            </View>
            <Text style={styles.arabicName}>{chapter?.name_arabic}</Text>
            <Text style={styles.simpleName}>{chapter?.name_simple || chapter?.name_complex}</Text>
            {chapter?.translated_name?.name ? (
              <Text style={styles.translatedName}>{chapter.translated_name.name}</Text>
            ) : null}
          </View>

          <View style={styles.statsGrid}>
            {rows.map((item) => (
              <View key={item.label} style={styles.infoRow}>
                <View style={styles.rowIcon}>
                  <MaterialIcons name={item.icon} size={18} color={Colors.blue} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="link"
            onPress={openChapterInfo}
            style={({ pressed }) => [styles.linkCard, pressed && styles.linkPressed]}
          >
            <View style={styles.linkIcon}>
              <MaterialIcons name="open-in-new" size={19} color={Colors.blue} />
            </View>
            <View style={styles.linkCopy}>
              <Text style={styles.linkTitle}>{isArabic ? "اقرأ المزيد" : "Explore this surah"}</Text>
              <Text style={styles.linkSubtitle}>{isArabic ? "معلومات إضافية على Quran.com" : "More context and reflection on Quran.com"}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textGray} />
          </Pressable>
        </ScrollView>
      )}
=======
import { View, Text, ScrollView, useWindowDimensions, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/Colors";
import { fetchChapterID } from "../app/API/QuranApi";

const Details = ({ id, languages }) => {
  const [text, setText] = useState(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    getChapter(id);
  }, [id]);

  const getChapter = async (chapterId) => {
    try {
      const data = await fetchChapterID(chapterId);
      setText(data.chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
    }
    console.log("Chapter data:", text);
  };

  const containerPadding = width > 700 ? 32 : 16;

  return (
    <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
      <Text style={styles.title}>
        {languages ? "معلومات عن السورة" : "Chapter info"}
      </Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: height * 0.2 }]}
      >
        <View style={{ gap: 5 }}>
          {languages ? (
            <>
              <Text style={[styles.title, { fontSize: 16 }]}>
                الاسم: <Text style={styles.text}>{text?.name_arabic}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                عدد الآيات: <Text style={styles.text}>{text?.verses_count}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                عدد الصفحات:{" "}
                <Text style={styles.text}>
                  {text?.pages?.[0]} - {text?.pages?.[1]}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                الترتيب الزمني للسورة:{" "}
                <Text style={styles.text}>{text?.revelation_order}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                مكان الوحي:{" "}
                <Text style={styles.text}>
                  {text?.revelation_place === "makkah"
                    ? "مكة المكرمة"
                    : "المدينة المنورة"}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                قم بزيارة هذا الرابط لمزيد من التفاصيل عن السورة{" "}
                <Text
                  style={{
                    color: Colors.blue,
                    textDecorationLine: "underline",
                    textDecorationStyle: "dotted",
                  }}
                  onPress={() =>
                    Linking.openURL(`https://quran.com/surah/${id}/info`)
                  }
                >
                  quran.com
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Name: <Text style={styles.text}>{text?.name_simple}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Number of Ayahs: <Text style={styles.text}>{text?.verses_count}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Number of pages:{" "}
                <Text style={styles.text}>
                  {text?.pages?.[0]} - {text?.pages?.[1]}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                The chronological order of surah:{" "}
                <Text style={styles.text}>{text?.revelation_order}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Revelation place:{" "}
                <Text style={styles.text}>
                  {text?.revelation_place === "Meccan" ? "Mecca" : "Medina"}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Visit this link for more details about the Surah{" "}
                <Text
                  style={{
                    color: Colors.blue,
                    textDecorationLine: "underline",
                    textDecorationStyle: "dotted",
                  }}
                  onPress={() =>
                    Linking.openURL(`https://quran.com/surah/${id}/info`)
                  }
                >
                  Quran.com
                </Text>
              </Text>
            </>
          )}
        </View>
      </ScrollView>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: { zIndex: 99, paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(3,218,197,0.12)",
  },
  headerText: { gap: 3 },
  eyebrow: { color: Colors.blue, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: Colors.text, fontSize: 20, fontWeight: "800" },
  scrollView: { maxHeight: 520,paddingBottom: 800 },
  scrollContent: { gap: 12, paddingBottom: 88 },
  nameCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(3,218,197,0.22)",
    backgroundColor: "#102237",
    alignItems: "center",
  },
  nameCardTop: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameLabel: { color: Colors.textGray, fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  numberPill: {
    overflow: "hidden",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: Colors.blue,
    backgroundColor: "rgba(3,218,197,0.12)",
    fontSize: 12,
    fontWeight: "800",
  },
  arabicName: { color: "#FFF9E8", fontSize: 32, lineHeight: 48, fontWeight: "700", marginTop: 8 },
  simpleName: { color: Colors.text, fontSize: 19, fontWeight: "800", marginTop: 2 },
  translatedName: { color: Colors.textGray, fontSize: 13, marginTop: 5 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoRow: {
    width: "48%",
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.035)",
  },
  rowIcon: { width: 32, height: 32, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(3,218,197,0.1)" },
  rowCopy: { flex: 1, minWidth: 0, gap: 4 },
  rowLabel: { color: Colors.textGray, fontSize: 10, fontWeight: "600" },
  rowValue: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  linkCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  linkPressed: { opacity: 0.75 },
  linkIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(3,218,197,0.1)" },
  linkCopy: { flex: 1, gap: 4 },
  linkTitle: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  linkSubtitle: { color: Colors.textGray, fontSize: 11 },
  stateContainer: { minHeight: 120, alignItems: "center", justifyContent: "center", gap: 10 },
  stateText: { color: Colors.textGray, fontSize: 13, textAlign: "center" },
});
=======
const styles = {
  container: {
    zIndex: 99,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    paddingBottom: 50,
    marginTop: 20,
  },
  scrollContent: {},
  text: {
    color: "#D1D1D1",
    fontSize: 14,
    fontWeight: "500",
  },
};
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

export default Details;
