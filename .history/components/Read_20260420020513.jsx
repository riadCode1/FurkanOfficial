import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "../constants/Colors";

const Read = ({ id }) => {
  const [surahs, setSurahs] = useState([]);
  const [surahsEng, setSurahsEng] = useState([]);
  const { languages } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const API_URL = `https://api.quran.com/api/v4/quran/verses/indopak?chapter_number=${id}`;
    const getSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSurahs(data.verses);
      } catch (error) {
        console.error("Error fetching Quran data:", error);
      } finally {
        setLoading(false);
      }
    };
    getSurahs();
  }, [id]);

<<<<<<< HEAD
  useEffect(() => {
    const API_URL = `https://quranapi.pages.dev/api/${id}.json`;
=======
 
  useEffect(() => {
    const API_URL = `https://quranapi.pages.dev/api/${id}.json`;new Error("Failed to fetch data");
        const data = await response.json();
<<<<<<< HEAD
        setSurahsEng(data);
=======
        setSuwar(data[id].verses);
        console.log("Fetched English Quran data:", data[1].verses[1]);
        
>>>>>>> 3cff79e (Initial commit)
      } catch (error) {
        console.error("Error fetching Quran data:", error);
      } finally {
        setLoading(false);
      }
    };
        setSurahsEng(data);
    try {      setLanguages((prevLanguage) => (prevLanguage === "ar" ? "en" : "ar"));
    } catch (error) {
      console.error("Error toggling language:", error);
    }
    setLoading(false);
  }

>>>>>>> 3cff79e (Initial commit)
  const dynamicPadding = width >= 768 ? 32 : 16;

        <Text
          style={[
            styles.text,
            { fontSize: 16, color: "#FFF9E4", fontWeight: "bold" },
          ]}
        >
          {languages === "ar" ? "EN" : "AR"}
        </Text>
      </Pressable>
      <View style={{ marginBottom: 18 }}>
        <Text  style={{
                  
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  
                }}>
          {languages === "ar"
>>>>>>> 3cff79e (Initial commit)
            ? "﴿ بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ ﴾"
            : "﴾ In the name of God, the most gracious, the most merciful ﴿"}
        </Text>
      </View>

<<<<<<< HEAD
      {languages ? (
=======
      {languages === "ar" ? (
>>>>>>> 3cff79e (Initial commit)
        loading ? (
          <ActivityIndicator size="small" color={Colors.blue} />
        ) : (
          surahs.map((item) => (
            <View key={item.id.toString()} style={styles.item}>
              <Text style={styles.text}>{item.text_indopak}</Text>
              <View
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
      {languages ? (y.slice(2)}
                </Text>
              </View>
            </View>
          ))
        )
      ) : loading ? (
        <ActivityIndicator size="small" color={Colors.blue} />
      ) : (
<<<<<<< HEAD
        <Text style={styles.text}>{surahsEng.english}</Text>
=======
        <FlatList
          data={suwar} // This should be the array of Surahs
          keyExtractor={(surah) => surah.id.toString()}
          renderItem={(
            { item: surah }, // 'item' is now one Surah
          ) => (
            <View style={styles.surahContainer}>
              {/* Surah Name (Header) */}
              <Text
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
        <Text style={styles.text}>{surahsEng.english}</Text>
  listContent: {
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 18,
    fontFamily: "DMSans-Regular",
    textAlign: "center",
    color: "#2D2926",
  },
  item: {
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5C9",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
<<<<<<< HEAD
=======
  buttonScroll: {
        width: 30,
        height: 30,
        
        borderRadius: 50,
        
        zIndex: 999,
        backgroundColor: Colors.barbottom,
        alignSelf: "flex-end",
        
        alignItems: "center",
        justifyContent: "center",
        elevation: 50,
      },
>>>>>>> 3cff79e (Initial commit)
});

export default Read;
