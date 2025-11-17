import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  TouchableOpacity,
  StatusBar,
  I18nManager,
  View,
  Text,
  Animated,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { fetchAudio, fetchChater } from "../../API/QuranApi";
import { dataArray } from "../../../constants/RecitersImages";
import SuratReader from "../../../components/SuratReader";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/noImage";
import { RFValue } from "react-native-responsive-fontsize";
import TogglePlay from "../../../components/TogglePlay";
import Lineargradient from "../../../components/LinearGradient";
import Goback from "../../../components/Goback";
import ArrowScroll from "../../../components/ArrowScroll";
import { Image, ImageBackground } from "expo-image";

const HEADER_MAX_HEIGHT = 420;
const HEADER_MIN_HEIGHT_FACTOR = 0.25;

const ReaderSurah = () => {
  const { width, height } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;

  const HEADER_MIN_HEIGHT = height * HEADER_MIN_HEIGHT_FACTOR;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const smallHeaderOpacity = scrollY.interpolate({
    inputRange: [HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE, RFValue(350)],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 300],
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
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    getChapter();
    fetchAudioUrl(id);

    if (searchQuery.length > 1) {
      fetchChater(searchQuery)
        .then((suwarData) => {
          const filteredRecitations = suwarData.chapters.filter(
            (item) =>
              item.name_simple?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
              item.name_arabic?.toLowerCase()?.includes(searchQuery.toLowerCase())
          );
          setFilteredData(filteredRecitations);
        })
        .catch(console.error);
    }
  }, [languages, searchQuery, id, color2, loading]);

  const getChapter = async () => {
    try {
      const data = await fetchChater();
      if (data?.chapters) setchapters(data.chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const fetchAudioUrl = async (id) => {
    try {
      const data = await fetchAudio(id);
      if (data?.audio_files) setDataAudio(data.audio_files);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const playSound = (uri, trackId, chapterName, names, arabName, Id) => {
    playTrack(
      { id: Id, url: uri, title: chapters, artist: names, artistAR: arabName, chapterID: trackId },
      trackId
    );

    setTrackList(
      dataAudio.map(() => ({
        id,
        title: chapters,
        artist: name,
        artistAR: arab_name,
      }))
    );
  };

  const playAuto = (uri, trackId, chapterName, names, arabName, Id) => {
    playTrack(
      { id: Id, url: uri, title: chapters, artist: names, artistAR: arabName, chapterID: trackId },
      1
    );

    setTrackList(
      dataAudio.map(() => ({
        id,
        title: chapters,
        artist: name,
        artistAR: arab_name,
      }))
    );
  };

  const renderHeader = useMemo(() => {
    const isTablet = width >= 768;
    return (
      <>
        <ImageBackground
          source={{ uri: dataArray[id]?.image || images.image }}
          blurRadius={20}
          style={{
            width: "100%",
            height: isTablet ? 400 : 366,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <View style={[styles.imageContainer, { width: isTablet ? 140 : 146, height: isTablet ? 140 : 146 }]}>
            <Image
              contentFit="cover"
              source={{ uri: dataArray[id]?.image || images.image }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View style={[styles.BotHeader, { paddingHorizontal: isTablet ? 32 : 16 }]}>
            <View style={{ width: isTablet ? 320 : 285 }}>
              <Text style={[styles.chapterNameText, { textAlign: "left" }]}>
                {languages ? arab_name : name}
              </Text>
              <Text style={{ color: Colors.textGray, fontSize: 16, textAlign: "left" }}>
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

        <View style={{ alignItems: "center", marginTop: 24, marginBottom: 16 }}>
          <SearchBar
            title={languages ? "ابحث عن سورة" : "Search Chapter"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredData={filteredData}
          />
        </View>
      </>
    );
  }, [width, id, languages, searchQuery, filteredData, isPlaying, dataAudio]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" />

      {/* Small Header */}
      <Animated.View style={[styles.smallHeader, { opacity: smallHeaderOpacity }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 30,
            paddingRight: width >= 768 ? 32 : 16,
            paddingLeft: width >= 768 ? 100 : 80,
            alignItems: "center",
          }}
        >
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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        contentContainerStyle={{ paddingBottom: 150 }}
        data={searchQuery.length > 1 ? filteredData : chapters}
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

      <Animated.View style={[ { transform: [{ translateX: ButtonTranslate }] }]}>
        <ArrowScroll scrollToTop={scrollToTop} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chapterNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonScroll: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
});

export default ReaderSurah;
