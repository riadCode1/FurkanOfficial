import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";
import { dataArray } from "../constants/RecitersImages";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { router } from "expo-router";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = memo(({ children }) => {
  const [reciter, setReciter] = useState("");
  const [IDchapter, setIDchapter] = useState(0);
  const [reciterAR, setReciterAR] = useState("");
  const [languages, setLanguages] = useState(false);
  const [idReader, setIDreader] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapterId, setChapterID] = useState(null);
  const [arabicCH, setArabicCH] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [checked, setChecked] = useState("second");
  const [playlist, setPlaylist] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentReciter, setCurrentReciter] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [color, setColor] = useState(0);
  const [color2, setColor2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { width } = Dimensions.get("window");
  const NUM_TABS = 4;
  const TAB_WIDTH = width / NUM_TABS;

  const insets = useSafeAreaInsets();
  
    // Animation values
    const activeIndex = useSharedValue(0);
    const opacity = useSharedValue(0); // for fade in
  
    const animatedBackgroundStyle = useAnimatedStyle(() => {
      const direction = languages ? -1 : 1;
      return {
        transform: [
          {
            translateX: withSpring(direction * activeIndex.value * TAB_WIDTH, {
              damping: 22,
              stiffness: 170,
            }),
          },
        ],
      };
    });

   const handleTabPress = (index: number, href: string) => {
    console.log("Tab pressed:", index, href);
    activeIndex.value = index;
    setActiveTab(index);
    router.replace(href as any);
  };

  useEffect(() => {
    const initializeState = async () => {
      try {
        const [
          savedChecked,
          savedReciter,
          savedChapter,
          savedIdReader,
          savedReciterAR,
          savedChapterID,
          savedChapterAr,
        ] = await Promise.all([
          AsyncStorage.getItem("checked"),
          AsyncStorage.getItem("reciter"),
          AsyncStorage.getItem("chapterId"),
          AsyncStorage.getItem("idReader"),
          AsyncStorage.getItem("reciterAR"),
          AsyncStorage.getItem("idChapter"),
          AsyncStorage.getItem("chapterAR"),
        ]);

        if (savedChecked) {
          setChecked(savedChecked);
          setLanguages(savedChecked === "first");
        }
        if (savedReciter) setReciter(savedReciter);
        if (savedReciterAR) setReciterAR(savedReciterAR);
        if (savedChapter) setChapterID(savedChapter);
        if (savedIdReader) setIDreader(Number(savedIdReader));
        if (savedChapterID) setIDchapter(Number(savedChapterID));
        if (savedChapterAr) setArabicCH(savedChapterAr);
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    initializeState();
  }, []);

  const saveCheck = useCallback(async (newName) => {
    try {
      setChecked(newName);
      await AsyncStorage.setItem("checked", newName);
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  const reciterSaved = useCallback(async (newName) => {
    try {
      if (newName == null) {
        console.warn(
          "reciterSaved: Passed value is null or undefined. Skipping save."
        );
        return;
      }
      setReciter(newName);
      await AsyncStorage.setItem("reciter", newName);
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  const reciterARSaved = useCallback(async (newName) => {
    try {
      if (newName == null) {
        console.warn(
          "reciterSaved: Passed value is null or undefined. Skipping save."
        );
        return;
      }
      setReciterAR(newName);
      await AsyncStorage.setItem("reciterAR", newName);
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  const chapterSaved = useCallback(async (newName) => {
    try {
      setChapterID(newName);
      await AsyncStorage.setItem("chapterId", newName);
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  const chapterArSaved = useCallback(async (newName) => {
    try {
      setArabicCH(newName);
      await AsyncStorage.setItem("chapterAR", newName);
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  const idReciterSaved = useCallback(async (newName) => {
    try {
      setIDreader(newName);
      await AsyncStorage.setItem("idReader", String(newName));
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  const idChapterSaved = useCallback(async (newName) => {
    try {
      setIDchapter(newName);
      await AsyncStorage.setItem("idChapter", String(newName));
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  }, []);

  useEffect(() => {
    const updateProgress = async () => {
      try {
        const progress = await TrackPlayer.getProgress();
        setPosition(progress.position);
        setDuration(progress.duration);
        
        // Check if track ended and shuffle is on
        if (shuffle && progress.position >= progress.duration && progress.duration > 0) {
          playNext();
        }
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [shuffle]);

  const getAudio = useCallback(async (reciterId, chapterId) => {
    try {
      if (!reciterId || !chapterId) {
        console.warn("getAudio: Missing reciterId or chapterId");
        return null;
      }
      
      const response = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterId}`
      );
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      const audioUrl = data?.audio_file?.audio_url;
      
      if (!audioUrl) {
        console.warn("No audio URL found in response");
        return null;
      }
      
      return audioUrl;
    } catch (error) {
      console.error("Error fetching audio URL:", error);
      return null;
    }
  }, []);

  const playTrack = async (track, index) => {
    try {
      if (!track || !track.id) {
        console.error("Invalid track object");
        return;
      }

      console.log("Playing track at index:", index);

      setColor2(index);
      setColor(track.id);
      idReciterSaved(track.id);

      // Safely get chapter name with null checks
      const chapterName = track.title?.[index - 1]?.name_simple || track.chapter;
      const chapterNameAR = track.title?.[index - 1]?.name_arabic || track.titleAR;
      
      chapterSaved(chapterName);
      chapterArSaved(chapterNameAR);
      reciterSaved(track.artist);
      reciterARSaved(track.artistAR);
      idChapterSaved(index);

      await TrackPlayer.reset();
      const uri = await getAudio(track.id, index);
      
      if (!uri) {
        console.error("Failed to get audio URL");
        setLoading(false);
        return;
      }

      const tracker = {
        id: track.id,
        url: uri,
        title: languages ? chapterNameAR : chapterName,
        artist: languages ? track.artistAR : track.artist,
        artwork: dataArray[track.id]?.image || require("../assets/images/icon.png"),
      };

      await TrackPlayer.add(tracker);
      await TrackPlayer.play();
      setCurrentTrackIndex(index);
      setTrack(uri);
      setCurrentTrack(track.index);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
      setLoading(false);
    }
  };

  const playTrackSkip = async (track, index) => {
    setColor(track[index].artist[index].id);
    idReciterSaved(track[index].artist[index].id);
    reciterSaved(track[index].artist[index].reciter_name);
    chapterSaved(track[index].title);
    chapterArSaved(track[index].titleAR);
    reciterARSaved(track[index].artist[index].translated_name.name);

    await TrackPlayer.reset();
    const uri = await getAudio(track[index].artist[index].id, track[index].id);

    const tracker = {
      id: track[index].artist[index].id,
      url: uri,
      title: languages ? track[index].titleAR : track[index].title,
      artist: languages
        ? track[index].artist[index].translated_name.name
        : track[index].artist[index].reciter_name,
      artwork: dataArray[track[index].artist[index].id].image,
    };

    await TrackPlayer.add(tracker);
    await TrackPlayer.play();

    setCurrentTrack(index);
    setCurrentReciter(track[index].artist[index].id);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const playNext = async () => {
    try {
      const nextIndex = currentTrackIndex + 1;
      const nextReciter = Number(currentTrack) + 1;
      const MAX_CHAPTERS = 114; // Quran has 114 chapters
      
      console.log("Track list length:", tracks.length);

      // If we have a full chapter list (114 chapters), use playTrack
      if (tracks.length >= MAX_CHAPTERS && nextIndex < tracks.length) {
        const nextTrack = tracks[nextIndex];
        await playTrack(nextTrack, nextIndex);
      } else if (nextReciter <= MAX_CHAPTERS) {
        // Otherwise use playTrackSkip for alternative logic
        await playTrackSkip(tracks, nextReciter);
      } else {
        console.warn("Reached end of playlist");
      }
    } catch (error) {
      console.error("Error playing next track:", error);
    }
  };

  const playPrevious = async () => {
    try {
      const nextIndex = currentTrackIndex - 1;
      const nextReciter = Number(currentTrack) - 1;
      const MAX_CHAPTERS = 114; // Quran has 114 chapters
      
      console.log("Track list length:", tracks.length);

      // If we have a full chapter list (114 chapters), use playTrack
      if (tracks.length >= MAX_CHAPTERS && nextIndex >= 0) {
        const nextTrack = tracks[nextIndex];
        await playTrack(nextTrack, nextIndex);
      } else if (nextReciter >= 1) {
        // Otherwise use playTrackSkip for alternative logic
        await playTrackSkip(tracks, nextReciter);
      } else {
        console.warn("Reached beginning of playlist");
      }
    } catch (error) {
      console.error("Error playing previous track:", error);
    }
  };

  const setTrackList = (trackList) => {
    setTracks(trackList);
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <GlobalContext.Provider
      value={{
        reciter,
        setReciter: reciterSaved,
        currentTrackId,
        setCurrentTrackId,
        position,
        setPosition,
        duration,
        setDuration,
        reciterAR,
        setReciterAR,
        idReader,
        setIDreader: idReciterSaved,
        languages,
        setLanguages,
        chapterId,
        setChapterID: chapterSaved,
        setIsPlaying,
        modalVisible,
        setModalVisible,
        arabicCH,
        setArabicCH,
        saveCheck,
        checked,
        playlist,
        setPlaylist,
        IDchapter,
        setIDchapter,
        shuffle,
        setShuffle,
        togglePlayback,
        currentTrack,
        tracks,
        currentTrackIndex,
        playTrack,
        playNext,
        playPrevious,
        setTrackList,
        isPlaying,
        setIsPlaying,
        color,
        setColor,
        color2,
        setColor2,
        loading,
        setLoading,
        track,
        setTrack,
        currentLocation,
        setCurrentLocation,
        activeTab, setActiveTab,
        handleTabPress
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
});

export default GlobalProvider;
