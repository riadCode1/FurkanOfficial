import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import React, { useEffect, useState } from "react";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useGlobalContext } from "../context/GlobalProvider";

import { useSharedValue } from "react-native-reanimated";
import { Colors } from "../constants/Colors";
import Slider from "@react-native-community/slider";
import { TouchableRipple } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";


const ModalAudio = ({ nextSurah, previousSurah }) => {
  const {
    setModalVisible,
    chapterId,
    setPosition,
    duration,
    position,
    reciter,
    reciterAR,
    isPlaying,
    languages,
    pauseAudio,
    arabicCH,
    soundRef
  } = useGlobalContext();

  const focused = useIsFocused()

  const progress = useSharedValue(position);
  const min = useSharedValue(0);
  const max = useSharedValue(duration);

  useEffect(() => {

    progress.value = position;
  }, [,position,focused]);

  const formatTime = (millis) => {
    const hours = Math.floor(millis / 3600000); // Convert to hours
    const minutes = Math.floor((millis % 3600000) / 60000); // Calculate remaining minutes
    const seconds = Math.floor((millis % 60000) / 1000); // Calculate remaining seconds
    return `0${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
       
        <TouchableRipple
      onPress={() => setModalVisible(false)}
      rippleColor="rgba(255, 255, 255, 0.2)"
      style={styles.backButton}
      borderless={true}
    >
       <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
    </TouchableRipple>
       

    <TouchableRipple
      onPress={() => setModalVisible(false)}
      rippleColor="rgba(255, 255, 255, 0.2)"
      style={styles.backButton}
      borderless={true}
    >
       <Entypo name="dots-three-vertical" size={20} color="white" />
    </TouchableRipple>

     
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={require("../assets/images/moon.png")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.chapterText}>
            {languages ? arabicCH : chapterId}
          </Text>
          <Text style={styles.reciterText}>
            {languages ? reciterAR : reciter}
          </Text>
        </View>
      </View>

      {/* Progress bar and time display */}
      <View style={styles.progressContainer}>

        {/* Slider for progress */}
     <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration || 1}
                value={position}
                thumbTintColor={Colors.blue} // Apply track style
                minimumTrackTintColor={Colors.blue}
                maximumTrackTintColor="#fff"
                onSlidingComplete={async (value) => {
                  if (soundRef) {
                    await soundRef.current.setPositionAsync(value);
                  }
                }}
              />

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={previousSurah}>
            <MaterialIcons name="skip-previous" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={pauseAudio}
            style={styles.playPauseButton}
          >
            {isPlaying ? (
              <FontAwesome name="pause" size={24} color="white" />
            ) : (
              <FontAwesome name="play" size={24} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={nextSurah}>
            <MaterialIcons name="skip-next" size={40} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.shuffleRepeatContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialIcons name="shuffle" size={30} color="#00D1FF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <MaterialIcons name="repeat" size={30} color="#00D1FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    marginTop: 16,
    backgroundColor: Colors.background,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal:16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
   
    
    width: 44,
    elevation: 50,
    height: 44,
    zIndex: 99,
    backgroundColor: "#454B8C",
  },
  imageContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#00D1FF",
    width: "90%",
    height: 294,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  chapterText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  reciterText: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  progressContainer: {
    marginTop:16,
    alignItems: "center",
    
  },
  slider: {
    width: "100%",
    
    
  },
  
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "90%",
    
  },
  timeText: {
    color: "white",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal:67,
    width: "100%",
  },
  playPauseButton: {
    backgroundColor: "#00D1FF",
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  shuffleRepeatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 30,
  },
});

export default ModalAudio;
