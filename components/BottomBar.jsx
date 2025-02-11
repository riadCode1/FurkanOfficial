import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { Image } from 'expo-image';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { dataArray } from "@/constants/RecitersImages";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";

const BottomBar = ({
  
  chapterId,
  setModalVisible,
  name,
  reciterAR,
  arabicCH,
 
  idReader,
}) => {
  
   const { languages,togglePlayback,isPlaying } = useGlobalContext();

  return (
    <TouchableOpacity
      activeOpacity={1}
      
      onPress={() => setModalVisible(true)}
      style={styles.container}
    >
      <View style={styles.row}>
        <View style={styles.imageContainer}>
        <Image
      style={styles.image}
      source={{
        uri: dataArray[idReader]?.image
          ? dataArray[idReader]?.image
          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
      }}
      contentFit="cover" // Adjusts the scaling of the image (similar to resizeMode)
       // Optional: Placeholder image while loading
    />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.chapterText}>
            {languages ? arabicCH : chapterId}
          </Text>
          <Text style={styles.reciterText}>
            {languages ? reciterAR : name}
          </Text>
        </View>
      </View>

      <TouchableRipple
        rippleColor="rgba(200, 200, 200, 0.1)"
        onPress={togglePlayback}
        borderRadius={20} borderless
        style={styles.iconButton}
      >
        {isPlaying ? (
          <FontAwesome5 name="pause" size={20} color="#00D1FF" />
        ) : (
          <FontAwesome5 name="play" size={20} color="#00D1FF" />
        )}
      </TouchableRipple>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    position: "absolute",
    bottom: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#00D1FF",
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.tint,
    alignSelf: "center",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
   paddingHorizontal:9,
   paddingVertical:16
  },
  chapterText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reciterText: {
    fontSize: 12,
    color: "#B3B3B3", // Equivalent to gray-400
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
   
    height:58,
    width:58
  },
});

export default BottomBar;
