import {
  View,
  Text,
<<<<<<< HEAD
  BackHandler,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import { getReciterImage } from "../constants/reciterArtwork";
=======
  TouchableOpacity,
  BackHandler,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Image, ImageBackground } from "expo-image";
import { dataArray } from "@/constants/RecitersImages";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Modals from "../components/Modals";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< HEAD
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

const BottomBar = ({
  chapterId,
  setModalVisible,
  name,
  reciterAR,
  arabicCH,
  idReader,
<<<<<<< HEAD
  onSheetChange,
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
}) => {
  const { languages, togglePlayback, isPlaying, setIsPlaying } =
    useGlobalContext();

  const bottomSheetRef = useRef(null);
<<<<<<< HEAD
  const { width, height } = useWindowDimensions();
  const snapPoints = useMemo(() => [height], [height]);
  const [sheetOpen, setSheetOpen] = useState(false);
=======
  const snapPoints = useMemo(() => [0.1, "100%"], []);
  const { width } = useWindowDimensions();
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

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

<<<<<<< HEAD
  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
=======
  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
<<<<<<< HEAD
      if (sheetOpen) {
=======
      if (bottomSheetRef.current) {
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
  }, [handleCloseBottomSheet, sheetOpen]);
=======
  }, []);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

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
<<<<<<< HEAD
  const bottomB = (width >= 768 ? 90 : 80) + 14;

  return (
    <>
      {sheetOpen && (
        <StatusBar style="light" backgroundColor="transparent" translucent />
      )}
      <SafeAreaView
        style={{ position: "absolute", left: 0, right: 0, bottom: bottomB }}
      >
=======
  const playTextWidth = width >= 700 ? "90%" : "82%";
   const bottomB = width >= 768 ? 90 : 80;

  return (
    <>
      <SafeAreaView style={{ position: "absolute", bottom: bottomB }}>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          onPress={handleOpenBottomSheet}
          style={styles.container}
          borderless
        >
          <View style={styles.row}>
<<<<<<< HEAD
            <BlurView
              pointerEvents="none"
              intensity={82}
              tint="dark"
              style={styles.blurBackground}
            />
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
            <TouchableRipple onPress={handleNavigate}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{
<<<<<<< HEAD
                  uri: getReciterImage(idReader)
                    ? getReciterImage(idReader)
=======
                    uri: dataArray[idReader]?.image
                      ? dataArray[idReader]?.image
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
                  }}
                  contentFit="cover"
                />
              </View>
            </TouchableRipple>

<<<<<<< HEAD
            <View style={styles.playText}>
              <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.chapterText}>
                  {languages ? arabicCH : chapterId}
                </Text>
                <Text numberOfLines={1} style={styles.reciterText}>
=======
            <View style={[styles.playText, { width: playTextWidth }]}>
              <View style={styles.textContainer}>
                <Text style={styles.chapterText}>
                  {languages ? arabicCH : chapterId}
                </Text>
                <Text style={styles.reciterText}>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
                <MaterialIcons
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={28}
                  color={Colors.background}
                />
=======
                {isPlaying ? (
                  <MaterialIcons name="pause" size={30} color={Colors.blue} />
                ) : (
                  <MaterialIcons name="play-arrow" size={30} color={Colors.blue} />
                )}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
              </TouchableRipple>
            </View>
          </View>
        </TouchableRipple>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
<<<<<<< HEAD
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
=======
        snapPoints={snapPoints}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        overDragResistanceFactor={0}
        enableOverDrag={false}
<<<<<<< HEAD
        backgroundStyle={styles.sheetBackground}
        handleComponent={null}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Modals handleCloseBottomSheet={handleCloseBottomSheet} />
        </BottomSheetView>
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    marginHorizontal: 10,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.24)",
    backgroundColor: "rgba(7, 20, 38, 0.78)",
    alignSelf: "stretch",
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
<<<<<<< HEAD
    height: "100%",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(52, 53, 68, 0.3)",
  },
  sheetBackground: {
    backgroundColor: "#121212",
    borderRadius: 0,
=======
  },
  handleContainer: {
    alignItems: "center",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
  sheetContent: {
    flex: 1,
    height: "100%",
  },
  imageContainer: {
<<<<<<< HEAD
    width: 48,
    height: 48,
    marginStart: 8,
    borderRadius: 12,
    overflow: "hidden",
=======
    width: 60,
    height: 60,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
  image: {
    width: "100%",
    height: "100%",
<<<<<<< HEAD
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
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    color: Colors.textGray,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
<<<<<<< HEAD
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
=======
    height: 58,
    width: 58,
  },
  playText: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
});

export default BottomBar;
