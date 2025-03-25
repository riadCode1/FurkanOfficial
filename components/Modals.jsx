import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";


import { TouchableRipple } from "react-native-paper";
import TrackPlayer, { useProgress } from "react-native-track-player";

import StyleSheet from "react-native-media-query";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { Slider} from '@rneui/themed';

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../context/GlobalProvider";
import Dropmenu from "./Dropmenu";
import { Colors } from "../constants/Colors";
import { dataArray } from "../constants/RecitersImages";
import { Image } from "expo-image";

const Modals = ({handleCloseBottomSheet}) => {
  const {
    setModalVisible,
    chapterId,
    duration,
    position,
    reciter,
    reciterAR,
    isPlaying,
    setIsPlaying,
    languages,
    setShuffle,
    arabicCH,
    playNext,
    playPrevious,
    togglePlayback,
    shuffle,
    IDchapter,
    idReader,
    modalVisible,
  } = useGlobalContext();

  const progress = useProgress();

  useEffect(() => {
    progress.position;
  }, [, shuffle]);

  const handlerepeat = () => {
    setShuffle(false);
  };

  const handleShuffle = () => {
    setShuffle(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Convert to hours
    const minutes = Math.floor((seconds % 3600) / 60); // Calculate remaining minutes
    const secs = Math.floor(seconds % 60); // Calculate remaining seconds

    // Format as HH:MM:SS or MM:SS
    if (hours > 0) {
      return `0${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        secs < 10 ? "0" : ""
      }${secs}`;
    } else {
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }
  };

  const handleBackPress = useCallback(() => {
    if (modalVisible) {
      setModalVisible(false);
      return true; // Prevent default back action
    }
    return false; // Allow default back action
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  useEffect(() => {
    // Handle play events
    const playListener = TrackPlayer.addEventListener("remote-play", () => {
      setIsPlaying(true);
    });

    // Handle pause events
    const pauseListener = TrackPlayer.addEventListener("remote-pause", () => {
      setIsPlaying(false);
    });

    // Cleanup both listeners
    return () => {
      playListener.remove();
      pauseListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableRipple
          onPress={handleCloseBottomSheet}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless={true}
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </TouchableRipple>

        <Dropmenu
          chapter={chapterId}
          reciterName={reciter}
          reciterID={idReader}
          arabName={reciterAR}
          chapterAr={arabicCH}
          chapteID={IDchapter}
        />
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <LinearGradient
            colors={[
              "transparent",
              "rgba(24,26,60,1)",
              
              "rgba(24,26,60,0.5)",
            ]}
            style={{
              width: "100%",
              height: 120,
              position: "absolute",
              zIndex: 1,
              bottom: 0,
            }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 2 }}
          />
          <LinearGradient
            colors={[
              "transparent",
              "rgba(24,26,60,1)",
              "rgba(24,26,60,1)",
              "rgba(24,26,60,1)",
            ]}
            style={{
              width: "100%",
              height: 50,
              position: "absolute",
              zIndex: 1,
              top: -30,
            }}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />

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
            {languages ? reciterAR : reciter}
          </Text>
        </View>
      </View>

      {/* Progress bar and time display */}
      <View style={styles.progressContainer}>
        {/* Slider for progress */}
        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration || 1}
          step={1}
          onSlidingComplete={async (value) => {
            await TrackPlayer.seekTo(value);
          }}
          thumbStyle={{
            height: 20,
            width: 20,
            backgroundColor: Colors.blue,
          }}
          thumbTintColor={Colors.blue}
          minimumTrackTintColor={Colors.blue}
          maximumTrackTintColor="#fff"
          trackStyle={{ height: 3 }}
          style={styles.slider}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={playPrevious}>
            <MaterialIcons name="skip-previous" size={38} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={togglePlayback}
            style={styles.playPauseButton}
          >
            {isPlaying ? (
              <MaterialIcons name="pause" size={35} color="white" />
            ) : (
              <MaterialIcons name="play-arrow" size={35} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={playNext}>
            <MaterialIcons name="skip-next" size={38} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.shuffleRepeatContainer}>
          <TouchableOpacity
            style={[
              {
                backgroundColor:
                  shuffle === true ? Colors.backgroundTint : "transparent",
                padding: 10,
                borderRadius: 5,
              },
            ]}
            onPress={handleShuffle}
            activeOpacity={0.7}
          >
            <MaterialIcons name="shuffle" size={30} color="#00D1FF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                backgroundColor:
                  shuffle === false ? Colors.backgroundTint : "transparent",
                padding: 10,
                borderRadius: 5,
              },
            ]}
            onPress={handlerepeat}
            activeOpacity={0.7}
          >
            <MaterialIcons name="repeat" size={30} color="#00D1FF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { styles } = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    "@media (min-width: 700px)": {
      paddingHorizontal: 32,
    },
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
    width: "100%",
    height: 294,
    alignItems: "center",
    "@media (min-width: 768ppx)": {
      height: 600,
    },
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: -24,
    zIndex:999
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
    marginTop: 16,
    alignItems: "center",
  },
  slider: {
    width: "90%",
  },

  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "90%",
  },
  timeText: {
    color: "white",
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 67,
    width: "100%",

    "@media (min-width: 768px)": {
      paddingHorizontal: 200,
    },
  },
  playPauseButton: {
    backgroundColor: "#00D1FF",
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 90,
    
  },
  shuffleRepeatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 30,
    
    "@media (min-width: 768px)": {
      paddingHorizontal: 100,
    },
  },
});

export default Modals;
