import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  Alert,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Updates from "expo-updates";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";

import ReaderCard from "../../../components/ReaderCard";
import ReadingSurah from "../../../components/ReadingSurah";
import CustomAdan from "../../../components/CustomAdan";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuth } from "../../../hooks/useAuth";
import { useQuranApi } from "../../../services/quranApi";
import { Colors } from "../../../constants/Colors";

// ─── reusable section header ──────────────────────────────────────────────────
const SectionHeader = ({ title, onSeeAll }) => (
  <View style={S.sectionHeader}>
    <Text style={S.sectionTitle}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} style={S.seeAllBtn}>
        {I18nManager.isRTL ? (
          <>
            <MaterialIcons size={20} name="chevron-left" color={Colors.blue} />
            <Text style={S.seeAllTxt}>{I18nManager.isRTL ? "عرض الكل" : "See all"}</Text>
          </>
        ) : (
          <>
            <Text style={S.seeAllTxt}>{I18nManager.isRTL ? "عرض الكل" : "See all"}</Text>
            <MaterialIcons size={20} name="chevron-right" color={Colors.blue} />
          </>
        )}
      </TouchableOpacity>
    )}
  </View>
);


// ─── main screen ──────────────────────────────────────────────────────────────
const Index = () => {
  const { width } = useWindowDimensions();
  const { setLanguages, languages, loading } = useGlobalContext();
  const { session, profile } = useAuth();
  const api = useQuranApi();

  const [quranData, setQuranData]   = useState([]);
  const [chapter, setChapter]       = useState([]);
  const [bookmarks, setBookmarks]   = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [adding, setAdding]         = useState(false);

  const isLargeScreen = width >= 700;
  const ITEM_HEIGHT   = isLargeScreen ? 250 : 150;

  const groupedChapters = [
    chapter.slice(2, 4),
    chapter.slice(7, 9),
    chapter.slice(13, 15),
    chapter.slice(18, 20),
  ];

  // ── language direction ───────────────────────────────────────────────────
  const toggleDirection = useCallback(async (isArabic) => {
    if (I18nManager.isRTL !== isArabic) {
      I18nManager.allowRTL(isArabic);
      I18nManager.forceRTL(isArabic);
      Alert.alert(
        isArabic ? "إعادة التشغيل" : "Restart",
        isArabic ? "سيتم إعادة تشغيل التطبيق لتطبيق اللغة." : "App will restart to apply the language.",
        [{ text: "OK", onPress: async () => { await Updates.reloadAsync(); } }]
      );
    }
  }, []);

  // ── data fetching ────────────────────────────────────────────────────────
  const getReciter = useCallback(async () => {
    try {
      const data = await fetchSuwar();
      if (data?.recitations) {
        setQuranData([...data.recitations, ...NewData.recitations]);
      }
    } catch (error) {
      console.error("Error fetching recitations:", error);
    }
  }, []);

  const getChapter = useCallback(async () => {
    try {
      const data = await fetchChater();
      if (data?.chapters) setChapter(data.chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  }, []);

  const fetchBookmarks = useCallback(async () => {
    if (!session) return; // don't fetch if not logged in
    setBookmarksLoading(true);
    try {
      const data = await api.getBookmarks();
      console.log("Fetched bookmarks:", data); // DEBUG: log raw API response
      setBookmarks(data?.data ?? []);
    } catch (err) {
      console.error("Get bookmarks failed:", err);
    } finally {
      setBookmarksLoading(false); // FIX: was setLoading (undefined) → crashes
    }
  }, [session]);

  const removeBookmark = useCallback(async (id) => {
    try {
      await api.deleteBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete bookmark failed:", err);
    }
  }, []);

  useEffect(() => {
    toggleDirection(languages);
    getReciter();
    getChapter();
  }, [languages]);

  useEffect(() => {
    fetchBookmarks();
  }, [session]);
  console.log("Session changed:", bookmarks); // re-fetch when session changes (login/logout)

  // ── welcome text ─────────────────────────────────────────────────────────
  const greeting = profile?.username
    ? (languages ? `أهلاً، ${profile.username}` : `Welcome, ${profile.username}`)
    : (languages ? "أهلاً بك" : "Welcome");

  return (
    <SafeAreaView style={S.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      <ScrollView
        nestedScrollEnabled
        decelerationRate="fast"
        contentContainerStyle={S.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* logo */}
        <View style={S.logoWrap}>
          <Image contentFit="cover" style={S.logo} source={require("../../../assets/images/indexLogo.png")} />
        </View>

        {/* greeting */}
        <Text style={S.greeting}>{greeting}</Text>

        {/* adan widget */}
        <CustomAdan />

              
       
        {/* popular reciters */}
        <View style={S.section}>
          <SectionHeader
            title={languages ? "أشهر القراء" : "Most Popular Reciters"}
            onSeeAll={() => router.push({ pathname: "/Searchs", params: { section: "reciters" } })}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.hScroll}>
            {quranData?.slice(6, 12).map((item) => (
              <ReaderCard
                key={item.id ?? item.index}
                item={item}
                loading={loading}
                languages={languages}
                setLanguages={setLanguages}
                name={item.reciter_name}
                arab_name={item.translated_name?.name}
                id={item.id}
              />
            ))}
          </ScrollView>
        </View>

        {/* quran chapters */}
        <View style={S.section}>
          <SectionHeader
            title={languages ? "سور القرآن الكريم" : "Quran Chapters"}
            onSeeAll={() => router.push({ pathname: "/Searchs", params: { section: "chapters" } })}
          />
          <Carousel
            width={width}
            height={ITEM_HEIGHT}
            data={groupedChapters}
            mode="parallax"
            loop
            autoPlay={false}
            pagingEnabled
            snapEnabled
            modeConfig={{
              parallaxScrollingScale: isLargeScreen ? 0.98 : 0.95,
              parallaxScrollingOffset: 50,
            }}
            renderItem={({ item: group }) => (
              <View style={{ marginLeft: 10 }}>
                {group.map((item) => (
                  <ReadingSurah
                    key={item.id}
                    item={item}
                    languages={languages}
                    loading={loading}
                    name={item.name_simple}
                    arab_name={item.translated_name?.name}
                    chapter_arab={item.name_arabic}
                    Chapterid={item.id}
                    verses={item.verses_count}
                  />
                ))}
              </View>
            )}
          />
        </View>

        {/* listen to quran */}
        <View style={S.section}>
          <SectionHeader title={languages ? "استمع للقرآن الكريم" : "Listen to Quran"} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.hScroll}>
            {quranData?.slice(15, 21).map((item) => (
              <ReaderCard
                key={item.id ?? item.index}
                item={item}
                loading={loading}
                languages={languages}
                setLanguages={setLanguages}
                name={item.reciter_name}
                arab_name={item.translated_name?.name}
                id={item.id}
              />
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

// ─── styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  scroll:         { paddingBottom: 200 },

  // logo
  logoWrap:       { marginHorizontal: 16, width: 160, height: 60, marginTop: 20, alignSelf: "flex-start" },
  logo:           { width: "100%", height: "100%" },

  // greeting
  greeting:       { color: "white", fontSize: 16, fontWeight: "bold", marginHorizontal: 16, marginTop: 8, textAlign: I18nManager.isRTL ? "right" : "left" },

  // section
  section:        { marginTop: 32 },
  sectionHeader:  { paddingHorizontal: 16, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle:   { color: "white", fontSize: 16, fontWeight: "bold", fontFamily: "lucida grande" },
  seeAllBtn:      { flexDirection: "row", alignItems: "center", height: 24 },
  seeAllTxt:      { fontSize: 14, color: Colors.blue, fontWeight: "500" },
  hScroll:        { gap: 10, paddingHorizontal: 16 },

  // bookmarks
  bookmarkRow:    { gap: 8, paddingHorizontal: 16 },
  bookmarkPill:   { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(91,141,238,0.12)", borderWidth: 1, borderColor: "rgba(91,141,238,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  bookmarkKey:    { color: "white", fontSize: 13, fontWeight: "600" },
  emptyBookmarks: { color: "rgba(255,255,255,0.3)", fontSize: 13, paddingHorizontal: 16 },
});