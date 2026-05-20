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

const Index = () => {
  const { width } = useWindowDimensions();
  const [quranData, setQuranData] = useState([]);
  const [chapter, setChapter] = useState([]);
  const ITEM_WIDTH = width;
  const ITEM_HEIGHT = 150;
  const { setLanguages, languages, loading,activeTab, setActiveTab, } = useGlobalContext();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isLargeScreen = width >= 700;

  const groupedChapters = [
    chapter.slice(2, 4),
    chapter.slice(7, 9),
    chapter.slice(13, 15),
    chapter.slice(18, 20),
  ];

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
      marginTop: 64,
    },
    section2: {
      marginTop: 64,
    },
    sectionTitle: {
      color: "white",
      fontSize: isLargeScreen ? 30 : 20,
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

        <CustomAdan />


        
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
              {languages ? " استمع إلى القرآن الكريم من خلال" : "Listen to the holy Quran by"}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/Searchs",
                  params: { section: "reciters" }
                },setActiveTab(1))
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
              {languages ? "أشهر القراء" : "Most popular reciters"}
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

export default Index;
