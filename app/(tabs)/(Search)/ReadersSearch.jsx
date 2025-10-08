import React, { useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  I18nManager,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
let { width, height } = Dimensions.get("window");
import { View, Text, Animated } from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import Read from "../../../components/Read";
import Details from "../../../components/Details";
import Listen from "../../../components/Listen";
import { fetChapterInfo, fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { TouchableRipple } from "react-native-paper";
import StyleSheet from "react-native-media-query";
import { RFValue } from "react-native-responsive-fontsize";
import { ImageBackground } from "react-native";
import Lineargradient from "../../../components/LinearGradient";
import Goback from "../../../components/Goback";
import ArrowScroll from "../../../components/ArrowScroll";

const HEADER_MAX_HEIGHT = height * 0.65;
const HEADER_MIN_HEIGHT = height * 0.3;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ReaderSearch = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 300], // Strictly increasing
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
  const router = useRouter();

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
      flashListRef.current.scrollTo({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    getReciter();
  }, []);

  //get surah info

  const getReciter = async () => {
    try {
      const data = await fetchSuwar();

      if (!data?.recitations || !NewData?.recitations) {
        console.warn("Missing recitations data");
        return;
      }

      // Create a Map to ensure unique IDs
      const uniqueReciters = new Map();

      // Helper function to process recitations
      const processRecitations = (recitations) => {
        recitations.forEach((reciter) => {
          // Skip if reciter is invalid or has inactive status
          if (!reciter?.id || reciter.status === "inactive") return;

          // Only add if ID doesn't exist
          if (!uniqueReciters.has(reciter.id)) {
            uniqueReciters.set(reciter.id, reciter);
          }
        });
      };

      // Process both data sources
      processRecitations(data.recitations);
      processRecitations(NewData.recitations);

      // Convert to array, filter, sort, and add position
      const filteredData = Array.from(uniqueReciters.values())
        .filter((item) => item.id !== 8)
        .sort((a, b) => a.id - b.id) // Sort by ID to ensure consistent order
        .map((item, index) => ({
          ...item,
          position: index + 1, // Add 1-based position number
        }));

      setQuranData(filteredData);

      // For debugging:
      console.log(
        "Processed data:",
        filteredData.map(
          (item) => `Pos: ${item.position}, ID: ${item.id}, Name: ${item.name}`
        )
      );
    } catch (error) {
      console.error("Error fetching reciters:", error);
      // Optionally set error state here
    }
  };

  const handleButtonPress = (button) => {
    setActiveButton(button);
  };

  const getBackgroundColor = (button) => {
    return activeButton === button ? "#00D1FF" : "transparent";
  };

  //search Query
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

          const combinedData = [...filteredRecitations, ...filterNewData];

          const uniqueRecitations = combinedData.filter(
            (recitation, index, self) =>
              index === self.findIndex((r) => r.id === recitation.id)
          );

          setFilteredData(uniqueRecitations);
        })
        .catch((error) => {
          console.error("Error fetching recitations: ", error);
        })
        .finally(() => {});
    }
  }, [searchQuery]);

  const playAuto = async (reciterId, index) => {
    console.log(reciterId, index);
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
    const trackList = quranData.map((data) => ({
      id: Chapterid,
      titleAR: chapter_arab,
      title: name,
      artist: quranData,
    }));
    setTrackList(trackList);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" />
      {/* Small Header */}
      <Animated.View
        style={[
          styles.smallHeader,
          {
            opacity: smallHeaderOpacity,
          },
        ]}
      >
        <View style={styles.chapterSmall}>
          <View style={{ width: 210, justifyContent: "center" }}>
            <Text
              style={[
                styles.chapterTextSmall,
                { fontSize: 20, textAlign: "left" },
              ]}
            >
              {languages ? chapter_arab : name}
            </Text>
            <Text
              style={{
                color: Colors.textGray,
                fontSize: 14,
                textAlign: "left",
              }}
            >
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
      </Animated.View>
      <Goback />

      {/* Scroll Header */}

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
          style={styles.headerImage}
        >
          <View style={[styles.imageContainer]}>
            <Image
              contentFit="contain"
              source={require("../../../assets/images/quranLogo.jpeg")}
              style={styles.image}
            />
          </View>
          <View style={styles.BotHeader}>
            <View style={styles.chapterName}>
              <Text style={[styles.chapterNameText, { textAlign: "left" }]}>
                {languages ? chapter_arab : name}
              </Text>
              <Text
                style={{
                  color: Colors.textGray,
                  fontSize: 16,
                  textAlign: "left",
                }}
              >
                {Chapterid}/114 {languages ? `السورة` : "Chapter"}
              </Text>
            </View>

            <TouchableRipple
              onPress={
                isPlaying ? togglePlayback : () => playAuto(1, Chapterid)
              }
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
          
               {/*LinearGradient */}
          <Lineargradient />
        </ImageBackground>

        {/* button group */}
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <View style={styles.relativeView}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleButtonPress("button1")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {languages ? "استمع " : "Listen"}
                </Text>
                <View
                  style={[
                    { backgroundColor: getBackgroundColor("button1") },
                    styles.buttonUnderline,
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleButtonPress("button2")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {languages ? "معلومات " : "Info"}
                </Text>
                <View
                  style={[
                    { backgroundColor: getBackgroundColor("button2") },
                    styles.buttonUnderline,
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleButtonPress("button3")}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {languages ? "اقراء " : "Read"}
                </Text>
                <View
                  style={[
                    { backgroundColor: getBackgroundColor("button3") },
                    styles.buttonUnderline,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {activeButton === "button2" || activeButton === "button3" ? (
            <View style={{}}></View>
          ) : (
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
          {
            transform: [{ translateX: ButtonTranslate }],
          },
        ]}
      >
        <ArrowScroll scrollToTop={scrollToTop} />
      </Animated.View>
    </View>
  );
};

const { styles } = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  headerImage: {
    width: "100%",
    height: 366,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  imageContainer: {
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 100,
    elevation: 10,
    width: 146,
    height: 146,
    overflow: "hidden",
    borderRadius: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    elevation: 100,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",

    "@media (min-width: 700px)": {
      width: 140,
      height: 146,
    },
    // Match borderRadius of the container for consistent rounding
  },
  BotHeader: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 99,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",

    "@media (min-width: 768px)": {
      paddingHorizontal: 32,
    },
  },

  relativeView: {
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    paddingHorizontal: 16,
    "@media (min-width: 768px)": {
      paddingHorizontal: 32,
    },
  },

  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",

    bottom: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: Colors.textGray,
    marginBottom: 8,
  },

  buttonUnderline: {
    width: RFValue(112),
    height: 1,
    borderRadius: 50,
  },

  chapterNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    width: width * 0.6,
  },
  playPauseButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.barbottom,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  playPauseButtonSmall: {
    width: 48,
    height: 48,
    backgroundColor: "#454B8C",
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
    "@media (min-width: 768px)": {
      paddingRight: 32,
      paddingLeft: 100,
    },
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
});

export default ReaderSearch;
