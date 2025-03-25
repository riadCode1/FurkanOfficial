import { View, Text, Image, } from "react-native";
import React from "react";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { dataArray } from "../constants/RecitersImages";
import LottieView from "lottie-react-native";
import StyleSheet from 'react-native-media-query';
import { Colors } from "../constants/Colors";

const ReaderCard = ({ arab_name, languages, loading, name, id }) => {

 

  const handleNavigate = () => {
    router.push({ pathname: `/ReaderSurah/`, params: { arab_name, name, id } });
  };

  return (
    <>
      {loading ? (
        <View
          style={styles.Loti}
        >
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
        </TouchableRipple>
      )}
    </>
  );
};

const {ids,styles} = StyleSheet.create({
  cardContainer: {
    
    width: 104,
    overflow: "hidden", 
    '@media (min-width: 768px)': {
            width:156
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
    '@media (min-width: 768px)': {
            height:156
        },
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
    fontSize:12,
    '@media (min-width: 768px)': {
            fontSize:19
        },
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    '@media (min-width: 768px)': {
            fontSize:20
        },
  },
});

export default ReaderCard;