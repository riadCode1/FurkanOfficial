import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
<<<<<<< HEAD
import React, { useRef } from "react";
import { Image } from "expo-image";
=======
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { fetchChater } from "../app/API/QuranApi";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
import { useGlobalContext } from "../context/GlobalProvider";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
<<<<<<< HEAD
import { useScrollToTop } from "../context/ScrollToTopProvider";

const ChapterFilter = ({ chapter = [] }) => {
  const { languages } = useGlobalContext();
  const { width } = useWindowDimensions();
  const listRef = useRef(null);
  const handleScroll = useScrollToTop(listRef);
=======
import LottieView from "lottie-react-native";

const ChapterFilter = () => {
  const [chapter, setChapter] = useState([]);
  const [loading, setLoading] = useState(false);

  const { languages } = useGlobalContext();
  const { width } = useWindowDimensions();

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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

  const handleNavigate = (name, chapter_arab, Chapterid) => {
    router.push({
      pathname: `ReadersSearch`,
      params: { name, Chapterid, chapter_arab },
    });
  };

  // Responsive padding (replaces media query)
  const horizontalPadding = width >= 768 ? 32 : 16;

  return (
    <View style={styles.container}>
      <FlashList
<<<<<<< HEAD
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 400 }}
=======
        contentContainerStyle={{ paddingBottom: 320 }}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        data={chapter}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={75}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
<<<<<<< HEAD
=======
          <View>
            {loading ? (
              <View>
                <LottieView
                  source={require("../assets/images/Loading.json")}
                  style={{ right: 70, width: 400, height: 50 }}
                  autoPlay
                  loop
                />
              </View>
            ) : (
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
              <TouchableRipple
                onPress={() =>
                  handleNavigate(item.name_simple, item.name_arabic, item.id)
                }
                rippleColor="rgba(200, 200, 200, 0.1)"
                style={[styles.playButton, { paddingHorizontal: horizontalPadding }]}
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
                      <Text style={styles.chapterARText}>
                        {item.name_arabic}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: 45, height: 48, paddingLeft: 15 }} />
                </View>
              </TouchableRipple>
<<<<<<< HEAD
=======
            )}
          </View>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 1,
=======
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    paddingVertical: 8,
  },
  playButton: {
    width: "100%",
<<<<<<< HEAD
    paddingVertical: 11,
    borderRadius: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169,177,188,0.12)",
=======
    paddingVertical: 12,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
<<<<<<< HEAD
    borderRadius: 12,
=======
    borderRadius: 25,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
  chapterARText: {
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
