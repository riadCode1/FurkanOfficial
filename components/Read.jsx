import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useScrollToTop } from "../context/ScrollToTopProvider";

const ARABIC_VERSES_URL = "https://api.quran.com/api/v4/quran/verses/indopak";
const ENGLISH_QURAN_URL = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json";
let englishQuranRequest;

const fetchEnglishQuran = () => {
  if (!englishQuranRequest) {
    englishQuranRequest = fetch(ENGLISH_QURAN_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the English Quran.");
        return response.json();
      })
      .catch((error) => {
        englishQuranRequest = undefined;
        throw error;
      });
  }
  return englishQuranRequest;
};

const Read = ({ id }) => {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { width } = useWindowDimensions();
  const [arabicVerses, setArabicVerses] = useState([]);
  const [englishVerses, setEnglishVerses] = useState([]);
  const [language, setLanguage] = useState("ar");
  const [activePage, setActivePage] = useState(null);
  const [arabicLoading, setArabicLoading] = useState(true);
  const [englishLoading, setEnglishLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setArabicLoading(true);
    setError("");

    fetch(`${ARABIC_VERSES_URL}?chapter_number=${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load this chapter.");
        return response.json();
      })
      .then((data) => {
        if (!isCurrent) return;
        setArabicVerses(data?.verses || []);
        setActivePage(null);
      })
      .catch((fetchError) => {
        if (isCurrent) setError(fetchError.message || "Could not load this chapter.");
      })
      .finally(() => {
        if (isCurrent) setArabicLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const pages = useMemo(() => {
    if (!arabicVerses.length) return [];
    const hasPageNumbers = arabicVerses.some((verse) => Number.isFinite(Number(verse.page_number)));

    if (hasPageNumbers) {
      const pageMap = new Map();
      arabicVerses.forEach((verse) => {
        const pageNumber = Number(verse.page_number);
        if (!Number.isFinite(pageNumber)) return;
        if (!pageMap.has(pageNumber)) pageMap.set(pageNumber, []);
        pageMap.get(pageNumber).push(verse);
      });
      return Array.from(pageMap, ([number, verses]) => ({ number, verses }))
        .sort((a, b) => a.number - b.number);
    }

    const versesPerPage = 15;
    const fallbackPages = [];
    for (let index = 0; index < arabicVerses.length; index += versesPerPage) {
      fallbackPages.push({
        number: fallbackPages.length + 1,
        verses: arabicVerses.slice(index, index + versesPerPage),
      });
    }
    return fallbackPages;
  }, [arabicVerses]);

  useEffect(() => {
    if (!pages.length) return;
    if (!pages.some((page) => page.number === activePage)) setActivePage(pages[0].number);
  }, [activePage, pages]);

  const currentPageIndex = Math.max(0, pages.findIndex((page) => page.number === activePage));
  const currentPage = pages[currentPageIndex];

  const loadEnglishVerses = useCallback(async () => {
    if (englishVerses.length || englishLoading) return;
    setEnglishLoading(true);
    setError("");
    try {
      const data = await fetchEnglishQuran();
      const chapterNumber = Number(id);
      const chapter = Array.isArray(data)
        ? data.find((item) => Number(item.id) === chapterNumber) || data[chapterNumber - 1]
        : data?.[chapterNumber] || data?.[String(chapterNumber)];
      setEnglishVerses(chapter?.verses || []);
    } catch (fetchError) {
      setError(fetchError.message || "Could not load the English translation.");
    } finally {
      setEnglishLoading(false);
    }
  }, [englishLoading, englishVerses.length, id]);

  const toggleLanguage = () => {
    if (language === "ar") {
      setLanguage("en");
      loadEnglishVerses();
    } else {
      setLanguage("ar");
      setError("");
    }
  };

  const visibleEnglishVerses = useMemo(() => {
    if (!currentPage || !englishVerses.length) return [];
    const firstArabicVerse = currentPage.verses[0];
    const lastArabicVerse = currentPage.verses[currentPage.verses.length - 1];
    const start = Number(firstArabicVerse?.verse_key?.split(":")[1] || firstArabicVerse?.verse_number);
    const end = Number(lastArabicVerse?.verse_key?.split(":")[1] || lastArabicVerse?.verse_number);

    if (Number.isFinite(start) && Number.isFinite(end)) {
      return englishVerses.filter((verse, index) => {
        const verseNumber = Number(verse.verse_number || verse.id || index + 1);
        return verseNumber >= start && verseNumber <= end;
      });
    }
    return englishVerses.slice(currentPageIndex * 15, currentPageIndex * 15 + 15);
  }, [currentPage, currentPageIndex, englishVerses]);

  const changePage = (offset) => {
    const nextIndex = Math.min(Math.max(currentPageIndex + offset, 0), pages.length - 1);
    if (pages[nextIndex]) setActivePage(pages[nextIndex].number);
  };

  const renderPage = (isFullScreen) => (
    <View style={[styles.reader, isFullScreen && styles.fullScreenReader]}>
      <View style={styles.readerHeader}>
        <View style={styles.readerHeading}>
          <Text style={styles.readerTitle}>{language === "ar" ? "القرآن الكريم" : "Quran"}</Text>
          <Text style={styles.readerSubtitle}>
            {currentPage
              ? `${language === "ar" ? "الصفحة" : "Page"} ${currentPage.number} · ${pages.length}`
              : language === "ar" ? "ترتيب المصحف" : "Mushaf pages"}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === "ar" ? "تغيير اللغة" : "Change reading language"}
            onPress={toggleLanguage}
            style={styles.smallAction}
          >
            <Text style={styles.languageLabel}>{language === "ar" ? "EN" : "عربي"}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFullScreen ? "Exit full screen" : "Open full screen reader"}
            onPress={() => setExpanded(!isFullScreen)}
            style={styles.iconAction}
          >
            <MaterialIcons
              name={isFullScreen ? "fullscreen-exit" : "fullscreen"}
              size={21}
              color={Colors.text}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.pageSelector}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          disabled={currentPageIndex === 0}
          onPress={() => changePage(-1)}
          style={[styles.pageArrow, currentPageIndex === 0 && styles.disabledAction]}
        >
          <MaterialIcons name="chevron-left" size={22} color={Colors.text} />
        </Pressable>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pageNumbers}
        >
          {pages.map((page) => {
            const selected = page.number === currentPage?.number;
            return (
              <Pressable
                key={page.number}
                accessibilityRole="button"
                accessibilityLabel={`${language === "ar" ? "الصفحة" : "Page"} ${page.number}`}
                accessibilityState={{ selected }}
                onPress={() => setActivePage(page.number)}
                style={[styles.pageNumber, selected && styles.pageNumberSelected]}
              >
                <Text style={[styles.pageNumberText, selected && styles.pageNumberTextSelected]}>
                  {page.number}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next page"
          disabled={currentPageIndex >= pages.length - 1}
          onPress={() => changePage(1)}
          style={[styles.pageArrow, currentPageIndex >= pages.length - 1 && styles.disabledAction]}
        >
          <MaterialIcons name="chevron-right" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.verseArea}>
        {arabicLoading || (language === "en" && englishLoading) ? (
          <ActivityIndicator color={Colors.blue} style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : language === "ar" ? (
          <ScrollView
            ref={scrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            key={`ar-${currentPage?.number || "loading"}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.versesContent}
            nestedScrollEnabled
          >
            {currentPage?.verses.map((verse) => (
              <View key={verse.id || verse.verse_key} style={styles.arabicVerse}>
                <Text style={styles.arabicText}>{verse.text_indopak}</Text>
                <View style={styles.verseNumberBadge}>
                  <Text style={styles.verseNumberText}>
                    {verse.verse_key?.split(":")[1] || verse.verse_number}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            key={`en-${currentPage?.number || "loading"}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.versesContent}
            nestedScrollEnabled
          >
            {visibleEnglishVerses.map((verse, index) => {
              const verseNumber = Number(verse.verse_number || verse.id || index + 1);
              const arabicVerse = currentPage?.verses.find((item) => {
                const number = Number(item.verse_key?.split(":")[1] || item.verse_number);
                return number === verseNumber;
              });

              return (
                <View key={verse.id || index} style={styles.englishVerse}>
                  {arabicVerse?.text_indopak ? (
                    <Text style={styles.englishArabicText}>{arabicVerse.text_indopak}</Text>
                  ) : null}
                  <View style={styles.englishTranslationRow}>
                    <Text style={styles.englishText}>{verse.translation || verse.text}</Text>
                    <Text style={styles.englishVerseNumber}>{verseNumber}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {language === "ar" ? "سورة" : "Surah"} {id} · {currentPageIndex + 1}/{pages.length || 1}
        </Text>
        <View style={styles.footerArrows}>
          <Pressable
            disabled={currentPageIndex === 0}
            onPress={() => changePage(-1)}
            style={[styles.footerArrow, currentPageIndex === 0 && styles.disabledAction]}
          >
            <MaterialIcons name="arrow-back" size={19} color={Colors.text} />
          </Pressable>
          <Pressable
            disabled={currentPageIndex >= pages.length - 1}
            onPress={() => changePage(1)}
            style={[styles.footerArrow, currentPageIndex >= pages.length - 1 && styles.disabledAction]}
          >
            <MaterialIcons name="arrow-forward" size={19} color={Colors.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={[styles.inlineContainer, { width: Math.min(width - 32, 760) }]}>
        {renderPage(false)}
      </View>
      <Modal
        visible={expanded}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setExpanded(false)}
      >
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <SafeAreaView style={styles.fullScreenContainer} edges={["top", "bottom"]}>
          {renderPage(true)}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  reader: {
    minHeight: 420,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(3,218,197,0.22)",
    backgroundColor: "#0D1A2A",
  },
  fullScreenContainer: { flex: 1, backgroundColor: Colors.background },
  fullScreenReader: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 20,
    borderRadius: 24,
  },
  readerHeader: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readerHeading: { gap: 3 },
  readerTitle: { color: Colors.text, fontSize: 17, fontWeight: "700" },
  readerSubtitle: { color: Colors.textGray, fontSize: 12 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  smallAction: {
    minWidth: 42,
    height: 38,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  languageLabel: { color: Colors.text, fontSize: 12, fontWeight: "700" },
  iconAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  pageSelector: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 5 },
  pageNumbers: { alignItems: "center", gap: 7, paddingHorizontal: 2 },
  pageArrow: {
    width: 34,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  pageNumber: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pageNumberSelected: { backgroundColor: Colors.blue },
  pageNumberText: { color: Colors.textGray, fontSize: 12, fontWeight: "600" },
  pageNumberTextSelected: { color: Colors.background, fontWeight: "800" },
  disabledAction: { opacity: 0.35 },
  verseArea: { flex: 1, minHeight: 240, marginTop: 12, overflow: "hidden" },
  versesContent: { paddingVertical: 10, gap: 18 },
  arabicVerse: { alignItems: "center", gap: 10 },
  arabicText: {
    color: "#FFF9E8",
    fontSize: 27,
    lineHeight: 55,
    textAlign: "center",
    writingDirection: "rtl",
  },
  verseNumberBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(3,218,197,0.4)",
    backgroundColor: "rgba(3,218,197,0.1)",
  },
  verseNumberText: { color: Colors.blue, fontSize: 11, fontWeight: "700" },
  englishVerse: {
    gap: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  englishArabicText: {
    color: "#FFF9E8",
    fontSize: 23,
    lineHeight: 42,
    textAlign: "right",
    writingDirection: "rtl",
  },
  englishTranslationRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  englishText: { flex: 1, color: "#FFF9E8", fontSize: 16, lineHeight: 26 },
  englishVerseNumber: { color: Colors.blue, fontSize: 12, fontWeight: "700", paddingTop: 4 },
  loader: { marginTop: 36 },
  errorText: { color: "#F3A3A3", textAlign: "center", padding: 20 },
  footer: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.12)",
    paddingTop: 9,
  },
  footerText: { color: Colors.textGray, fontSize: 12, fontWeight: "600" },
  footerArrows: { flexDirection: "row", gap: 8 },
  footerArrow: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
});

export default Read;
