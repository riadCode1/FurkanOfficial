import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import { getReciterImage } from "../constants/reciterArtwork";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Modals from "../components/Modals";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";

const BottomBar = ({
  chapterId,
  setModalVisible,
  name,
  reciterAR,
  arabicCH,
  idReader,
  onSheetChange,
}) => {
  const { languages, togglePlayback, isPlaying, setIsPlaying } =
    useGlobalContext();

  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const snapPoints = useMemo(() => [height], [height]);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (sheetOpen) {
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
  }, [handleCloseBottomSheet, sheetOpen]);

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
  const bottomB = (width >= 768 ? 90 : 80) + 14;

  return (
    <>
      {sheetOpen && (
        <StatusBar style="light" backgroundColor="transparent" translucent />
      )}
      <SafeAreaView
        style={{ position: "absolute", left: 0, right: 0, bottom: bottomB }}
      >
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          onPress={handleOpenBottomSheet}
          style={styles.container}
          borderless
        >
          <View style={styles.row}>
            <BlurView
              pointerEvents="none"
              intensity={82}
              tint="dark"
              style={styles.blurBackground}
            />
            <TouchableRipple onPress={handleNavigate}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{
                  uri: getReciterImage(idReader)
                    ? getReciterImage(idReader)
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
                  }}
                  contentFit="cover"
                />
              </View>
            </TouchableRipple>

            <View style={styles.playText}>
              <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.chapterText}>
                  {languages ? arabicCH : chapterId}
                </Text>
                <Text numberOfLines={1} style={styles.reciterText}>
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
                <MaterialIcons
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={28}
                  color={Colors.background}
                />
              </TouchableRipple>
            </View>
          </View>
        </TouchableRipple>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        topInset={0}
        bottomInset={0}
        onChange={(index) => {
          const isOpen = index >= 0;
          setSheetOpen(isOpen);
          setModalVisible(isOpen);
          onSheetChange?.(isOpen);
        }}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        overDragResistanceFactor={0}
        enableOverDrag={false}
        backgroundStyle={styles.sheetBackground}
        handleComponent={null}
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
    marginHorizontal: 10,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.24)",
    backgroundColor: "rgba(7, 20, 38, 0.78)",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(52, 53, 68, 0.3)",
  },
  sheetBackground: {
    backgroundColor: "#121212",
    borderRadius: 0,
  },
  sheetContent: {
    flex: 1,
    height: "100%",
  },
  imageContainer: {
    width: 48,
    height: 48,
    marginStart: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  chapterText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "600",
  },
  reciterText: {
    fontSize: 11,
    color: Colors.textGray,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: Colors.blue,
    marginHorizontal: 10,
  },
  playText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
});

export default BottomBar;
