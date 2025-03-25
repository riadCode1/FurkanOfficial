import { View, StyleSheet, Animated, Dimensions } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { Colors } from "../constants/Colors";

import ListenComp from "./ListenComp";
import { FlashList } from "@shopify/flash-list";

let { width, height } = Dimensions.get("window");

const Listen = ({
  searchQuery,
  filteredData,
  loading,
  languages,
  chapterAr,
  quranData,
  Chapterid,
  scrollY,
  chapterName,
}) => {
  const [audioUri, setAudioUri] = useState(null);
  const [mp3, setMp3] = useState(null);
  const flashListRef = useRef(null);

 

  const { setTrackList, setIDreader, playTrack, color, setColor } =
    useGlobalContext();

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
    playTrack(
      {
        id: reciterId,
        chapterID: Chapterid,
        chapter: chapterName,
        chapterAr: chapterAr,
        artist: quranData.find((r) => r?.id === reciterId)?.reciter_name,
        artistAR: quranData.find((r) => r?.id === reciterId)?.translated_name
          .name,
        titleAR: chapterAr,
      },
      Chapterid
    );
  };

  const handleReciterDrop = async (reciterId) => {
    setIDreader(reciterId);

    const audio = await getAudio(reciterId);
    setMp3(audio);
  };

  // Play on the Background
  useEffect(() => {
    const trackList = quranData.map((data) => ({
      id: Chapterid,
      titleAR: chapterAr,
      title: chapterName,
      artist: quranData,
    }));
    setTrackList(trackList);
  }, [searchQuery, Chapterid, quranData, chapterName]);

  const handleClick = useCallback(
    (id) => {
      setColor(id);
    },
    [color]
  );

  return (
    <View style={styles.container}>
      <FlashList
        scrollEnabled={false}
        ref={flashListRef}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        data={searchQuery.length > 1 ? filteredData : quranData}
        estimatedItemSize={75} // Render fewer items initially
        maxToRenderPerBatch={10} // Render fewer items per batch
        windowSize={20} // Reduce offscreen items
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        keyExtractor={(item) => item.id} // No need for toString() if id is already a string
        renderItem={({ item }) => (
          <ListenComp
            id={item.id}
            loading={loading}
            handleReciterSelect={handleReciterSelect}
            arabName={item?.translated_name.name}
            reciterName={item?.reciter_name}
            chapterAr={chapterAr}
            chapterName={chapterName}
            languages={languages}
            mp3={searchQuery.length > 1 ? audioUri : mp3}
            color={color}
            handleReciterDrop={handleReciterDrop}
            Chapterid={Chapterid}
            handleClick={handleClick}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 14,
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
