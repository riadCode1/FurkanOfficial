import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { dataArray } from "../constants/RecitersImages";
import { Image } from "expo-image";
import { Colors } from "../constants/Colors";

const ReaderCard = ({ arab_name, languages, loading, name, id }) => {
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  // Responsive sizes
  const cardWidth = isTablet ? 200 : 156;
  const loaderSize = isTablet ? 60 : 50;
  const imageHeight = isTablet ? 217 : 156;
  const subtitleFont = isTablet ? 19 : 12;
  const titleFont = isTablet ? 20 : 14;

  const handleNavigate = () => {
    router.push({
      pathname: "/ReaderSurah/",
      params: { arab_name, name, id },
    });
  };

  if (!loading) {
    return (
      <View style={[styles.loaderContainer, { width: cardWidth }]}>
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <ActivityIndicator
            size={loaderSize}
            color={Colors.blue || "#00AEEF"}   // Change to your primary color
            style={styles.loader}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.subtitle, { fontSize: subtitleFont }]}>
            {languages ? "جاري التحميل..." : "Loading..."}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.title, { fontSize: titleFont }]}
          >
            {languages ? arab_name : name}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableRipple
      onPress={handleNavigate}
      rippleColor="rgba(255, 255, 255, 0.1)"
      style={[styles.cardContainer, { width: cardWidth }]}
      borderless={true}
    >
      <View>
        {/* Image Section */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            style={styles.image}
            contentFit="cover"
            source={{
              uri: dataArray[id]?.image || 
                   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
            }}
            transition={300}           // Smooth fade-in
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={[styles.subtitle, { fontSize: subtitleFont }]}>
            {languages ? "القرآن الكريم من" : "114 chapters recited by "}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.title, { fontSize: titleFont }]}
          >
            {languages ? arab_name : name}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    overflow: "hidden",
    borderRadius: 12,
  },
  loaderContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1F1F1F",        // Dark card background while loading
  },
  imageContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",        // Placeholder background
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    zIndex: 10,
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  subtitle: {
    color: "#B3B3B3",
    marginBottom: 2,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ReaderCard;