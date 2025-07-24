import { View, Text, FlatList, Dimensions,  } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from 'expo-image';
import { fetchChater } from "../app/API/QuranApi";
import { useGlobalContext } from "../context/GlobalProvider";
import StyleSheet from 'react-native-media-query';
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import LottieView from "lottie-react-native";

let { width, height } = Dimensions.get("window");

const ChapterFilter = () => {
  const [chapter, setChapter] = useState([]);
  const [loading, setLoading] = useState(false);

  const {languages,} = useGlobalContext();

  useEffect(() => {
    getChapter();
  }, [languages]);

  const getChapter = async () => {
    setLoading(true);
    try {
      const data = await fetchChater();
      if (data && data.chapters) {
        setChapter(data.chapters);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (name, chapter_arab, Chapterid) => {
    router.push({
      pathname: `ReadersSearch`,
      params: { name, Chapterid, chapter_arab },
    });
  };

  return (
    <View style={styles.container}>
      <FlashList
        contentContainerStyle={{ paddingBottom: 320 }}
        data={chapter}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={75}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>

              {loading ? (
                    <View>
                           <LottieView
                        source={require("../assets/images/Loading.json")}
                        style={{right:70, width: 400, height: 50}}
                        autoPlay
                        loop
                      />
                          </View>
                  ) : (
            <TouchableRipple
              onPress={() =>
                handleNavigate(item.name_simple, item.name_arabic, item.id)
              }
              rippleColor="rgba(200, 200, 200, 0.1)"
              style={styles.playButton}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={styles.imageContainer}>
                    <Image
                      contentFit="contain"
                      style={styles.image}
                      source={require("../assets/images/quranLogo.jpeg")}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.chapterText}>{item.name_simple}</Text>
                    <Text style={styles.chapterARText}>{item.name_arabic}</Text>
                  </View>
                </View>

                <View style={{ width: 45, height: 48, paddingLeft: 15 }}>
                  {/* <Dropmenu /> */}
                </View>
              </View>
            </TouchableRipple>)}
          </View>
        )}
      />
    </View>
  );
};

const {styles} = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  playButton: {
    width:"100%",
    paddingVertical:12,
    paddingHorizontal:16,
    '@media (min-width: 768px)': {
      paddingHorizontal: 32,
  
    }
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  chapterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  chapterARText:{
     color: Colors.textGray,
    fontWeight: "bold",
    fontSize: 16,
  },
  reciterText: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  menuContainer: {
    flexDirection: "row",

    width: 48,

    justifyContent: "center",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 24,
  },
});

export default ChapterFilter;
