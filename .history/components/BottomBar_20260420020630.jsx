import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Image, ImageBackground } from "expo-image";
import { dataArray } from "@/constants/RecitersImages";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Modals from "../components/Modals";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [0.1, "100%"], []);
  const { width } = useWindowDimensions();

  // Handle remote play/pause events
  useEffect(() => {
    const playListener = TrackPlayer.addEventListener("remote-play", () => {
      setIsPlaying(true);
    });

    const pauseListener = TrackPlayer.addEventListener("remote-pause", () => {
      setIsPlaying(false);
    });

    return () => {
      playListener.remove();
      pauseListener.remove();
    };
  }, []);

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (bottomSheetRef.current) {
        handleCloseBottomSheet();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleNavigate = () => {
    router.push({
      pathname: `/ReaderSurah/`,
      params: { arab_name: reciterAR, name, id: idReader },
    });
  };

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // Responsive width adjustment (was media query)
  const playTextWidth = width >= 700 ? "90%" : "82%";
   const bottomB = width >= 768 ? 90 : 80;

  return (
    <>
      <SafeAreaView style={{ position: "absolute", bottom: bottomB }}>
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          onPress={handleOpenBottomSheet}
          style={styles.container}
          borderless
        >
          <View style={styles.row}>
            <TouchableRipple onPress={handleNavigate}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: dataArray[idReader]?.image
                      ? dataArray[idReader]?.image
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
                  }}
                  contentFit="cover"
                />
              </View>
            </TouchableRipple>

            <View style={[styles.playText, { width: playTextWidth }]}>
              <View style={styles.textContainer}>
                <Text style={styles.chapterText}>
                  {languages ? arabicCH : chapterId}
                </Text>
                <Text style={styles.reciterText}>
                  {languages ? reciterAR : name}
                </Text>
              </View>

              <TouchableRipple
                rippleColor="rgba(200, 200, 200, 0.1)"
                onPress={togglePlayback}
                borderRadius={20}
                borderless
                style={styles.iconButton}
              >
                {isPlaying ? (
                  <MaterialIcons name="pause" size={30} color={Colors.blue} />
                ) : (
                  <MaterialIcons name="play-arrow" size={30} color={Colors.blue} />
                )}
              </TouchableRipple>
            </View>
          </View>
        </TouchableRipple>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        overDragResistanceFactor={0}
        enableOverDrag={false}
        handleComponent={() => <View style={styles.handleContainer} />}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            overflow: "hidden",
            backgroundColor: Colors.background,
          }}
        >
          <BottomSheetView style={styles.sheetContent}>
            <Modals handleCloseBottomSheet={handleCloseBottomSheet} />
          </BottomSheetView>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 3,
    borderColor: Colors.blue,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.barbottom,
    alignSelf: "center",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  handleContainer: {
    alignItems: "center",
  },
  sheetContent: {
    flex: 1,
    height: "100%",
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
  },
  chapterText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reciterText: {
    fontSize: 12,
    color: Colors.textGray,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 58,
    width: 58,
  },
  playText: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BottomBar;
