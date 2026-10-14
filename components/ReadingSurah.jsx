import { View, Text, Image, useWindowDimensions, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import LottieView from "lottie-react-native";
import { Colors } from "../constants/Colors";
import { images } from "../constants/images";

const ReadingSurah = ({
  chapter_arab,
  arab_name,
  languages,
  name,
  Chapterid,
  verses,
  loading,
  cardWidth,
}) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const handleNavigate = () => {
    router.push({
      pathname: `Readers`,
      params: { chapter_arab, arab_name, name, Chapterid },
    });
  };

  const dynamicStyles = StyleSheet.create({
    cardContainer: {
      width: cardWidth || (isLargeScreen ? width * 0.55 : width * 0.82),
      minHeight: 84,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "rgba(75, 142, 224, 0.3)",
      backgroundColor: "#0b1b4b",
    },
    Loti: {
      width: cardWidth || (isLargeScreen ? width * 0.55 : width * 0.82),
      height: 84,
      borderRadius: 5,
      overflow: "hidden",
      justifyContent: "space-between",
    },
    imageContainer: {
      width: isLargeScreen ? 72 : 60,
      height: isLargeScreen ? 72 : 60,
      borderColor: Colors.blue,
      borderRadius: 8,
      borderWidth: 1,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    textContainer: {
      flex: 1,
      marginTop: 0,
      alignItems: "flex-start",
    },
    chapterTitle: {
      color: "#FFFFFF",
      fontSize: isLargeScreen ? 20 : 14,
      fontWeight: "bold",
    },
    subtitle: {
      color: "#B3B3B3",
      fontSize: isLargeScreen ? 19 : 12,
    },
  });

  return (
    <>
      {loading ? (
        <View style={dynamicStyles.Loti}>
          <LottieView
            source={require("../assets/images/load3.json")}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            resizeMode="cover"
            autoPlay
            colorFilters={[
              {
                keypath: "fade_layer",
                color: Colors.backgroundTint,
              },
              {
                keypath: "Another Layer Name",
                color: "#00FF00",
              },
            ]}
            loop
          />
        </View>
      ) : (
        <TouchableRipple
          onPress={handleNavigate}
          rippleColor="rgba(255, 255, 255, 0.1)"
          style={dynamicStyles.cardContainer}
          borderless={true}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={dynamicStyles.imageContainer}>
              <Image
                style={dynamicStyles.image}
                resizeMode="contain"
                source={images.quranCover}
              />
            </View>

            <View style={dynamicStyles.textContainer}>
              <Text style={dynamicStyles.chapterTitle}>
                {languages ? chapter_arab : name}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={dynamicStyles.subtitle}>
                  {verses} {languages ? "آية" : "Verse"}
                </Text>
                <Text style={dynamicStyles.subtitle}>•</Text>
                <Text style={dynamicStyles.subtitle}>
                  {languages ? "السورة" : "Chapter"} {Chapterid}
                </Text>
              </View>
            </View>
          </View>
        </TouchableRipple>
      )}
    </>
  );
};

export default ReadingSurah;
