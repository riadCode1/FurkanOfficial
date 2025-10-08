import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  I18nManager,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
import TrackPlayer, { useProgress } from "react-native-track-player";
import StyleSheet from "react-native-media-query";
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../context/GlobalProvider";
import Dropmenu from "./Dropmenu";
import { Colors } from "../constants/Colors";
import { dataArray } from "../constants/RecitersImages";
import { Image } from "expo-image";
let { width } = Dimensions.get("window");
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

  // color change
  useEffect(() => {
    const fetchColors = async () => {
      const uri = dataArray[idReader]?.image;

      if (uri) {
        try {
          const result = await ImageColors.getColors(uri, {
            fallback: "#191A3C",
            cache: true,
            key: idReader.toString(), // optional, for better caching
          });

          if (result.platform === "android") {
            setBackgroundColor(result.dominant || Colors.background);
          } else {
            setBackgroundColor(result.background || Colors.background);
          }
        } catch (error) {
          console.warn("Failed to fetch image colors:", error);
          setBackgroundColor(Colors.background);
        }
      }
    };

    fetchColors();
  }, [idReader]);

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
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableRipple
          onPress={handleCloseBottomSheet}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless={true}
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </TouchableRipple>

        <TouchableRipple
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless={true}
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

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
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
      </View>

      {/* Progress bar and time display */}
      <View style={styles.progressContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.chapterText}>
            {languages ? arabicCH : chapterId}
          </Text>
          <Text style={styles.reciterText}>
            {languages ? reciterAR : reciter}
          </Text>
        </View>

        {/* Slider for progress */}
        <MultiSlider
          values={[position]}
          min={0}
          max={duration || 1}
          step={2}
          containerStyle={{
            alignItems:"center",justifyContent:"center"
          }}
          sliderLength={Dimensions.get("window").width * 0.9} // Same as your 90% width
          onValuesChangeFinish={async (values) => {
            await TrackPlayer.seekTo(values[0]);
          }}
          selectedStyle={{ backgroundColor: Colors.blue }}
          unselectedStyle={{ backgroundColor: "#A3A8C5" }}
          trackStyle={{
            height: 4,
            transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }], // ✅ RTL support
          }}
          customMarker={() => (
            <View
              style={{
                width: 20, // ✅ Custom thumb size
                height: 20,
                top:2,
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

        {/* control */}

        <View style={styles.controlsContainer}>
          <TouchableRipple
            onPress={handleShuffle}
            borderless
            rippleColor="rgba(255, 255, 255, 0.3)"
            style={{
              backgroundColor: shuffle === true ? "#5C63A3" : "transparent",
              padding: 9,
              alignItems: "center",
              borderRadius: 50,
            }}
          >
            <MaterialIcons name="shuffle" size={30} color="white" />
          </TouchableRipple>

        <TouchableRipple
  onPress={playPrevious}
  borderless
  style={{borderRadius:50,padding:10}}
  rippleColor="rgba(255, 255, 255, 0.3)"
>
  <MaterialIcons
    name={I18nManager.isRTL ? "skip-next" : "skip-previous"}
    size={38}
    color="white"
  />
</TouchableRipple>

<TouchableRipple
  onPress={togglePlayback}
  borderless
  rippleColor="rgba(255, 255, 255, 0.3)"
  style={styles.playPauseButton}
>
  {isPlaying ? (
    <MaterialIcons name="pause" size={38} color={Colors.background} />
  ) : (
    <MaterialIcons name="play-arrow" size={35} color={Colors.background} />
  )}
</TouchableRipple>

<TouchableRipple
  onPress={playNext}
  borderless
  rippleColor="rgba(255, 255, 255, 0.3)"
   style={{borderRadius:50,padding:10}}
>
  <MaterialIcons
    name={I18nManager.isRTL ? "skip-previous" : "skip-next"}
    size={38}
    color="white"
  />
</TouchableRipple>

<TouchableRipple
  onPress={handlerepeat}
  borderless
  rippleColor="rgba(255, 255, 255, 0.3)"
  style={{
    backgroundColor: shuffle === false ? "#5C63A3" : "transparent",
    padding: 5,
    alignItems: "center",
    borderRadius: 50,
  }}
>
  <MaterialIcons name="repeat" size={30} color="white" />
</TouchableRipple>
        </View>
      </View>

      <LinearGradient
        colors={["transparent", "#181A3C", "rgba(0,0,0,1)"]}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
          bottom: 0,
        }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 2 }}
      />
    </SafeAreaView>
  );
};

const { styles } = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    "@media (min-width: 768px)": {
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
    backgroundColor: Colors.barbottom,
  },

  saveButton: {
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
    width: width * 0.85,
    height: width * 0.85,
    alignItems: "center",
    "@media (min-width: 700)": {
      height: width * 0.55,
      width: width * 0.8,
    },
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
    zIndex: 999,
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
  slider: {
    width: "90%",
  },

  timeContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
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
    paddingHorizontal: 16,
    width: "100%",

    "@media (min-width: 768px)": {
      paddingHorizontal: 200,
    },
  },
  playPauseButton: {
    backgroundColor: Colors.blue,
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
