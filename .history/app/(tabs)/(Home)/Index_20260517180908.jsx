import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Alert,
  StyleSheet,
  useWindowDimensions,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ReaderCard from "../../../components/ReaderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ReadingSurah from "../../../components/ReadingSurah";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import { NewData, newData2 } from "../../../constants/NewData";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Updates from "expo-updates";
import Carousel from "react-native-reanimated-carousel";
import CustomAdan from "../../../components/CustomAdan";
import * as AuthSession from 'expo-auth-session';
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import { useQuranApi,createBookmark,getBookmarks } from "../../../services/quranApi";
const Index = () => {
  const { width } = useWindowDimensions();
  const [quranData, setQuranData] = useState([]);
  const [chapter, setChapter] = useState([]); 
  const [profile, setProfile] = useState(null);
 const [adding, setAdding] = useState(false);
  const ITEM_WIDTH = width;
  const ITEM_HEIGHT = 150;
  const { setLanguages, languages, loading } = useGlobalContext();
  const [scrollEnabled, setScrollEnabled] = useState(true);
const [bookmarks, setBookmarks] = useState([]);
  const isLargeScreen = width >= 700;
 const { session } = useAuth();

const api = useQuranApi();

  const groupedChapters = [
    chapter.slice(2, 4),
    chapter.slice(7, 9),
    chapter.slice(13, 15),
    chapter.slice(18, 20),
  ];
 ;

  useEffect(() => {
    toggleDirection(languages);
    getReciter();
    getChapter();
  }, [languages]);

  const toggleDirection = async (isArabic) => {
    const shouldBeRTL = isArabic;
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);

      Alert.alert("Restart", "App will restart to apply the language.", [
        {
          text: "OK",
          onPress: async () => {
            await Updates.reloadAsync();
          },
        },
      ]);
    }
  };

  // ── Get all bookmarks ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    console.log("Fetching bookmarks...");
    
    try {
      const data = await api.getBookmarks();
      console.log("Bookmarks:", JSON.stringify(data));
      setBookmarks(data.data );
    } catch (err) {
      console.error("Get bookmarks failed:", err);
    } finally {
      setLoading(false);
    }
  };
console.log("Bookmarks state:", bookmarks);
  // ── Add a bookmark ─────────────────────────────────────────────────────────
  const addBookmark = async (verseNumber, key, mushafId = 4) => {
    setAdding(true);
    try {
      await api.addBookmark(verseNumber, key, mushafId);
      console.log("Bookmark added!");
      fetchBookmarks();
       // refresh list
    } catch (err) {
      console.error("Add bookmark failed:", err);
    } finally {
      setAdding(false);
    }
  };

  // ── Delete a bookmark ──────────────────────────────────────────────────────
  const removeBookmark = async (id) => {
    try {
      await api.deleteBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete bookmark failed:", err);
    }
  };




useEffect(() => {
  api.getUserProfile().then(setProfile).catch(console.error);
}, []);


const getUserProfile = async () => {
  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: "https://apis.quran.foundation/quran-reflect/v1/users/profile",
      headers: {
        Accept: "application/json",
        "x-auth-token": session?.accessToken,
        "x-client-id": "a9001320-ae9f-4138-96e6-9817f298670b",
      },
    });

    console.log("Profile Data:", response.data.username);
    setProfile(response.data);

    return response.data;
  } catch (error) {
    console.log(
      "profile Error:",
      error.response?.data || error.message
    );
  }
};






useEffect(() => {
 
    getUserProfile();
  
}, [session]);

  const getReciter = async () => {
    try {
      const data = await fetchSuwar();
      if (data?.recitations) {
        const combinedData = [...data.recitations, ...NewData.recitations];
        setQuranData(combinedData);
      }
    } catch (error) {
      console.error("Error fetching recitations:", error);
    }
  };

  const getChapter = async () => {
    try {
      const data = await fetchChater();
      if (data?.chapters) {
        setChapter(data.chapters);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollContent: {
      paddingBottom: 200,
    },
    header: {
      marginHorizontal: 16,
      width: 160,
      height: 60,
      marginTop: 20,
      alignSelf: "flex-start",
    },
    logo: {
      width: "100%",
      height: "100%",
    },
    section: {
      marginTop: 32,
    },
    section2: {
      marginTop: 32,
    },
    sectionTitle: {
      color: "white",
      fontSize: isLargeScreen ? 30 : 16,
      fontWeight: "bold",
      textAlign: I18nManager.isRTL ? "right" : "left",
      fontFamily: "lucida grande",
    },
    seeAll: {
      fontSize: 16,
      color: Colors.blue,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        decelerationRate="fast"
        contentContainerStyle={dynamicStyles.scrollContent}
      >
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Image
            contentFit="cover"
            style={dynamicStyles.logo}
            source={require("../../../assets/images/indexLogo.png")}
          />
        </View>
        <Text style={dynamicStyles.sectionTitle}>
          Welcome, {profile?.username }
        </Text>

        <CustomAdan />

         {/* Add bookmark button — example: Al-Baqarah ayah 255 */}
      <TouchableOpacity
        style={[styles.addButton, adding && { opacity: 0.6 }]}
        onPress={() => addBookmark(255, 2, 4)}
        disabled={adding}
      >
        {adding
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.addButtonText}>+ Bookmark 2:255</Text>
        }
      </TouchableOpacity>

      {/* Bookmarks list */}
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchBookmarks}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.verseKey}>
                Surah {item.key} — Ayah {item.verse_number ?? item.verseNumber}
              </Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeBookmark(item.id)}>
              <Text style={styles.delete}>🗑 Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No bookmarks yet.</Text>
            <Text style={styles.emptySubtext}>
              Tap the button above to add one.
            </Text>
          </View>
        }
      />
    

 <Button title="Save Bookmark" onPress={createBookmark} />
       

        {/* Popular Reciters */}
        <View style={dynamicStyles.section}>
          <View
            style={{
              paddingHorizontal: 16,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={dynamicStyles.sectionTitle}>
              {languages ? "أشهر القراء" : "Most popular reciters"}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/Searchs",
                  params: { section: "reciters" },
                })
              }
              style={{
                flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                height: 24,
                alignItems: "center",
              }}
            >
              {I18nManager.isRTL ? (
                <>
                  <MaterialIcons
                    size={20}
                    name="chevron-left"
                    color={Colors.blue}
                  />
                  <Text style={dynamicStyles.seeAll}>
                    {languages ? "عرض الكل" : "see all"}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={dynamicStyles.seeAll}>
                    {languages ? "عرض الكل" : "see all"}
                  </Text>
                  <MaterialIcons
                    size={20}
                    name="chevron-right"
                    color={Colors.blue}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{
              gap: 10,
              paddingLeft: 16,
              paddingRight: 16,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {quranData?.slice(6, 12).map((item) => (
              <ReaderCard
                key={item.index}
                item={item}
                loading={loading}
                languages={languages}
                setLanguages={setLanguages}
                name={item.reciter_name}
                arab_name={item.translated_name.name}
                id={item.id}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quran Chapters */}
        <View style={dynamicStyles.section2}>
          <View
            style={{
              paddingHorizontal: 16,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={dynamicStyles.sectionTitle}>
              {languages ? "سور القرآن الكريم" : "Quran Chapters"}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/Searchs",
                  params: { section: "chapters" },
                })
              }
              style={{
                flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                height: 24,
                alignItems: "center",
              }}
            >
              {I18nManager.isRTL ? (
                <>
                  <MaterialIcons
                    size={20}
                    name="chevron-left"
                    color={Colors.blue}
                  />
                  <Text style={dynamicStyles.seeAll}>
                    {languages ? "عرض الكل" : "see all"}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={dynamicStyles.seeAll}>
                    {languages ? "عرض الكل" : "see all"}
                  </Text>
                  <MaterialIcons
                    size={20}
                    name="chevron-right"
                    color={Colors.blue}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Carousel */}
          <Carousel
            width={ITEM_WIDTH}
            height={isLargeScreen? 250: ITEM_HEIGHT}
            data={groupedChapters}
            mode="parallax"
            loop={true}
            autoPlay={false}
            style={{ alignSelf: "flex-start" }}
            pagingEnabled
            snapEnabled
            modeConfig={{
              parallaxScrollingScale: isLargeScreen? 0.98:0.95,
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
                    arab_name={item.translated_name.name}
                    chapter_arab={item.name_arabic}
                    Chapterid={item.id}
                    verses={item.verses_count}
                  />
                ))}
              </View>
            )}
          />
        </View>

        {/* Listen to Quran */}
        <View style={dynamicStyles.section}>
          <View
            style={{
              paddingHorizontal: 16,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={dynamicStyles.sectionTitle}>
              {languages ? "استمع للقرآن الكريم من" : "Listen to Quran by"}
            </Text>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{
              gap: 10,
              paddingLeft: 16,
              paddingRight: 16,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {quranData?.slice(15, 21).map((item) => (
              <ReaderCard
                key={item.index}
                item={item}
                loading={loading}
                languages={languages}
                setLanguages={setLanguages}
                name={item.reciter_name}
                arab_name={item.translated_name.name}
                id={item.id}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0D1B1E" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D1B1E" },
  title: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 16 },
  addButton: {
    backgroundColor: "#1A7F5A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#132020",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1C3030",
  },
  verseKey: { fontSize: 15, color: "#E8F0F2", fontWeight: "600" },
  date: { fontSize: 12, color: "#607880", marginTop: 4 },
  delete: { fontSize: 13, color: "#E55" },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#607880", fontSize: 16, fontWeight: "600" },
  emptySubtext: { color: "#445555", fontSize: 13, marginTop: 8 },
});
export default Index;
