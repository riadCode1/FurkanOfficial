import { View, Text, ScrollView } from "react-native";
import StyleSheet from "react-native-media-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReaderCard from "../../../components/ReaderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ReadingSurah from "../../../components/ReadingSurah";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import { Image } from "expo-image";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const Index = () => {
  const [quranData, setQuranData] = useState([]);
  const [chapter, setChapter] = useState([]);

  const { setLanguages, languages, modalVisible, loading } = useGlobalContext();

  useEffect(() => {
    getReciter();
    getChapter();
  }, [loading]);

  const getReciter = async () => {
    // setLoading(true);
    try {
      const data = await fetchSuwar();
      if (data && data.recitations) {
        const combinedData = [...data.recitations, ...NewData.recitations];
        setQuranData(combinedData);
      }
    } catch (error) {
      console.error("Error fetching recitations:", error);
    } finally {
      // setLoading(false);
    }
  };

  const getChapter = async () => {
    // setLoading(true);
    try {
      const data = await fetchChater();
      if (data && data.chapters) {
        setChapter(data.chapters);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      // setLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top */}
        <View style={styles.header}>
          <Image
            contentFit="cover"
            style={styles.logo}
            source={require("../../../assets/images/indexLogo.png")}
          />
        </View>

        {/* Listen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {languages ? "استمع للقرآن الكريم من " : "Listen to Quran by"}
          </Text>

          <ScrollView
            horizontal
            contentContainerStyle={{ gap: 10, paddingLeft: 16 }}
            showsHorizontalScrollIndicator={false}
          >
            {quranData?.slice(2, 8).map((item) => (
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

        {/* Chapters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {languages ? "أفضل سور القرآن الكريم" : "Best Quran Chapters"}
          </Text>
          <ScrollView
            horizontal
            contentContainerStyle={{ gap: 10, paddingLeft: 16 }}
            showsHorizontalScrollIndicator={false}
          >
            {chapter?.slice(2, 8).map((item) => (
              <ReadingSurah
                key={item.index}
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
          </ScrollView>

        
        </View>
      </ScrollView>
    
    </SafeAreaView>
  );
};

const {  styles } = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  header: {
    justifyContent: "flex-start",
    width: 160,
    height: 50,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  logoText: {
    color: "#01F4FF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },

  iconButton: {
    justifyContent: "center",
    alignItems: "center",

    // To make it fully circular
    backgroundColor: Colors.tint,
    padding: 8,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    fontFamily: "lucida grande",
    "@media (min-width: 700px)": {
      fontSize: 30,
    },
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.background,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textTab,
    borderRadius: 2,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default Index;
