import React, { useEffect, useState, useMemo, useRef } from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
let { width, height } = Dimensions.get("window");
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { fetchAudio, fetchChater } from "../../API/QuranApi";
import { dataArray } from "../../../constants/RecitersImages";
import SuratReader from "../../../components/SuratReader";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/noImage";
import { TouchableRipple } from "react-native-paper";

const HEADER_MAX_HEIGHT = height * 0.62;
const HEADER_MIN_HEIGHT = height * 0.25;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ReciterSearch = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -500],
    extrapolate: "clamp",
  });

  const smallHeaderOpacity = scrollY.interpolate({
    inputRange: [
      0, // Start of scroll
      HEADER_SCROLL_DISTANCE / 2, // Midpoint
      HEADER_SCROLL_DISTANCE, // End of scroll
    ],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 290], // Strictly increasing
    outputRange: [290, 0], // Descending output
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
    togglePlayback
   
  } = useGlobalContext();

  const [loading, setloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataAudio, setDataAudio] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const flashListRef = useRef(null);
  const [chapters, setchapters] = useState([]);

  const scrollToTop = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated: true });
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
        })
       
    }

    const trackList = dataAudio.map((data) => ({
      id: id,
      title: chapters,
      artist: name,
      artistAR: arab_name,
    }));
    setTrackList(trackList);
  }, [languages, searchQuery, id, color2]);

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
    name,
    arabName,
    id,
    arabicCh
  ) => {
    playTrack(
      {
        id: id,
        url: uri,
        title: chapters,
        artist: name,
        artistAR: arabName,
        chapterID: trackId,
      },
      trackId
    );
  };
  const playAuto = (
   
  ) => {
    playTrack(
      {
        id: id,
        
        title: chapters,
        artist: name,
        artistAR: arab_name,
        chapterID: 1,
      },
      1
    );
  };

  //  Memoizing filtered data
  const memoizedFilteredData = useMemo(() => {
    return filteredData;
  }, [filteredData]);

  //  Memoizing chapters list
  const memoizedChapters = useMemo(() => {
    return chapters;
  }, [chapters]);

  return (
    <View style={styles.container}>
      <TouchableRipple
        onPress={() => router.back()}
        rippleColor="rgba(255, 255, 255, 0.2)"
        style={styles.backButton}
        borderless={true}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableRipple>

      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <Animated.View style={[styles.headerImage, {}]}>
          <Image
            source={{
              uri: dataArray[id]?.image ? dataArray[id]?.image : images.image,
            }}
            blurRadius={20}
            style={[styles.headerImage]}
          />
        </Animated.View>

        <Animated.View style={[styles.imageContainer, {}]}>
          <Image
            resizeMode="cover"
            style={[styles.image]}
            source={{
              uri: dataArray[id]?.image ? dataArray[id]?.image : images.image,
            }}
          />
        </Animated.View>

        <Animated.View style={[styles.headerTitle]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={[styles.chapterNameText]}>
              <Text style={[styles.chapterNameText]}>
                {languages ? arab_name : name}
              </Text>
              <Text style={{ color: Colors.textGray }}>
                114 {languages ? "سورة" : "Surah"}
              </Text>
            </View>

            {isPlaying ? (
              <View>
                <TouchableRipple
                  onPress={togglePlayback}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <FontAwesome5 name="pause" size={20} color="#00D1FF" />
                </TouchableRipple>
              </View>
            ) : (
              <View>
                <TouchableRipple
                  onPress={playAuto}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <Entypo name="controller-play" size={24} color="#00D1FF" />
                </TouchableRipple>
              </View>
            )}
          </View>

          <View style={{ marginTop: 4 }}>
            <SearchBar
              title={languages ? "ابحث عن سورة" : "Search Chapter"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredData={memoizedFilteredData}
            />
          </View>
        </Animated.View>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(24,26,60,1)",
            "rgba(24,26,60,1)",
            "rgba(24,26,60,1)",
          ]}
          style={{
            width: width,
            height: height * 0.2,
            position: "absolute",
            zIndex: 1,
            top: "75%",
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Small Header */}

      <Animated.View
        style={[
          styles.smallHeader,
          {
            opacity: smallHeaderOpacity,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            left: 30,
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.chapterNameText]}>
            <Text style={[styles.chapterNameText]}>
              {languages ? arab_name : name}
            </Text>
            <Text style={{ color: Colors.textGray }}>
              114 {languages ? "سورة" : "Surah"}
            </Text>
          </View>

          {isPlaying ? (
            <View style={{}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={"pauseAudio"}
                style={styles.playPauseButton}
              >
                <FontAwesome5 name="pause" size={20} color="#00D1FF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={"playAuto"}
                style={styles.playPauseButton}
              >
                <Entypo name="controller-play" size={24} color="#00D1FF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>

      {searchQuery.length > 1 ? (
        <FlashList
          contentContainerStyle={{
            paddingBottom: 150,
            paddingTop: HEADER_MAX_HEIGHT,
          }}
          data={memoizedFilteredData}
          ref={flashListRef}
          estimatedItemSize={50}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
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
              playSound={playSound}
              languages={languages}
              color={color2}
            />
          )}
        />
      ) : (
        <FlashList
          contentContainerStyle={{
            paddingBottom: 150,
            paddingTop: HEADER_MAX_HEIGHT,
          }}
          data={chapters}
          ref={flashListRef}
          estimatedItemSize={75}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
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
              // playSound={playSound}
              playAudio={playSound}
              languages={languages}
              color={color2}
              setloading={setloading}
            />
          )}
        />
      )}
      <Animated.View
        style={[
          {
            transform: [{ translateX: ButtonTranslate }],
          },
        ]}
      >
        <TouchableRipple
          onPress={scrollToTop}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.button}
          borderless={true}
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableRipple>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A3C",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    backgroundColor: "#181A3C",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  flashListContainer: {
    paddingBottom: 50,
  },

  button: {
    position: "absolute",
    bottom: height * 0.25,
    right: 20,
    backgroundColor: Colors.tint,
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  imageContainer: {
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 20, // Shadow blur radius for iOS
    elevation: 10,
    // Shadow for Android
    // Background for shadow visibility
    // Optional: Rounded corners
    // Ensures rounded corners are applied to the image
  },
  image: {
    width: 146,
    height: 146,

    // Match borderRadius of the container for consistent rounding
  },
  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    height: "16%",
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  smallHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  chapterNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    width: width * 0.6,
  },
  playPauseButton: {
    width: 50,
    height: 50,
    backgroundColor: "#454B8C",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    zIndex: 999,
    bottom: 10,
  },

  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    top: 45,
    left: 20,
    position: "absolute",
    width: 48,
    elevation: 50,
    height: 48,
    zIndex: 99,
    backgroundColor: "#454B8C",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemText: {
    color: "#fff",
    marginLeft: 16,
    fontSize: 16,
  },
  centeredView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.background,
  },
  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
  },
});

export default ReciterSearch;
