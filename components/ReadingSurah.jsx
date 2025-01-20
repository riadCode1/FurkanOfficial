import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";

const ReadingSurah = ({
  chapter_arab,
  arab_name,
  languages,
  name,
  Chapterid,
  verses,
}) => {
  const handleNavigate = () => {
    router.push({
      pathname: `Readers`,
      params: { chapter_arab, arab_name, name, Chapterid },
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigate}
      rippleColor="rgba(255, 255, 255, 0.1)"
      style={styles.cardContainer}
      borderless={true}
    >
      <View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require("../assets/images/quranLogo.png")}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.chapterTitle}>
            {languages ? chapter_arab : name}
          </Text>
          <View>
            <Text style={styles.subtitle}>
              {verses} {languages ? "آية" : "Verse"}
            </Text>
            <Text style={styles.subtitle}>
              {languages ? "السورة" : "Chapter"} {Chapterid}
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 12,
    width: 104,
   
    overflow: "hidden", // Ensures ripple effect stays within bounds
  },
  imageContainer: {
    width: 104,
    height: 104,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginTop: 8,
  },
  chapterTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: "#7D7D7D", // Equivalent to gray-500
    fontSize: 12,
  },
});

export default ReadingSurah;
