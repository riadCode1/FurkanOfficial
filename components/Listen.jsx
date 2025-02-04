import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider"
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import ListenComp from "./ListenComp";

let { width, height } = Dimensions.get("window");

const Listen = ({
  searchQuery,
  filteredData,
  loading,
  chapterAr,
  quranData,
  Chapterid,
  ButtonTranslate,
  scrollY,
  HEADER_MAX_HEIGHT,
  chapterName,
}) => {
  const [audioUri, setAudioUri] = useState(null);
  const [mp3, setMp3] = useState(null);
  const [color2,setColor2,] = useState(false)
  const flashListRef = useRef(null);

  const scrollToTop = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const {
    setReciterAR,
    setTrackList,
    setArabicCH,
    languages,
    setCurrentTrackId,
    setChapterID,
    setIDreader,
    setReciter,
    setIsPlaying,
    playTrack,
  } = useGlobalContext();

  // Fetch audio URL based on reciter ID
  const getAudio = async (reciterId) => {
    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${Chapterid}`
      );
      const data = await response.json();
      setAudioUri(data?.audio_file?.audio_url);
      return data?.audio_file?.audio_url; // Return the audio URL
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    }
  };

  // Handle reciter selection
  const handleReciterSelect = async (reciterId) => {
    setIDreader( reciterId);
    setChapterID(chapterName)
    setReciter(quranData.find((r) => r?.id === reciterId)?.reciter_name);
    const uri = await getAudio(reciterId);
   
    playTrack(
    {  url:uri,
      id:reciterId,
      chapterId:Chapterid,
      chapter:chapterName,
      artist:quranData.find((r) => r?.id === reciterId)?.reciter_name,
      artistAR:quranData.find((r) => r?.id === reciterId)?.translated_name.name,
      titleAR:chapterAr
    },
    reciterId
    );
  
   
   
    
  };

  const handleReciterDrop = async (reciterId) => {
    setIDreader(reciterId);

    const audio = await getAudio(reciterId);
    setMp3(audio);
  };

  // Navigate to the next reciter
 

  // Navigate to the previous reciter
 
  

  const playSound = async (
    uri,
    trackId,
    chapterName,
    name,
    arabName,
    id,
    chapterAR
  ) => {

    
    setCurrentTrackId(trackId);
    setChapterID(chapterName);
    setIsPlaying(true);
    setReciter(name);
    setArabicCH(chapterAR);
    setIDreader(id);
    setReciterAR(arabName);
    setColor2(id);
  }
 

  // Play on the Background
  useEffect(() => {
    const trackList = quranData?.map((data) => ({
      id: 1,
      url: audioUri,
      title: chapterName,
      artist: data?.reciter_name,
      artwork: require("../assets/images/icon.png"),
    }));
    setTrackList(trackList);

    
  }, [searchQuery, languages,]);

  const handleClick = (id) => {
    setColor2(id);
   
  };

  return (
    <View style={styles.container}>
      {searchQuery.length > 1 ? (
        <Animated.FlatList
          contentContainerStyle={{
            paddingBottom: 200,
            paddingTop: HEADER_MAX_HEIGHT,
          }}
           ref={flashListRef}
          data={filteredData}
          initialNumToRender={70}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <ListenComp
                id={item.id}
                loading={loading}
                handleReciterSelect={() => handleReciterSelect(item.id)}
                arabName={item?.translated_name.name}
                reciterName={item?.reciter_name}
                chapterAr={chapterAr}
                chapterName={chapterName}
                languages={languages}
                mp3={audioUri}
                handleReciterDrop={handleReciterDrop}
                Chapterid={Chapterid}
              />
            </View>
          )}
        />
      ) : (
        <Animated.FlatList
          ref={flashListRef}
          contentContainerStyle={{
            paddingBottom: 200,
            paddingTop: HEADER_MAX_HEIGHT,
          }}
          data={quranData}
          initialNumToRender={50}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <ListenComp
                id={item.id}
                loading={loading}
                handleReciterSelect={() => handleReciterSelect(item.id)}
                arabName={item?.translated_name.name}
                reciterName={item?.reciter_name}
                chapterAr={chapterAr}
                chapterName={chapterName}
                languages={languages}
                mp3={mp3}
                color2={color2}
                handleReciterDrop={handleReciterDrop}
                Chapterid={Chapterid}
                handleClick={handleClick}
                
              />
            </>
          )}
          // Optimize for large lists
      maxToRenderPerBatch={5}
      windowSize={10}
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

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flashList: {
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingVertical: 8,
  },
  itemContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  color: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 12,
  },
  reciterName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  chapterName: {
    color: Colors.textGray,
    fontSize: 12,
  },
  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
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
});

export default Listen;
