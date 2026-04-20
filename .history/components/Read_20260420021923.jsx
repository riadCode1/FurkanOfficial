import { View, Text, StyleSheet, useWindowDimensions, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";

import { ActivityIndicator } from "react-native-paper";
import { Colors } from "../constants/Colors";

const Read = ({ id }) => {
  const [surahs, setSurahs] = useState([]);
  const [surahsEng, setSurahsEng] = useState([]);
  const [suwar, setSuwar] = useState([]);
  const [languages, setLanguages] = useState("ar");
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

 


   useEffect(() => {
    const API_URL = `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json`;
    const getSurahsEng = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSuwar(data[id].verses);
        console.log("Fetched English Quran data:", data[1].verses[1]);
        
      } catch (error) {
        console.error("Error fetching Quran data:", error);
      } finally {
        setLoading(false);
      }
    };
    getSurahsEng();
  }, [id]);

  const handleLanguageToggle = () => {
    setLoading(true);
    try {      setLanguages((prevLanguage) => (prevLanguage === "ar" ? "en" : "ar"));
    } catch (error) {
      console.error("Error toggling language:", error);
    }
    setLoading(false);
  }

  const dynamicPadding = width >= 768 ? 32 : 16;

  return (
    <View style={[styles.container, { paddingHorizontal: dynamicPadding }]}>
      <Pressable
        android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
        onPress={handleLanguageToggle}
        style={styles.buttonScroll}
      >
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
            ? "﴿ بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ ﴾"
            : "﴾ In the name of God, the most gracious, the most merciful ﴿"}
        </Text>
      </View>

      {languages === "ar" ? (
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
                }}
              >
                <Text style={{ fontSize: 20 }}>۝</Text>
                <Text style={{ position: "absolute", fontSize: 10 }}>
                  {item.verse_key.slice(2)}
                </Text>
              </View>
            </View>
          ))
        )
      ) : loading ? (
        <ActivityIndicator size="small" color={Colors.blue} />
      ) : (
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
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                {surah?.text}
              </Text>
              <View
                style={{
                  backgroundColor: "#EBD7CA",
                  textAlign: "center",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <Text>{surah.translation}</Text>
              </View>

              {/* Map through all verses of this Surah */}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF9E4",
    paddingVertical: 200,
    paddingTop: 16,
    alignItems: "center",
    
  },
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
});

export default Read;
