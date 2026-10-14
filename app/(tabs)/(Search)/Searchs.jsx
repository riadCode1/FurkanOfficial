import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import { getReciterImage } from "../../../constants/reciterArtwork";
import { NewData } from "../../../constants/NewData";
import { images } from "../../../constants/images";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";
import SearchBar from "../../../components/SearchBar";
import ChapterFilter from "../../../components/ChapterFilter";
import ReaderFilter from "../../../components/ReaderFilter";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";

const CATEGORIES = [
  { id: "reciters", label: "Reciters", arabicLabel: "قراء", icon: "record-voice-over" },
  { id: "chapters", label: "Chapters", arabicLabel: "سور", icon: "menu-book" },
];

const Search = () => {
  const listRef = useRef(null);
  const handleScroll = useScrollToTop(listRef);
  const { width } = useWindowDimensions();
  const { section } = useLocalSearchParams();
  const { languages } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("reciters");
  const [chapters, setChapters] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestedSection = Array.isArray(section) ? section[0] : section;
    if (CATEGORIES.some((category) => category.id === requestedSection)) {
      setActiveCategory(requestedSection);
    }
  }, [section]);

  useEffect(() => {
    let isCurrent = true;
    Promise.all([fetchChater(), fetchSuwar()])
      .then(([chapterResponse, reciterResponse]) => {
        if (!isCurrent) return;

        setChapters(chapterResponse?.chapters || []);
        const uniqueReciters = new Map();
        [...(reciterResponse?.recitations || []), ...NewData.recitations].forEach((item) => {
          if (!item?.id || item.id === 8 || item.status === "inactive") return;
          if (!uniqueReciters.has(item.id)) uniqueReciters.set(item.id, item);
        });
        setReciters(Array.from(uniqueReciters.values()).sort((a, b) => a.id - b.id));
      })
      .catch((error) => console.error("Failed to load search data:", error))
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const results = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return [];

    const matchingChapters = chapters
      .filter((chapter) =>
        chapter.name_simple?.toLocaleLowerCase().includes(query) ||
        chapter.name_arabic?.includes(searchQuery.trim()) ||
        chapter.translated_name?.name?.toLocaleLowerCase().includes(query)
      )
      .map((chapter) => ({ ...chapter, resultType: "chapter" }));

    const matchingReciters = reciters
      .filter((reciter) =>
        reciter.reciter_name?.toLocaleLowerCase().includes(query) ||
        reciter.translated_name?.name?.toLocaleLowerCase().includes(query)
      )
      .map((reciter) => ({ ...reciter, resultType: "reciter" }));

    return [...matchingChapters, ...matchingReciters];
  }, [chapters, reciters, searchQuery]);

  const openResult = (item) => {
    if (item.resultType === "chapter") {
      router.push({
        pathname: "/ReadersSearch/",
        params: {
          Chapterid: String(item.id),
          chapter_arab: item.name_arabic,
          name: item.name_simple,
        },
      });
      return;
    }

    router.push({
      pathname: "/ReciterSearch/",
      params: {
        id: String(item.id),
        name: item.reciter_name,
        arab_name: item.translated_name?.name || item.reciter_name,
      },
    });
  };

  const renderResult = ({ item }) => {
    const isChapter = item.resultType === "chapter";
    const title = isChapter ? item.name_simple : item.reciter_name;
    const subtitle = isChapter
      ? item.name_arabic
      : item.translated_name?.name || "Quran reciter";
    const imageSource = isChapter
      ? images.quranCover
      : { uri: getReciterImage(item.id) || getReciterImage(11) };

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${isChapter ? "Chapter" : "Reciter"}: ${title}`}
        onPress={() => openResult(item)}
        style={({ pressed }) => [styles.resultRow, pressed && styles.resultRowPressed]}
      >
        <View style={[styles.resultImage, isChapter && styles.chapterImage]}>
          <Image source={imageSource} style={styles.image} contentFit="cover" cachePolicy="memory-disk" />
        </View>
        <View style={styles.resultText}>
          <Text numberOfLines={1} style={styles.resultTitle}>{title}</Text>
          <Text numberOfLines={1} style={styles.resultSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.resultType}>
          <Text style={styles.resultTypeText}>
            {languages ? (isChapter ? "سورة" : "قارئ") : (isChapter ? "Chapter" : "Reciter")}
          </Text>
        </View>
      </Pressable>
    );
  };

  const searching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar backgroundColor={Colors.background} barStyle="light-content" />
      <View style={[styles.header, { paddingHorizontal: width >= 768 ? 32 : 18 }]}>
        <Text style={styles.heading}>{languages ? "بحث" : "Search"}</Text>
        <Text style={styles.subheading}>
          {languages ? "ابحث عن قارئ أو سورة" : "Find a reciter or a surah"}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          title={languages ? "ابحث عن سورة أو قارئ..." : "Search chapters or reciters..."}
        />
      </View>

      {searching ? (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>{languages ? "النتائج" : "Results"}</Text>
            {!loading && <Text style={styles.resultsCount}>{results.length}</Text>}
          </View>
          {loading ? (
            <ActivityIndicator color={Colors.blue} style={styles.loader} />
          ) : (
            <FlatList
              ref={listRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              data={results}
              keyExtractor={(item) => `${item.resultType}-${item.id}`}
              renderItem={renderResult}
              contentContainerStyle={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={(
                <View style={styles.emptyState}>
                  <MaterialIcons name="search-off" size={34} color={Colors.textGray} />
                  <Text style={styles.emptyTitle}>{languages ? "لا توجد نتائج" : "No results found"}</Text>
                  <Text style={styles.emptyDescription}>
                    {languages ? "جرّب اسماً أو تهجئة مختلفة." : "Try another name or spelling."}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      ) : (
        <View style={styles.browseSection}>
          <View style={styles.categorySwitch}>
            {CATEGORIES.map((category) => {
              const selected = activeCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  onPress={() => setActiveCategory(category.id)}
                  style={({ pressed }) => [
                    styles.categoryButton,
                    selected ? styles.categoryButtonSelected : styles.categoryButtonIdle,
                    pressed && styles.categoryButtonPressed,
                  ]}
                >
                  <View style={[styles.categoryIcon, selected && styles.categoryIconSelected]}>
                    <MaterialIcons
                      name={category.icon}
                      size={20}
                      color={selected ? Colors.background : Colors.textGray}
                    />
                  </View>
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                    {languages ? category.arabicLabel : category.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.blue} style={styles.loader} />
          ) : activeCategory === "reciters" ? (
            <ReaderFilter reader={reciters} />
          ) : (
            <ChapterFilter chapter={chapters} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 12, paddingBottom: 18 },
  heading: { color: Colors.text, fontSize: 30, fontWeight: "800", letterSpacing: 0.2 },
  subheading: { color: Colors.textGray, fontSize: 14, marginTop: 4 },
  searchContainer: { alignItems: "center", marginBottom: 18 },
  resultsSection: { flex: 1, paddingTop: 4 },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: "700" },
  resultsCount: {
    minWidth: 24,
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: Colors.blue,
    backgroundColor: "rgba(3,218,197,0.12)",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  resultsList: { paddingBottom: 190 },
  resultRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 13,
  },
  resultRowPressed: { backgroundColor: "rgba(255,255,255,0.06)" },
  resultImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(3,218,197,0.4)",
    backgroundColor: Colors.barbottom,
  },
  chapterImage: { borderRadius: 12 },
  image: { width: "100%", height: "100%" },
  resultText: { flex: 1, minWidth: 0, gap: 4 },
  resultTitle: { color: Colors.text, fontSize: 15, fontWeight: "700" },
  resultSubtitle: { color: Colors.textGray, fontSize: 13 },
  resultType: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  resultTypeText: { color: Colors.textGray, fontSize: 10, fontWeight: "600" },
  emptyState: { alignItems: "center", paddingTop: 72, paddingHorizontal: 28 },
  emptyTitle: { color: Colors.text, fontSize: 17, fontWeight: "700", marginTop: 14 },
  emptyDescription: { color: Colors.textGray, fontSize: 13, textAlign: "center", marginTop: 6 },
  loader: { marginTop: 40 },
  browseSection: { flex: 1 },
  categorySwitch: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginBottom: 12,
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryButtonSelected: {
    borderColor: "rgba(3,218,197,0.68)",
    backgroundColor: "rgba(3,218,197,0.12)",
  },
  categoryButtonIdle: {
    borderColor: "rgba(169,177,188,0.16)",
    backgroundColor: "rgba(255,255,255,0.035)",
  },
  categoryIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  categoryIconSelected: { backgroundColor: Colors.blue },
  categoryButtonPressed: { opacity: 0.78 },
  categoryText: { color: Colors.textGray, fontSize: 14, fontWeight: "600" },
  categoryTextSelected: { color: Colors.text, fontWeight: "700" },
});

export default Search;
