import React, { useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  I18nManager,
  View,
  Text,
  Animated,
  ImageBackground,
  useWindowDimensions,
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
import { RFValue } from "react-native-responsive-fontsize";
import TogglePlayReader from "../../../components/TogglePlayReader";
import Lineargradient from "../../../components/LinearGradient";
import Goback from "../../../components/Goback";
import ArrowScroll from "../../../components/ArrowScroll";

const ReaderSearch = () => {
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
    inputRange: [
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
      RFValue(350),
    ],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  const params = useLocalSearchParams();
  const { name, Chapterid, chapter_arab } = params;

  const {
    isPlaying,
    languages,
    setTrackList,
    togglePlayback,
    playTrack,
    loading,
  } = useGlobalContext();

  const [activeButton, setActiveButton] = useState("button1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [quranData, setQuranData] = useState([]);
  const flashListRef = useRef(null);

  const scrollToTop = () => {
    if (flashListRef.current) {
      flashListRef?.current?.scrollTo({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    getReciter();
  }, []);

  const getReciter = async () => {
    try {
      const data = await fetchSuwar();

      const uniqueReciters = new Map();
      const processRecitations = (recitations) => {
        recitations.forEach((reciter) => {
          if (!reciter?.id || reciter.status === "inactive") return;
          if (!uniqueReciters.has(reciter.id)) {
            uniqueReciters.set(reciter.id, reciter);
          }
        });
      };

      processRecitations(data.recitations);
      processRecitations(NewData.recitations);

      const filtered = Array.from(uniqueReciters.values())
        .filter((item) => item.id !== 8)
        .sort((a, b) => a.id - b.id)
        .map((item, index) => ({
          ...item,
          position: index + 1,
        }));

      setQuranData(filtered);
    } catch (error) {
      console.error("Error fetching reciters:", error);
    }
  };

  const handleButtonPress = (button) => setActiveButton(button);

  const getBackgroundColor = (button) =>
    activeButton === button ? "#00D1FF" : "transparent";

  useEffect(() => {
    if (searchQuery.length > 1) {
      fetchSuwar(searchQuery)
        .then((suwarData) => {
          const filteredRecitations = suwarData.recitations.filter(
            (item) =>
              item.reciter_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.translated_name.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
          const filterNewData = NewData.recitations.filter(
            (item) =>
              item.reciter_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.translated_name.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
          const combined = [...filteredRecitations, ...filterNewData];
          const unique = combined.filter(
            (recitation, index, self) =>
              index === self.findIndex((r) => r.id === recitation.id)
          );
          setFilteredData(unique);
        })
        .catch(console.error);
    }
  }, [searchQuery]);

  const playAuto = async (reciterId, index) => {
    playTrack(
      {
        id: reciterId,
        chapterID: Chapterid,
        chapter: name,
        chapterAr: chapter_arab,
        artist: quranData.find((r) => r?.id === reciterId)?.reciter_name,
        artistAR: quranData.find((r) => r?.id === reciterId)?.translated_name
          .name,
        titleAR: chapter_arab,
        index,
      },
      Chapterid
    );
    setTrackList(
      quranData.map((data) => ({
        id: Chapterid,
        titleAR: chapter_arab,
        title: name,
        artist: quranData,
      }))
    );
  };

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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <ImageBackground
          source={require("../../../assets/images/quranLogo.jpeg")}
          blurRadius={20}
          style={[
            styles.headerImage,
            { height: height > 700 ? 400 : 300, width: "100%" },
          ]}
        >
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
              <Text style={[styles.chapterNameText, { width: width * 0.6 }]}>
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
                color={Colors.blue}
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
                  <Text style={styles.buttonText}>
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
          />
        )}
        {activeButton === "button2" && (
          <Details scrollY={scrollY} languages={languages} id={Chapterid} />
        )}
        {activeButton === "button3" && <Read id={Chapterid} />}
      </Animated.ScrollView>

      <Animated.View
        style={[
          { transform: [{ translateX: ButtonTranslate }] },
        ]}
      >
        <ArrowScroll scrollToTop={scrollToTop} />
      </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    bottom: 10,
  },
  button: { justifyContent: "center", alignItems: "center" },
  buttonText: { color: Colors.textGray, marginBottom: 8 },
  buttonUnderline: { width: RFValue(112), height: 1, borderRadius: 50 },
  chapterNameText: { color: "white", fontSize: 20, fontWeight: "bold" },
  playPauseButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.barbottom,
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



export default ReaderSearch;
