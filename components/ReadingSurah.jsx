import { View, Text, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import LottieView from "lottie-react-native";
import { Colors, TextH } from "../constants/Colors";
import StyleSheet from "react-native-media-query";
const ReadingSurah = ({
  chapter_arab,
  arab_name,
  languages,
  name,
  Chapterid,
  verses,
  loading,
}) => {
  const handleNavigate = () => {
    router.push({
      pathname: `Readers`,
      params: { chapter_arab, arab_name, name, Chapterid },
    });
  };

  return (
    <>
      {loading ? (
       <View style={styles.Loti}>
           <LottieView
                            source={require("../assets/images/load3.json")}
                            style={{ width: "100%", height: "100%",overflow:"hidden"}}
                            resizeMode="contain"
                            autoPlay
                            colorFilters={[
                              {
                                keypath: "fade_layer", // Replace with the name of the layer you want to change
                                color: Colors.backgroundTint, // Replace with the desired color (e.g., red)
                              },
                              {
                                keypath: 'Another Layer Name', // Another layer to change
                                color: '#00FF00', // Green color
                              },
                            ]}
                            loop
                          />
         </View>
      ) : (
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
                source={require("../assets/images/quranLogo.jpeg")}
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
      )}
    </>
  );
};

const { ids, styles } = StyleSheet.create({
  cardContainer: {
    width: 104,
    overflow: "hidden",
    "@media (min-width: 700px)": {
      width: 156,
    },
  },
  Loti:{
    width: 104,
            height: 104,
            borderRadius: 8,
            overflow: "hidden",

            '@media (min-width: 768px)': {
              height:156,
              width: 156,
          },

  },

  imageContainer: {
    width: "100%",
    height: 104,
    borderRadius: 8,
    overflow: "hidden",
    "@media (min-width: 700px)": {
      height: 156,
    },
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
    fontWeight: "bold",
    "@media (min-width: 700px)": {
      fontSize: 20,
    },
  },
  subtitle: {
    color: "#B3B3B3", // Equivalent to gray-400
    fontSize: 12,
    "@media (min-width: 700px)": {
      fontSize: 19,
    },
  },
});

export default ReadingSurah;
