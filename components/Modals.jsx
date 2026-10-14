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
<<<<<<< HEAD
import { images } from "../constants/images";
import { getReciterImage } from "../constants/reciterArtwork";
=======
import { dataArray } from "../constants/RecitersImages";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
import { Image } from "expo-image";
import ImageColors from "react-native-image-colors";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const Modals = ({ handleCloseBottomSheet }) => {
  const {
    setModalVisible,
    chapterId,
<<<<<<< HEAD
=======
    duration,
    position,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
  const { width, height } = useWindowDimensions();
=======
  const { width } = useWindowDimensions();
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

  // Fetch dominant image color
  useEffect(() => {
    const fetchColors = async () => {
<<<<<<< HEAD
      const uri = getReciterImage(idReader);
=======
      const uri = dataArray[idReader]?.image;
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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

<<<<<<< HEAD
  const imageSize = Math.min(width * (width > 700 ? 0.58 : 0.82), height * 0.39, 360);
  const controlPadding = width > 768 ? 80 : 12;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient
        pointerEvents="none"
        colors={[backgroundColor, "#121212", "#121212"]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />
=======
  const imageSize = width > 700 ? width * 0.6 : width * 0.85;
  const controlPadding = width > 768 ? 200 : 16;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingHorizontal: width > 768 ? 32 : 16 },
        ]}
      >
<<<<<<< HEAD
        <Image
          source={images.trackPlayerIcon}
          style={styles.headerLogo}
          contentFit="contain"
          accessibilityLabel="App logo"
        />

        <Text style={styles.nowPlayingLabel}>{languages ? "قيد التشغيل" : "NOW PLAYING"}</Text>

=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        <TouchableRipple
          onPress={handleCloseBottomSheet}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless
<<<<<<< HEAD
          accessibilityLabel="Close player"
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </TouchableRipple>
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
                getReciterImage(idReader) ||
=======
                dataArray[idReader]?.image ||
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
            }}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Progress & Info */}
      <View style={styles.progressContainer}>
<<<<<<< HEAD
        <View style={styles.trackInfoRow}>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={[styles.chapterText, { textAlign: languages ? "right" : "left" }]}>
              {languages ? arabicCH : chapterId}
            </Text>
            <Text numberOfLines={1} style={styles.reciterText}>
              {languages ? reciterAR : reciter}
            </Text>
          </View>
          <View style={styles.menuActions}>
            <Dropmenu
              chapter={chapterId}
              reciterName={reciter}
              reciterID={idReader}
              arabName={reciterAR}
              chapterAr={arabicCH}
              chapteID={IDchapter}
            />
          </View>
        </View>

        <MultiSlider
          values={[progress.position]}
          min={0}
          max={progress.duration || 1}
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          step={2}
          sliderLength={width * 0.9}
          onValuesChangeFinish={async (values) =>
            await TrackPlayer.seekTo(values[0])
          }
          selectedStyle={{ backgroundColor: Colors.blue }}
          unselectedStyle={{ backgroundColor: "#A3A8C5" }}
          trackStyle={{
            height: 4,
            transform: [{ scaleX: I18nManager.isRTL ? 0.91 : 0.91 }],
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
                borderRadius: 10,
<<<<<<< HEAD
              backgroundColor: Colors.blue,
=======
                backgroundColor: Colors.blue,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
              }}
            />
          )}
        />

        <View style={styles.timeContainer}>
<<<<<<< HEAD
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
=======
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        </View>

        {/* Controls */}
        <View
          style={[styles.controlsContainer, { paddingHorizontal: controlPadding }]}
        >
          {/* Shuffle */}
          <TouchableRipple
<<<<<<< HEAD
            onPress={() => setShuffle((enabled) => !enabled)}
=======
            onPress={() => setShuffle(true)}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={[
              styles.controlButton,
<<<<<<< HEAD
              { backgroundColor: "transparent" },
            ]}
          >
            <MaterialIcons name="shuffle" size={28} color={shuffle ? Colors.blue : Colors.textGray} />
=======
              { backgroundColor: shuffle ? "#5C63A3" : "transparent" },
            ]}
          >
            <MaterialIcons name="shuffle" size={30} color="white" />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          </TouchableRipple>

          {/* Previous */}
          <TouchableRipple
            onPress={playPrevious}
<<<<<<< HEAD
            accessibilityLabel="Previous surah"
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
            accessibilityLabel="Next surah"
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
              { backgroundColor: "transparent" },
            ]}
          >
            <MaterialIcons name="repeat" size={28} color={!shuffle ? Colors.blue : Colors.textGray} />
=======
              { backgroundColor: !shuffle ? "#5C63A3" : "transparent" },
            ]}
          >
            <MaterialIcons name="repeat" size={30} color="white" />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          </TouchableRipple>
        </View>
      </View>

<<<<<<< HEAD
=======
      <LinearGradient
        colors={["transparent", "#181A3C", "rgba(0,0,0,1)"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 2 }}
      />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </SafeAreaView>
  );
};

export default Modals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    paddingTop: 2,
    backgroundColor: "#121212",
  },
  header: {
    width: "100%",
    marginBottom: 18,
=======
    paddingTop: 8,
  },
  header: {
    width: "100%",
    marginBottom: 20,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
    backgroundColor: "rgba(236, 237, 238, 0.1)",
  },
  headerLogo: { width: 44, height: 44 },
  nowPlayingLabel: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  headerSpacer: { width: 44, height: 44 },
  menuActions: {
    width: 88,
    height: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  imageWrapper: {
    alignItems: "center",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    elevation: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
=======
    backgroundColor: Colors.barbottom,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    alignItems: "center",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
  image: {
    width: "100%",
    height: "100%",
<<<<<<< HEAD
    borderRadius: 18,
  },
  trackInfoRow: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
    paddingEnd: 8,
  },
  chapterText: {
    color: Colors.text,
=======
    borderColor: Colors.blue,
    borderRadius: 10,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  chapterText: {
    color: "white",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    fontSize: 24,
    fontWeight: "bold",
  },
  reciterText: {
<<<<<<< HEAD
    color: Colors.textGray,
    fontSize: 16,
    marginTop: 5,
  },
  progressContainer: {
    alignItems: "center",
    paddingTop: 4,
=======
    color: "#D1D5DB",
    fontSize: 16,
  },
  progressContainer: {
    alignItems: "center",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
<<<<<<< HEAD
    marginBottom: 12,
=======
    marginBottom: 16,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
    marginTop: 6,
  },
  playPauseButton: {
    backgroundColor: Colors.blue,
    width: 72,
    height: 72,
=======
    marginTop: 12,
  },
  playPauseButton: {
    backgroundColor: Colors.blue,
    width: 64,
    height: 64,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
=======
  gradient: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
    bottom: 0,
  },
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
});
