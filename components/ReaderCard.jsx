import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";

import { dataArray } from "../constants/RecitersImages";
import LottieView from "lottie-react-native";

const ReaderCard = ({ arab_name, languages, loading, name, id }) => {
  const handleNavigate = () => {
    router.push({ pathname: `/ReaderSurah/`, params: { arab_name, name, id } });
  };

  return (
<>


{loading ? (
                 <LottieView
                     source={require("../assets/images/Loading.json")}
                     style={{ width: 140, height: 50}}
                     autoPlay
                     loop
                   />
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
            resizeMode="cover"
            source={{
              uri: dataArray[id]?.image
                ? dataArray[id]?.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
            }}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            {languages ? "القرآن الكريم من" : "Whole Quran by"}
          </Text>
          <Text numberOfLines={2} style={styles.title}>
            {languages ? arab_name : name}
          </Text>
        </View>
      </View>
    </TouchableRipple>)}
    </>
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
  subtitle: {
    color: "#B3B3B3", // Equivalent to gray-400
    fontSize: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ReaderCard;
