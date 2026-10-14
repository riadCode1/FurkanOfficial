import React, { useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useProgress } from "react-native-track-player";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/images";
import { dataArray } from "../../../constants/RecitersImages";
import { NewData } from "../../../constants/NewData";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import PrayerTimes from "../../../components/CustomAdan.jsx";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";
import { isTrackSelected } from "../../../constants/trackSelection";

const FILTERS = ["All", "Meccan", "Medinan", "Short", "Long"];
const FEATURED_RECITERS = [
  { id: 7, name: "Mishary Rashid Alafasy", style: "Popular Reciter" },
  { id: 2, name: "Abdul Basit 'Abd us-Samad", style: "Legendary Reciter" },
  { id: 13, name: "Saad Al-Ghamdi", style: "Peaceful Sound" },
  { id: 65, name: "Maher Al-Muaiqly", style: "Makkah Reciter" },
];

const Index = () => {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 700;
  const [reciters, setReciters] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [savedPosition, setSavedPosition] = useState(0);
  const playbackProgress = useProgress(5000);
  const {
    languages,
    reciter,
    reciterAR,
    chapterId,
    arabicCH,
    isPlaying,
    track,
    togglePlayback,
    playNext,
    playPrevious,
    currentTrack,
    IDchapter,
    idReader,
  } = useGlobalContext();

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem("currentTrackPosition")
      .then((value) => {
        if (isMounted && value) setSavedPosition(Number(value) || 0);
      })
      .catch((error) => console.error("Failed to load playback position:", error));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!track || playbackProgress.position <= 0) return;

    setSavedPosition(playbackProgress.position);
    AsyncStorage.setItem("currentTrackPosition", String(playbackProgress.position))
      .catch((error) => console.error("Failed to save playback position:", error));
  }, [track, playbackProgress.position]);

  useEffect(() => {
    updateTextDirection(languages);
    loadHomeData();
  }, [languages]);

  useEffect(() => {
    const greetingTimer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60_000);
    return () => clearInterval(greetingTimer);
  }, []);

  const greeting = currentHour < 12
    ? { en: "Good morning,", ar: "\u0635\u0628\u0627\u062d \u0627\u0644\u062e\u064a\u0631" }
    : currentHour < 17
      ? { en: "Good afternoon,", ar: "\u0646\u0647\u0627\u0631\u0643 \u0633\u0639\u064a\u062f" }
      : { en: "Good evening,", ar: "\u0645\u0633\u0627\u0621 \u0627\u0644\u062e\u064a\u0631" };

  const updateTextDirection = (isArabic) => {
    if (I18nManager.isRTL === isArabic) return;

    I18nManager.allowRTL(isArabic);
    I18nManager.forceRTL(isArabic);
  };

  const loadHomeData = async () => {
    try {
      const [reciterData, chapterData] = await Promise.all([
        fetchSuwar(),
        fetchChater(),
      ]);

      if (reciterData?.recitations) {
        setReciters([...reciterData.recitations, ...NewData.recitations]);
      }
      if (chapterData?.chapters) setChapters(chapterData.chapters);
    } catch (error) {
      console.error("Failed to load Home data:", error);
    }
  };

  const filteredChapters = useMemo(() => {
    switch (activeFilter) {
      case "Meccan":
        return chapters.filter((item) => item.revelation_place === "makkah");
      case "Medinan":
        return chapters.filter((item) => item.revelation_place === "madinah");
      case "Short":
        return chapters.filter((item) => item.verses_count <= 50);
      case "Long":
        return chapters.filter((item) => item.verses_count > 100);
      default:
        return chapters;
    }
  }, [activeFilter, chapters]);

  const recommendedReciters = useMemo(() => {
    return FEATURED_RECITERS.map((featured) => {
      const data = reciters.find((item) => item.id === featured.id);
      return { ...featured, data };
    });
  }, [reciters]);

  const selectedChapter = filteredChapters[0];
  const activeChapterNumber = Number(currentTrack || IDchapter);
  const playingChapter = chapters.find(
    (chapter) => chapter.id === activeChapterNumber
  );
  const currentChapterNumber =
    playingChapter?.id || activeChapterNumber || selectedChapter?.id || 1;
  const currentChapterName = languages
    ? playingChapter?.name_arabic || arabicCH || selectedChapter?.name_arabic || "سورة الفاتحة"
    : playingChapter?.name_simple || chapterId || selectedChapter?.name_simple || "Al-Fatiha";
  const currentReciterName = languages
    ? reciterAR || "مشاري راشد العفاسي"
    : reciter || "Mishary Rashid Alafasy";
  const continueChapter = playingChapter || chapters.find(
    (chapter) => chapter.id === currentChapterNumber
  );
  const displayedPosition = playbackProgress.position > 0
    ? playbackProgress.position
    : savedPosition;
  const progressPercent = playbackProgress.duration > 0
    ? Math.min(100, (displayedPosition / playbackProgress.duration) * 100)
    : 0;

  const handleContinueListening = () => {
    if (track) {
      void togglePlayback();
      return;
    }
    if (continueChapter) openChapter(continueChapter);
  };

  const openSearch = (section) => {
    router.push({ pathname: "/Searchs", params: section ? { section } : {} });
  };

  const openChapter = (chapter) => {
    if (!chapter) return;
    router.push({
      pathname: "/Readers",
      params: {
        chapter_arab: chapter.name_arabic,
        arab_name: chapter.translated_name?.name,
        name: chapter.name_simple,
        Chapterid: String(chapter.id),
      },
    });
  };

  const openReciter = (item) => {
    if (!item.data) {
      openSearch("reciters");
      return;
    }

    router.push({
      pathname: "/ReaderSurah/",
      params: {
        arab_name: item.data.translated_name?.name || item.name,
        name: item.data.reciter_name || item.name,
        id: String(item.id),
      },
    });
  };

  const handleFeaturedPlayback = () => {
    if (track) {
      togglePlayback();
      return;
    }
    if (selectedChapter) openChapter(selectedChapter);
    else openSearch("chapters");
  };

  const handleAdjacentChapter = (direction) => {
    if (track) {
      if (direction > 0) void playNext();
      else void playPrevious();
      return;
    }

    const currentIndex = filteredChapters.findIndex(
      (chapter) => chapter.id === Number(currentTrack)
    );
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    openChapter(filteredChapters[baseIndex + direction]);
  };

  const styles = createStyles(isLargeScreen);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Image
            contentFit="contain"
            source={images.homeLogo}
            style={styles.logo}
          />
          <View style={styles.headerActions}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => Alert.alert("Notifications", "You’re all caught up.")}
              style={styles.headerIconButton}
            >
              <MaterialIcons name="notifications-none" size={22} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={languages ? "فتح الإعدادات" : "Open settings"}
              onPress={() => router.push("/(tabs)/(Settings)/Setting")}
              style={styles.headerIconButton}
            >
              <MaterialIcons name="tune" size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>{languages ? greeting.ar : greeting.en}</Text>
          <View style={styles.greetingNameRow}>
            <Text style={styles.greetingName}>{languages ? "أخي المسلم" : "Muslim Friend"}</Text>
            <MaterialIcons name="waving-hand" size={22} color={Colors.blue} />
          </View>
          <Text style={styles.greetingSubtitle}>{languages ? "نسأل الله أن يملأ يومك بالبركة." : "May your day be filled with barakah."}</Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={languages ? "ابحث عن السور أو القراء" : "Search surahs, reciters, or chapters"}
          onPress={() => openSearch()}
          style={styles.searchButton}
        >
          <MaterialIcons name="search" size={25} color="#91aed8" />
          <Text style={styles.searchText}>{languages ? "ابحث عن سورة أو قارئ..." : "Search surahs, reciters, or chapters..."}</Text>
        </TouchableOpacity>

        <View style={styles.prayerSection}>
          <SectionHeading title={languages ? "\u0645\u0648\u0627\u0642\u064a\u062a \u0627\u0644\u0635\u0644\u0627\u0629" : "Prayer times"} styles={styles} />
          <PrayerTimes />
        </View>

        <View style={styles.dailySection}>
          <SectionHeading title={languages ? "\u0627\u0644\u0639\u0628\u0627\u062f\u0627\u062a \u0627\u0644\u064a\u0648\u0645\u064a\u0629" : "Daily worship"} styles={styles} />
          <View style={styles.shortcutRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={languages ? "فتح عداد التسبيح" : "Open Tasbeeh counter"}
              onPress={() => router.push("/(tabs)/Tasbeeh")}
              style={styles.shortcutCard}
            >
              <View style={styles.shortcutIcon}>
                <MaterialCommunityIcons name="counter" size={23} color={Colors.blue} />
              </View>
              <Text style={styles.shortcutTitle}>{languages ? "\u0627\u0644\u062a\u0633\u0628\u064a\u062d" : "Tasbeeh"}</Text>
              <Text style={styles.shortcutSubtitle}>{languages ? "\u0639\u062f\u0627\u062f \u0627\u0644\u062a\u0633\u0628\u064a\u062d" : "Dhikr counter"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={languages ? "فتح الأذكار" : "Open Adhkar"}
              onPress={() => router.push("/(tabs)/Adhkar")}
              style={styles.shortcutCard}
            >
              <View style={styles.shortcutIcon}>
                <MaterialCommunityIcons name="hands-pray" size={23} color={Colors.blue} />
              </View>
              <Text style={styles.shortcutTitle}>{languages ? "\u0627\u0644\u0623\u0630\u0643\u0627\u0631" : "Adhkar"}</Text>
              <Text style={styles.shortcutSubtitle}>{languages ? "\u0623\u0630\u0643\u0627\u0631 \u0627\u0644\u064a\u0648\u0645" : "Daily remembrance"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ImageBackground
          source={images.homeHero}
          contentFit="cover"
          imageStyle={styles.heroImage}
          style={styles.heroCard}
        >
          <LinearGradient
            colors={["rgba(4, 16, 42, 0.96)", "rgba(4, 16, 42, 0.58)", "rgba(4, 16, 42, 0.06)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.nowPlayingBadge}>
              <MaterialIcons name="graphic-eq" size={16} color={Colors.blue} />
              <Text style={styles.nowPlayingText}>{track && isPlaying ? (languages ? "قيد التشغيل" : "NOW PLAYING") : (languages ? "استمع الآن" : "LISTEN NOW")}</Text>
            </View>
            <Text
              numberOfLines={1}
              style={[styles.heroChapter, languages && styles.heroArabicText]}
            >
              {currentChapterName}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.heroReciter, languages && styles.heroArabicText]}
            >
              {currentReciterName}
            </Text>
            <View style={styles.playerControls}>
              <TouchableOpacity
                accessibilityLabel={languages ? "السورة السابقة" : "Previous chapter"}
                onPress={() => handleAdjacentChapter(-1)}
                style={styles.skipButton}
              >
                <MaterialIcons name="skip-previous" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={languages
                  ? (track && isPlaying ? "إيقاف التشغيل مؤقتًا" : "تشغيل السورة المميزة")
                  : (track && isPlaying ? "Pause playback" : "Play featured chapter")}
                onPress={handleFeaturedPlayback}
                style={styles.heroPlayButton}
              >
                <MaterialIcons
                  name={track && isPlaying ? "pause" : "play-arrow"}
                  size={30}
                  color={Colors.background}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={languages ? "السورة التالية" : "Next chapter"}
                onPress={() => handleAdjacentChapter(1)}
                style={styles.skipButton}
              >
                <MaterialIcons name="skip-next" size={24} color={Colors.text} />
              </TouchableOpacity>
              <View style={styles.queueCount}>
                <Text style={styles.queueCountText}>
                  {currentChapterNumber} / {chapters.length || 114}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <SectionHeading
            title={languages ? "تابع الاستماع" : "Continue Listening"}
            action={languages ? "عرض الكل" : "See all"}
            onPress={() => openSearch("chapters")}
            styles={styles}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={languages ? "استكمال الاستماع" : "Continue listening"}
            onPress={handleContinueListening}
            style={styles.continueCard}
          >
            <View style={styles.continueCoverWrap}>
              <Image source={images.quranCover} contentFit="cover" style={styles.continueCover} />
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>
            <View style={styles.continueInfo}>
              <Text numberOfLines={1} style={styles.continueTitle}>{currentChapterName}</Text>
              <Text style={styles.continueMeta}>
                {languages ? "السورة" : "Chapter"} {currentChapterNumber} - {continueChapter?.verses_count || 0} {languages ? "آية" : "verses"}
              </Text>
              <Text numberOfLines={1} style={styles.continueReciter}>{currentReciterName}</Text>
            </View>
            <View style={styles.smallPlayButton}>
              <MaterialIcons name={track && isPlaying ? "pause" : "play-arrow"} size={23} color={Colors.background} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SectionHeading
            title={languages ? "موصى به لك" : "Recommended for You"}
            action={languages ? "عرض الكل" : "See all"}
            onPress={() => openSearch("reciters")}
            styles={styles}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reciterList}
          >
            {recommendedReciters.map((item) => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                onPress={() => openReciter(item)}
                style={[
                  styles.reciterCard,
                  isTrackSelected(idReader, IDchapter, item.id, IDchapter) && styles.selectedTrackCard,
                ]}
              >
                <View style={styles.reciterImageWrap}>
                  <Image
                    source={{ uri: dataArray[item.id]?.image || images.reciterPlaceholder }}
                    contentFit="cover"
                    style={styles.reciterImage}
                  />
                  <View style={styles.reciterPlayIcon}>
                    <MaterialIcons name="play-arrow" size={16} color={Colors.text} />
                  </View>
                </View>
                <Text numberOfLines={2} style={styles.reciterName}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.reciterStyle}>
                  {languages
                    ? ({ "Popular Reciter": "قارئ مشهور", "Legendary Reciter": "قارئ أسطوري", "Peaceful Sound": "صوت هادئ", "Makkah Reciter": "قارئ مكة" }[item.style] || "قارئ للقرآن")
                    : item.style}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeading
            title={languages ? "السور" : "Chapters"}
            action={languages ? "عرض الكل" : "See all"}
            onPress={() => openSearch("chapters")}
            styles={styles}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {FILTERS.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setActiveFilter(filter)}
                  style={[styles.filterChip, selected && styles.filterChipActive]}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                    {languages
                      ? ({ All: "الكل", Meccan: "مكية", Medinan: "مدنية", Short: "قصار السور", Long: "طوال السور" }[filter])
                      : filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedChapter ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => openChapter(selectedChapter)}
              style={[
                styles.chapterRow,
                isTrackSelected(idReader, IDchapter, idReader, selectedChapter.id) && styles.selectedChapterRow,
              ]}
            >
              <View style={styles.chapterCoverWrap}>
                <Image source={images.quranCover} contentFit="cover" style={styles.chapterCover} />
              </View>
              <View style={styles.chapterDetails}>
                <Text numberOfLines={1} style={styles.chapterRowTitle}>
                  {languages ? selectedChapter.name_arabic : selectedChapter.name_simple}
                </Text>
                <Text numberOfLines={1} style={styles.chapterRowSubtitle}>{currentReciterName}</Text>
              </View>
              <TouchableOpacity
                accessibilityLabel={languages ? "تشغيل السورة" : "Play chapter"}
                onPress={handleFeaturedPlayback}
                style={styles.chapterControl}
              >
                <MaterialIcons name={track && isPlaying ? "pause" : "play-arrow"} size={25} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={languages ? "خيارات السورة" : "Open chapter options"}
                onPress={() => openChapter(selectedChapter)}
                style={styles.chapterControl}
              >
                <MaterialIcons name="queue-music" size={22} color={Colors.text} />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <Text style={styles.emptyChapters}>{languages ? "ستظهر السور عند الاتصال بالإنترنت." : "Chapters will appear when you’re online."}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SectionHeading = ({ title, action, onPress, styles }) => (
  <View style={styles.sectionHeading}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? (
      <TouchableOpacity accessibilityRole="button" onPress={onPress} style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>{action}</Text>
        <MaterialIcons name="chevron-right" size={19} color={Colors.blue} />
      </TouchableOpacity>
    ) : null}
  </View>
);

const createStyles = (isLargeScreen) => {
  const horizontalInset = isLargeScreen ? 32 : 20;
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { paddingBottom: 230 },
    header: {
      height: 64,
      marginTop: 2,
      paddingHorizontal: horizontalInset,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: { width: isLargeScreen ? 184 : 158, height: 54 },
    headerActions: { flexDirection: "row", gap: 12 },
    headerIconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: "rgba(12, 32, 67, 0.78)",
      borderWidth: 1,
      borderColor: "rgba(86, 147, 220, 0.2)",
    },
    greeting: { marginTop: 12, paddingHorizontal: horizontalInset },
    greetingTitle: { color: "#c1d5f1", fontSize: isLargeScreen ? 26 : 16 },
    greetingNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    greetingName: { color: Colors.text, fontSize: isLargeScreen ? 34 : 24, fontWeight: "700" },
    greetingSubtitle: { color: "#a9c1e5", fontSize: isLargeScreen ? 18 : 13, marginTop: 4 },
    searchButton: {
      height: 54,
      marginTop: 22,
      marginHorizontal: horizontalInset,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 19,
      borderWidth: 1,
      borderColor: "rgba(70, 131, 207, 0.22)",
      backgroundColor: "#0b1b3c",
    },
    searchText: { marginStart: 12, color: "#91a9ce", fontSize: isLargeScreen ? 17 : 14 },
    dailySection: { marginTop: 25 },
    shortcutRow: { flexDirection: "row", gap: 12, marginHorizontal: horizontalInset },
    shortcutCard: {
      flex: 1,
      minHeight: 112,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "rgba(48, 106, 167, 0.3)",
      backgroundColor: "#0b1b3b",
    },
    shortcutIcon: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(3, 218, 197, 0.12)",
      marginBottom: 9,
    },
    shortcutTitle: { color: Colors.text, fontSize: 15, fontWeight: "700" },
    shortcutSubtitle: { color: "#9aacc8", fontSize: 11, marginTop: 3 },
    prayerSection: { marginTop: 25 },
    heroCard: {
      height: isLargeScreen ? 340 : 178,
      marginTop: 22,
      marginHorizontal: horizontalInset,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(50, 134, 216, 0.4)",
      backgroundColor: "#0b1d45",
    },
    heroImage: { borderRadius: 20 },
    heroContent: { flex: 1, padding: isLargeScreen ? 26 : 15, justifyContent: "center" },
    nowPlayingBadge: {
      alignSelf: "flex-start",
      height: 28,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: 15,
      backgroundColor: "rgba(0, 205, 207, 0.18)",
    },
    nowPlayingText: { color: Colors.blue, fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
    heroChapter: { color: Colors.text, fontSize: isLargeScreen ? 34 : 22, fontWeight: "700", marginTop: 9, marginBottom: 12, textAlign: "left", writingDirection: "ltr" },
    heroArabic: { color: Colors.blue, fontSize: isLargeScreen ? 28 : 19, marginTop: 1 },
    heroArabicText: { alignSelf: "stretch", textAlign: "right", writingDirection: "rtl" },
    heroReciter: { color: "#a9c1e5", fontSize: isLargeScreen ? 17 : 12, marginTop: 4, textAlign: "left", writingDirection: "ltr" },
    playerControls: { height: 42, marginTop: 10, flexDirection: "row", direction: "ltr", alignItems: "center", gap: 16 },
    skipButton: { width: 30, height: 34, alignItems: "center", justifyContent: "center" },
    heroPlayButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.blue,
      shadowColor: Colors.blue,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.32,
      shadowRadius: 12,
      elevation: 5,
    },
    queueCount: {
      height: 32,
      minWidth: 62,
      paddingHorizontal: 12,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(9, 28, 60, 0.9)",
      borderWidth: 1,
      borderColor: "rgba(110, 151, 205, 0.12)",
    },
    queueCountText: { color: "#d0def1", fontSize: 12 },
    section: { marginTop: isLargeScreen ? 32 : 24 },
    sectionHeading: {
      marginBottom: 13,
      paddingHorizontal: horizontalInset,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sectionTitle: { color: Colors.text, fontSize: isLargeScreen ? 25 : 19, fontWeight: "700" },
    seeAllButton: { flexDirection: "row", alignItems: "center" },
    seeAllText: { color: Colors.blue, fontSize: 12, fontWeight: "600" },
    continueCard: {
      minHeight: isLargeScreen ? 138 : 76,
      marginHorizontal: horizontalInset,
      padding: 8,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "rgba(40, 104, 168, 0.28)",
      backgroundColor: "#0b1b3b",
    },
    continueCoverWrap: {
      width: isLargeScreen ? 118 : 78,
      height: isLargeScreen ? 118 : 62,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(3, 218, 197, 0.4)",
    },
    continueCover: { width: "100%", height: "100%" },
    progressTrack: { position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "#061326" },
    progressFill: { width: "38%", height: "100%", backgroundColor: Colors.blue, borderRadius: 2 },
    continueInfo: { flex: 1, minWidth: 0, paddingHorizontal: 14 },
    continueTitle: { color: Colors.text, fontSize: isLargeScreen ? 20 : 15, fontWeight: "600" },
    continueMeta: { color: "#a9c1e5", fontSize: isLargeScreen ? 15 : 12, marginTop: 3 },
    continueReciter: { color: "#9aacc8", fontSize: isLargeScreen ? 14 : 11, marginTop: 5 },
    smallPlayButton: {
      width: isLargeScreen ? 48 : 38,
      height: isLargeScreen ? 48 : 38,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.blue,
      marginStart: 8,
    },
    reciterList: { paddingHorizontal: horizontalInset, gap: 12 },
    reciterCard: {
      width: isLargeScreen ? 190 : 116,
      paddingBottom: 10,
      overflow: "hidden",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(48, 106, 167, 0.3)",
      backgroundColor: "#091a36",
    },
    selectedTrackCard: { backgroundColor: Colors.barbottom, borderColor: Colors.blue },
    reciterImageWrap: { height: isLargeScreen ? 172 : 112, position: "relative" },
    reciterImage: { width: "100%", height: "100%" },
    reciterPlayIcon: {
      position: "absolute",
      end: 8,
      bottom: 8,
      width: 26,
      height: 26,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 13,
      borderWidth: 1,
      borderColor: Colors.blue,
      backgroundColor: "rgba(5, 18, 38, 0.82)",
    },
    reciterName: { minHeight: 32, marginTop: 8, marginHorizontal: 9, color: Colors.text, fontSize: isLargeScreen ? 15 : 11, fontWeight: "600" },
    reciterStyle: { marginHorizontal: 9, marginTop: 2, color: "#9aacc8", fontSize: isLargeScreen ? 13 : 10 },
    filterList: { paddingHorizontal: horizontalInset, gap: 9, marginBottom: 10 },
    filterChip: {
      minWidth: 78,
      height: 38,
      paddingHorizontal: 17,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(54, 102, 162, 0.34)",
      backgroundColor: "#0b1b3b",
    },
    filterChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
    filterText: { color: "#a9c1e5", fontSize: 12 },
    filterTextActive: { color: Colors.background, fontWeight: "600" },
    chapterRow: {
      minHeight: isLargeScreen ? 96 : 72,
      marginHorizontal: horizontalInset,
      paddingHorizontal: 9,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 19,
      borderWidth: 1,
      borderColor: "rgba(3, 218, 197, 0.56)",
      backgroundColor: "#0b1b3b",
    },
    selectedChapterRow: { backgroundColor: Colors.barbottom, borderColor: Colors.blue },
    chapterCoverWrap: {
      width: isLargeScreen ? 70 : 54,
      height: isLargeScreen ? 70 : 54,
      borderRadius: 10,
      overflow: "hidden",
    },
    chapterCover: { width: "100%", height: "100%" },
    chapterDetails: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
    chapterRowTitle: { color: Colors.text, fontSize: isLargeScreen ? 16 : 13, fontWeight: "600" },
    chapterRowSubtitle: { color: "#9aacc8", fontSize: isLargeScreen ? 13 : 10, marginTop: 4 },
    chapterControl: { width: 42, height: 48, alignItems: "center", justifyContent: "center" },
    emptyChapters: { color: Colors.textGray, marginHorizontal: horizontalInset },
  });
};

export default Index;
