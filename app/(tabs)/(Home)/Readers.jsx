import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  TouchableOpacity,
  StatusBar,
  I18nManager,
  View,
  Text,
  Animated,
  ImageBackground,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import Read from "../../../components/Read";
import Details from "../../../components/Details";
import Listen from "../../../components/Listen";
import { fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { TouchableRipple } from "react-native-paper";
import TogglePlayReader from "../../../components/TogglePlayReader";
import Lineargradient from "../../../components/LinearGradient";
import Goback from "../../../components/Goback";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";

const Readers = () => {
  const { width, height } = useWindowDimensions();

  const HEADER_MAX_HEIGHT = height * 0.65;
  const HEADER_MIN_HEIGHT = height * 0.3;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const scrollY = useRef(new Animated.Value(0)).current;

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: I18nManager.isRTL ? [-500, 0] : [500, 0],
    extrapolate: "clamp",
  });

  const smallHeaderOpacity = scrollY.interpolate({
    inputRange: [Math.max(0, HEADER_SCROLL_DISTANCE - 24), HEADER_SCROLL_DISTANCE + 48],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const params = useLocalSearchParams();
  const { name, Chapterid, chapter_arab } = params;

  const {
    isPlaying,
    languages,
    togglePlayback,
    playTrack,
    loading,
  } = useGlobalContext();

  const [activeButton, setActiveButton] = useState("button1");
  const [searchQuery, setSearchQuery] = useState("");
  const [quranData, setQuranData] = useState([]);
  const flashListRef = useRef(null);
  const handleScrollToTopTracking = useScrollToTop(flashListRef);

  useEffect(() => {
    let isCurrent = true;
    const getReciters = async () => {
      try {
        const data = await fetchSuwar();
        const uniqueReciters = new Map();
        const processRecitations = (recitations = []) => {
          recitations.forEach((reciter) => {
            if (!reciter?.id || reciter.status === "inactive") return;
            if (!uniqueReciters.has(reciter.id)) uniqueReciters.set(reciter.id, reciter);
          });
        };
        processRecitations(data?.recitations);
        processRecitations(NewData.recitations);

        const reciters = Array.from(uniqueReciters.values())
          .filter((item) => item.id !== 8)
          .sort((a, b) => a.id - b.id)
          .map((item, index) => ({ ...item, position: index + 1 }));

        if (isCurrent) setQuranData(reciters);
      } catch (error) {
        console.error("Error fetching reciters:", error);
      }
    };
    getReciters();
    return () => { isCurrent = false; };
  }, []);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (query.length < 2) return [];
    return quranData.filter((item) =>
      item.reciter_name?.toLocaleLowerCase().includes(query) ||
      item.translated_name?.name?.toLocaleLowerCase().includes(query)
    );
  }, [quranData, searchQuery]);

  const handleButtonPress = (button) => setActiveButton(button);

  const getBackgroundColor = (button) =>
    activeButton === button ? "#00D1FF" : "transparent";

  const playAuto = useCallback(async (reciterId, index) => {
    const selectedReciter = quranData.find((item) => item?.id === reciterId);
    playTrack(
      {
        id: reciterId,
        chapterID: Chapterid,
        chapter: name,
        chapterAr: chapter_arab,
        artist: selectedReciter?.reciter_name,
        artistAR: selectedReciter?.translated_name?.name,
        titleAR: chapter_arab,
        index,
      },
      Chapterid
    );
  }, [playTrack, quranData, Chapterid, name, chapter_arab]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <StatusBar backgroundColor="transparent" />

      {/* Small Header */}
      <Animated.View style={[styles.smallHeader, { opacity: smallHeaderOpacity }]}>
        <View style={styles.chapterSmall}>
          <View style={{ width: 210, justifyContent: "center" }}>
            <Text style={[styles.chapterTextSmall, { fontSize: 20 }]}>
              {languages ? chapter_arab : name}
            </Text>
            <Text style={{ color: Colors.textGray, fontSize: 14 }}>
              {Chapterid}/114 {languages ? `السورة` : "Chapter"}
            </Text>
          </View>
          <TogglePlayReader
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            playAuto={playAuto}
            Chapterid={Chapterid}
          />
        </View>
      </Animated.View>

      <Goback />

      <Animated.ScrollView
        ref={flashListRef}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true, listener: handleScrollToTopTracking }
        )}
      >
        <ImageBackground
          source={require("../../../assets/images/quranLogo.jpeg")}
          style={[
            styles.headerImage,
            { height: height > 700 ? 420 : 350, width: "100%" },
          ]}
        >
          <View pointerEvents="none" style={styles.heroScrim} />
          <View style={styles.imageContainer}>
            <Image
              contentFit="contain"
              source={require("../../../assets/images/quranLogo.jpeg")}
              style={{
                width: width > 700 ? 140 : 146,
                height: width > 700 ? 140 : 146,
              }}
            />
          </View>

          <View
            style={[
              styles.BotHeader,
              { paddingHorizontal: width > 768 ? 32 : 16 },
            ]}
          >
            <View style={styles.chapterName}>
              <Text numberOfLines={1} style={[styles.chapterNameText, { width: width * 0.66 }]}>
                {languages ? chapter_arab : name}
              </Text>
              <Text style={{ color: Colors.textGray, fontSize: 16 }}>
                {Chapterid}/114 {languages ? `السورة` : "Chapter"}
              </Text>
            </View>

            <TouchableRipple
              onPress={isPlaying ? togglePlayback : () => playAuto(1, Chapterid)}
              rippleColor="rgba(0, 209, 255, 0.2)"
              style={styles.playPauseButton}
              borderless
            >
              <MaterialIcons
                name={isPlaying ? "pause" : "play-arrow"}
                size={24}
                color={Colors.background}
              />
            </TouchableRipple>
          </View>

          <Lineargradient />
        </ImageBackground>

        {/* Button Group */}
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <View
            style={[
              styles.relativeView,
              { paddingHorizontal: width > 768 ? 32 : 16 },
            ]}
          >
            <View style={styles.buttonGroup}>
              {["button1", "button2", "button3"].map((btn, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.7}
                  onPress={() => handleButtonPress(btn)}
                  style={styles.button}
                >
                  <Text style={[styles.buttonText, activeButton === btn && styles.buttonTextActive]}>
                    {languages
                      ? ["استمع", "معلومات", "اقراء"][i]
                      : ["Listen", "Info", "Read"][i]}
                  </Text>
                  <View
                    style={[
                      styles.buttonUnderline,
                      { backgroundColor: getBackgroundColor(btn) },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {activeButton === "button1" && (
            <SearchBar
              title={languages ? "ابحث عن قارئ" : "Search Reciter"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredData={filteredData}
            />
          )}

          <View style={{ width: width * 0.93 }}></View>
        </View>

        {activeButton === "button1" && (
          <Listen
            chapterName={name}
            scrollY={scrollY}
            HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT}
            chapterAr={chapter_arab}
            searchQuery={searchQuery}
            filteredData={filteredData}
            languages={languages}
            Chapterid={Chapterid}
            loading={loading}
            ButtonTranslate={ButtonTranslate}
            quranData={quranData}
            showTrackSelection
          />
        )}
        {activeButton === "button2" && (
          <Details scrollY={scrollY} languages={languages} id={Chapterid} />
        )}
        {activeButton === "button3" && <Read id={Chapterid} />}
      </Animated.ScrollView>

    </View>
  );
};

const styles = {
  container: { flex: 1 },
  headerImage: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 20, 38, 0.5)",
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 100,
    elevation: 10,
    overflow: "hidden",
    borderRadius: 2,
  },
  BotHeader: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 99,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  relativeView: {
    width: "100%",
    justifyContent: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    width: "100%",
    padding: 4,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  button: {
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
  },
  buttonText: { color: Colors.textGray, fontSize: 13, fontWeight: "600" },
  buttonTextActive: { color: Colors.text },
  buttonUnderline: { width: "52%", height: 2, borderRadius: 50, marginTop: 5 },
  chapterNameText: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  playPauseButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.blue,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  chapterSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 30,
    paddingLeft: 80,
    paddingRight: 16,
    alignItems: "center",
  },
  chapterTextSmall: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    height: 108,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
};

export default Readers;
