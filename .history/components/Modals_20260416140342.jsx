import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  I18nManager,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../context/GlobalProvider";
import Dropmenu from "./Dropmenu";
import { Colors } from "../constants/Colors";
import { dataArray } from "../constants/RecitersImages";
import { Image } from "expo-image";
import ImageColors from "react-native-image-colors";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const Modals = ({ handleCloseBottomSheet }) => {
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
  const [backgroundColor, setBackgroundColor] = useState(Colors.background);
  const { width } = useWindowDimensions();

  // Fetch dominant image color
  useEffect(() => {
    const fetchColors = async () => {
      const uri = dataArray[idReader]?.image;
      if (!uri) return;

      try {
        const result = await ImageColors.getColors(uri, {
          fallback: Colors.background,
          cache: true,
          key: idReader.toString(),
        });

        setBackgroundColor(
          result.platform === "android"
            ? result.dominant || Colors.background
            : result.background || Colors.background
        );
      } catch (error) {
        console.warn("Failed to fetch image colors:", error);
      }
    };
    fetchColors();
  }, [idReader]);

  const handleBackPress = useCallback(() => {
    if (modalVisible) {
      setModalVisible(false);
      return true;
    }
    return false;
  }, [modalVisible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  useEffect(() => {
    const playListener = TrackPlayer.addEventListener("remote-play", () =>
      setIsPlaying(true)
    );
    const pauseListener = TrackPlayer.addEventListener("remote-pause", () =>
      setIsPlaying(false)
    );
    return () => {
      playListener.remove();
      pauseListener.remove();
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const imageSize = width > 700 ? width * 0.6 : width * 0.85;
  const controlPadding = width > 768 ? 200 : 16;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingHorizontal: width > 768 ? 32 : 16 },
        ]}
      >
        <TouchableRipple
          onPress={handleCloseBottomSheet}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </TouchableRipple>

        <TouchableRipple
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless
        >
          <Dropmenu
            chapter={chapterId}
            reciterName={reciter}
            reciterID={idReader}
            arabName={reciterAR}
            chapterAr={arabicCH}
            chapteID={IDchapter}
          />
        </TouchableRipple>
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <View
          style={[
            styles.imageWrapper,
            { width: imageSize, height: imageSize },
          ]}
        >
          <Image
            style={styles.image}
            source={{
              uri:
                dataArray[idReader]?.image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
            }}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Progress & Info */}
      <View style={styles.progressContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.chapterText}>
            {languages ? arabicCH : chapterId}
          </Text>
          <Text style={styles.reciterText}>
            {languages ? reciterAR : reciter}
          </Text>
        </View>

        <MultiSlider
          values={[position]}
          min={0}
          max={duration || 1}
          step={2}
          sliderLength={width * 0.9}
          onValuesChangeFinish={async (values) =>
            await TrackPlayer.seekTo(values[0])
          }
          selectedStyle={{ backgroundColor: Colors.blue }}
          unselectedStyle={{ backgroundColor: "#A3A8C5" }}
          trackStyle={{
            height: 4,
            transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
          }}
          containerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          customMarker={() => (
            <View
              style={{
                width: 20,
                height: 20,
                top: 2,
                right: 10,
                borderRadius: 10,
                backgroundColor: Colors.blue,
              }}
            />
          )}
        />

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Controls */}
        <View
          style={[styles.controlsContainer, { paddingHorizontal: controlPadding }]}
        >
          {/* Shuffle */}
          <TouchableRipple
            onPress={() => setShuffle(true)}
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={[
              styles.controlButton,
              { backgroundColor: shuffle ? "#5C63A3" : "transparent" },
            ]}
          >
            <MaterialIcons name="shuffle" size={30} color="white" />
          </TouchableRipple>

          {/* Previous */}
          <TouchableRipple
            onPress={playPrevious}
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={styles.iconControl}
          >
            <MaterialIcons
              name={I18nManager.isRTL ? "skip-next" : "skip-previous"}
              size={38}
              color="white"
            />
          </TouchableRipple>

          {/* Play / Pause */}
          <TouchableRipple
            onPress={togglePlayback}
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={styles.playPauseButton}
          >
            {isPlaying ? (
              <MaterialIcons name="pause" size={38} color={Colors.background} />
            ) : (
              <MaterialIcons
                name="play-arrow"
                size={35}
                color={Colors.background}
              />
            )}
          </TouchableRipple>

          {/* Next */}
          <TouchableRipple
            onPress={playNext}
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={styles.iconControl}
          >
            <MaterialIcons
              name={I18nManager.isRTL ? "skip-previous" : "skip-next"}
              size={38}
              color="white"
            />
          </TouchableRipple>

          {/* Repeat */}
          <TouchableRipple
            onPress={() => setShuffle(false)}
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={[
              styles.controlButton,
              { backgroundColor: !shuffle ? "#5C63A3" : "transparent" },
            ]}
          >
            <MaterialIcons name="repeat" size={30} color="white" />
          </TouchableRipple>
        </View>
      </View>

      <LinearGradient
        colors={["transparent", "#181A3C", "rgba(0,0,0,1)"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 2 }}
      />
    </SafeAreaView>
  );
};

export default Modals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    backgroundColor: Colors.barbottom,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderColor: Colors.blue,
    borderRadius: 10,
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
    color: "#D1D5DB",
    fontSize: 16,
  },
  progressContainer: {
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "90%",
  },
  timeText: {
    color: Colors.textGray,
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
  },
  playPauseButton: {
    backgroundColor: Colors.blue,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 90,
  },
  controlButton: {
    padding: 9,
    alignItems: "center",
    borderRadius: 50,
  },
  iconControl: {
    borderRadius: 50,
    padding: 10,
  },
  gradient: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
    bottom: 0,
  },
});
