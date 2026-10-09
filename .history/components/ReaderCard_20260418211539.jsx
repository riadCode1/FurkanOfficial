import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { dataArray } from "../constants/RecitersImages";
import LottieView from "lottie-react-native";
import { Colors } from "../constants/Colors";
import { Image } from "expo-image";
import { useGlobalContext } from "../context/GlobalProvider";

const ReaderCard = ({ arab_name, languages, loading, name, id }) => {
  const { width } = useWindowDimensions();

  // Responsive sizes based on screen width
  const isTablet = width >= 768;

  const cardWidth = isTablet ? 200 : 156;
  const lotiSize = isTablet ? 156 : 104;
  const imageHeight = isTablet ? 217 : 156;
  const subtitleFont = isTablet ? 19 : 12;
  const titleFont = isTablet ? 20 : 14;

  const {activeTab, setActiveTab,} = useGlobalContext();

  const handleNavigate = () => {
    router.push({ pathname: `/ReaderSurah/`, params: { arab_name, name, id } });
    setActiveTab(1);
  };

  return (
    <>
      {loading ? (
        <View
          style={[
            styles.Loti,
            { width: lotiSize, height: lotiSize },
          ]}
        >
          <LottieView
            source={require("../assets/images/load3.json")}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            resizeMode="contain"
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
          style={[styles.cardContainer, { width: cardWidth }]}
          borderless={true}
        >
          <View>
            <View style={[styles.imageContainer, { height: imageHeight }]}>
              <Image
                style={styles.image}
                contentFit="cover"
                source={{
                  uri: dataArray[id]?.image
                    ? dataArray[id]?.image
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
                }}
              />
            </View>

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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    overflow: "hidden",
  },
  Loti: {
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
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
  subtitle: {
    color: "#B3B3B3",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ReaderCard;
