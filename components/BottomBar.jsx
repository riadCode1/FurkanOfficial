import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Image } from "expo-image";
import { dataArray } from "@/constants/RecitersImages";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Modals from "../components/Modals";

const BottomBar = ({
  chapterId,
  setModalVisible,
  name,
  reciterAR,
  arabicCH,

  idReader,
}) => {
  const { languages, togglePlayback, isPlaying, setIsPlaying } =
    useGlobalContext();

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

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  // Handle the back button press
  useEffect(() => {
    const backAction = () => {
      if (bottomSheetRef.current) {
        handleCloseBottomSheet();
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    };

    // Add event listener for the back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener
    return () => backHandler.remove();
  }, []);

  const handleNavigate = () => {
    router.push({
      pathname: `/ReaderSurah/`,
      params: { arab_name: reciterAR, name, id: idReader },
    });
  };

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "100%"], []);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOpenBottomSheet}
        style={styles.container}
      >
        <View style={styles.row}>
          <TouchableRipple onPress={() => handleNavigate()}>
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
          </TouchableRipple>

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
          borderRadius={20}
          borderless
          style={styles.iconButton}
        >
          {isPlaying ? (
            <MaterialIcons name="pause" size={30} color="#00D1FF" />
          ) : (
            <MaterialIcons name="play-arrow" size={30} color="#00D1FF" />
          )}
        </TouchableRipple>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        overDragResistanceFactor={0}
        backgroundStyle={{ backgroundColor: Colors.background }}
        handleComponent={() => <View style={styles.handleContainer}></View>}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Modals handleCloseBottomSheet={handleCloseBottomSheet} />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    position: "absolute",
    bottom: 85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#00D1FF",
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.barbottom,
    alignSelf: "center",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  handleContainer: {
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textTab,
    borderRadius: 2,
  },
  sheetContent: {
    flex: 1,
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
    paddingHorizontal: 9,
    paddingVertical: 16,
    alignItems: "flex-start",
    width: 210,
  },
  chapterText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reciterText: {
    fontSize: 12,
    color: Colors.textGray, // Equivalent to gray-400
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",

    height: 58,
    width: 58,
  },
});

export default BottomBar;
