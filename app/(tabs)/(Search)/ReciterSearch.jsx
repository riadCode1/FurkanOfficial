import React, { useEffect, useState, useMemo, useRef } from "react";
import { TouchableOpacity, Modal, Dimensions, FlatList } from "react-native";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
let { width, height } = Dimensions.get("window");
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
} from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { fetchAudio, fetchChater } from "../../API/QuranApi";
import { dataArray } from "../../../constants/RecitersImages";
import SuratReader from "../../../components/SuratReader";
import ModalAudio from "../../../components/ModalAudio";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/noImage";
import { TouchableRipple } from "react-native-paper";
import TrackPlayer from "react-native-track-player";

 
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
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
      290,
    ],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 290],
    outputRange: [2000, 0],
    extrapolate: "clamp",
  });

  const params = useGlobalSearchParams();
  const { arab_name, name, id } = params;
  const {
    languages,
    setIsPlaying,
    isPlaying,
    setChapterID,
    setIDchapter,
    setPosition,
    setDuration,
    modalVisible,
    setArabicCH,
    chapters,
    setReciter,
    setchapters,
    dataAudio,
    setDataAudio,
    setAdtoList,
    setIDreader,
    setReciterAR,
    playTrack
  } = useGlobalContext();

  const [loading, setloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setvisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const flashListRef = useRef(null);
  const [currentTrackId, setCurrentTrackId] = useState(0);
   const [color, setColor] = useState(0);
  
  
  


  const scrollToTop = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    getChapter();
    fetchAudioUrl(id);

    if (searchQuery.length > 1) {
      setloading(true);

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
        .finally(() => {
          setloading(false);
        });
    }
  }, [languages, searchQuery, id, color]);

  const getChapter = async () => {
    
    try {
      const data = await fetchChater();
      if (data && data.chapters) {
        setchapters(data.chapters);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      
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
 
  
  
 

  useEffect(() => {
    const updateProgress = async () => {
      const progress = await TrackPlayer.getProgress();
      setPosition(progress.position);
      setDuration(progress.duration);
    };
  
    const interval = setInterval(updateProgress, 1000); // Update every second
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

 

 const playAudio = async (uri,trackId,chapterName,name, arabName, id,arabicCh) => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: id,
      url: uri,
      title: chapterName,
      artist: name,
    });
    await TrackPlayer.play();

    
    setColor(trackId);
    setCurrentTrackId(trackId);
    setChapterID(chapterName);
    setArabicCH(arabicCh);
    setIsPlaying(true);
    setReciter(name);
    setIDreader(id);
    
    setReciterAR(arabName);
  };


   //platNext

   const nextSurah = () => {
    playAudio(
      dataAudio[currentTrackId].audio_url,
      dataAudio[currentTrackId].chapter_id,
      chapters[currentTrackId].name_simple,
      name,
      arab_name,
      id,
      chapters[currentTrackId].name_arabic
    );
  };


  //playAuto

  const playAuto = () => {
    playAudio(
      dataAudio[0].audio_url,
      dataAudio[0].chapter_id,
      chapters[0].name_simple,
      name,
      arab_name,
      id,
      chapters[0].name_arabic
    );
  };

  //PlayPrevious

  const previousSurah = async () => {
    playAudio(
      dataAudio[currentTrackId - 2].audio_url,
      dataAudio[currentTrackId - 2].chapter_id,
      chapters[currentTrackId - 2].name_simple,
      name,
      arab_name,
      id,
      chapters[currentTrackId - 2].name_arabic
    );
  };




 
  

  //  Memoizing filtered data
  const memoizedFilteredData = useMemo(() => {
    return filteredData;
  }, [filteredData,]);

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
                  onPress={"pauseAudio"}
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
                  onPress={"playAuto"}
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
            setvisible={setvisible}
            loading={loading}
            arab_name={arab_name}
            chapterAr={item.name_arabic}
            chapterName={item.name_simple}
            playSound={playAudio}
            languages={languages}
            setAdtoList={setAdtoList}
            color={item.id === color}
            
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
          setvisible={setvisible}
          loading={loading}
          arab_name={arab_name}
          chapterAr={item.name_arabic}
          chapterName={item.name_simple}
          // playSound={playSound}
          playAudio={playAudio}
          languages={languages}
          setAdtoList={setAdtoList}
          color={item.id === color}
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
        {/* Modal */}
        <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <StatusBar backgroundColor="#181A3C" />
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ModalAudio
               
                // shuffle={shuffle}
                // setShuffle={setShuffle}
                setPosition={setPosition}
                nextSurah={nextSurah}
                previousSurah={previousSurah}
              />
            </View>
          </View>
        </Modal>
      </View>

     
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
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    height: HEADER_MIN_HEIGHT - 40,
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
    top: "8%",
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
