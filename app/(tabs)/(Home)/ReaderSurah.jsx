import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  TouchableOpacity,
  Dimensions,
  StatusBar,
  I18nManager,
 
} from "react-native";
import StyleSheet from "react-native-media-query";
import { router, useGlobalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
let { width, height } = Dimensions.get("window");
import { View, Text, Animated } from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { fetchAudio, fetchChater } from "../../API/QuranApi";
import { dataArray } from "../../../constants/RecitersImages";
import SuratReader from "../../../components/SuratReader";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/noImage";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import TogglePlay from "../../../components/TogglePlay";
import Lineargradient from "../../../components/LinearGradient";
import Goback from "../../../components/Goback";
import ArrowScroll from "../../../components/ArrowScroll";
import { Image, ImageBackground } from "expo-image";

const HEADER_MAX_HEIGHT = 420;
const HEADER_MIN_HEIGHT = height * 0.25;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ReaderSurah = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const smallHeaderOpacity = scrollY.interpolate({
    inputRange: [
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
      RFValue(350),
    ],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 300], // Strictly increasing
    outputRange: I18nManager.isRTL ? [-500, 0] : [500, 0],
    extrapolate: "clamp",
  });

  const params = useGlobalSearchParams();
  const { arab_name, name, id } = params;

  const {
    languages,
    setIsPlaying,
    isPlaying,
    setIDchapter,
    playTrack,
    setTrackList,
    color2,
    togglePlayback,
    loading,
    setloading,
  } = useGlobalContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [dataAudio, setDataAudio] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const flashListRef = useRef(null);
  const [chapters, setchapters] = useState([]);

  const scrollToTop = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollTo({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    getChapter();
    fetchAudioUrl(id);

    if (searchQuery.length > 1) {
      fetchChater(searchQuery)
        .then((suwarData) => {
          const filteredRecitations = suwarData.chapters.filter(
            (item) =>
              item.name_simple
                ?.toLowerCase()
                ?.includes(searchQuery.toLowerCase()) ||
              item.name_arabic
                ?.toLowerCase()
                ?.includes(searchQuery.toLowerCase())
          );

          setFilteredData(filteredRecitations);
        })
        .catch((error) => {
          console.error("Error fetching recitations: ", error);
        });
    }
  }, [languages, searchQuery, id, color2, loading]);

  const getChapter = async () => {
    try {
      const data = await fetchChater();
      if (data && data.chapters) {
        setchapters(data.chapters);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const fetchAudioUrl = async (id) => {
    try {
      const data = await fetchAudio(id);
      if (data && data.audio_files) {
        setDataAudio(data.audio_files);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
    }
  };

  //playSound

  const playSound = (
    uri,
    trackId,
    chapterName,
    names,
    arabName,
    Id,
    arabicCh
  ) => {
    console.log(trackId);
    playTrack(
      {
        id: Id,
        url: uri,
        title: chapters,
        artist: names,
        artistAR: arabName,
        chapterID: trackId,
      },
      trackId
    );

    const trackList = dataAudio.map((data) => ({
      id: id,
      title: chapters,
      artist: name,
      artistAR: arab_name,
    }));
    setTrackList(trackList);
  };
  const playAuto = (
    uri,
    trackId,
    chapterName,
    names,
    arabName,
    Id,
    arabicCh
  ) => {
    playTrack(
      {
        id: Id,
        url: uri,
        title: chapters,
        artist: names,
        artistAR: arabName,
        chapterID: trackId,
      },
      1
    );

    const trackList = dataAudio.map((data) => ({
      id: id,
      title: chapters,
      artist: name,
      artistAR: arab_name,
    }));
    setTrackList(trackList);
  };

  //  Memoizing filtered data
  const memoizedFilteredData = useMemo(() => {
    return filteredData;
  }, [filteredData]);

  //  Memoizing chapters list
  const memoizedChapters = useMemo(() => {
    return chapters;
  }, [chapters]);

  // render FlatlistHeader

  const renderHeader = useMemo(() => {
    return (
      <>
        {/* Background Image */}
        <ImageBackground
          source={{
            uri: dataArray[id]?.image ? dataArray[id]?.image : images.image,
          }}
          blurRadius={20}
          style={styles.headerImage}
        >
          <View style={styles.imageContainer}>
            <Image
              contentFit="cover"
              source={{
                uri: dataArray[id]?.image ? dataArray[id]?.image : images.image,
              }}
              style={styles.image}
            />
          </View>

          <View style={styles.BotHeader}>
            <View style={{ width: 285 }}>
              <Text style={[styles.chapterNameText, { textAlign: "left" }]}>
                {languages ? arab_name : name}
              </Text>
              <Text
                style={{
                  color: Colors.textGray,
                  fontSize: 16,
                  textAlign: "left",
                }}
              >
                114 {languages ? "سورة" : "Surah"}
              </Text>
            </View>

            <TogglePlay
              isPlaying={isPlaying}
              playAuto={playAuto}
              togglePlayback={togglePlayback}
              name={name}
              id={id}
              arab_name={arab_name}
              dataAudio={dataAudio}
            />
          </View>

          <Lineargradient />
        </ImageBackground>

        {/* Search bar */}
        <View style={{ alignItems: "center", marginTop: 24, marginBottom: 16 }}>
          <SearchBar
            title={languages ? "ابحث عن سورة" : "Search Chapter"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredData={memoizedFilteredData}
          />
        </View>
      </>
    );
  }, [id, languages, searchQuery, memoizedFilteredData, isPlaying, dataAudio]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" />

      {/* Small Header */}
      <Animated.View
        style={[styles.smallHeader, { opacity: smallHeaderOpacity }]}
      >
        <View style={styles.chapterSmall}>
          <View style={{ width: 200 }}>
            <Text style={[styles.chapterTextSmall, { fontSize: 20 }]}>
              {languages
                ? arab_name?.length > 15
                  ? arab_name.slice(0, 15) + "..."
                  : arab_name
                : name?.length > 15
                ? name.slice(0, 15) + "..."
                : name}
            </Text>
            <Text style={{ color: Colors.textGray, fontSize: 14 }}>
              114 {languages ? "سورة" : "Surah"}
            </Text>
          </View>

          <TogglePlay
            isPlaying={isPlaying}
            playAuto={playAuto}
            togglePlayback={togglePlayback}
            name={name}
            id={id}
            arab_name={arab_name}
            dataAudio={dataAudio}
          />
        </View>
      </Animated.View>

      <Goback />

      <FlashList
        ListHeaderComponent={renderHeader}
        ref={flashListRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        data={searchQuery.length > 1 ? memoizedFilteredData : memoizedChapters}
        estimatedItemSize={75}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SuratReader
            chapteID={item.id}
            id={id}
            setIsPlaying={setIsPlaying}
            dataAudio={dataAudio}
            reciterName={name}
            data={item}
            setSearchQuery={setSearchQuery}
            setIDchapter={setIDchapter}
            loading={loading}
            arab_name={arab_name}
            chapterAr={item.name_arabic}
            chapterName={item.name_simple}
            playAudio={playSound}
            languages={languages}
            color={color2}
            setloading={setloading}
          />
        )}
      />

      <Animated.View
        style={[
          styles.buttonScroll,
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

const { ids, styles } = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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

  chapterTextSmall: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  BotHeader: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 99,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",

    "@media (min-width: 700px)": {
      paddingHorizontal: 32,
    },
  },

  chapterNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
    backgroundColor: Colors.blue,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReaderSurah;
