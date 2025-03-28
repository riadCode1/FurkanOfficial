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

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = memo(({ children }) => {
  const [reciter, setReciter] = useState("");
  const [IDchapter, setIDchapter] = useState(0);
  const [reciterAR, setReciterAR] = useState("");
  const [languages, setLanguages] = useState(true);
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
  const [currentReciter, setCurrentReciter] = useState(null);
  const [tracks, setTracks] = useState([]); // List of all tracks
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [color, setColor] = useState(0);
  const [color2, setColor2] = useState(0);
  const [loading, setloading] = useState(false)
  const [track, setTrack] = useState(null)



 useEffect(() => {
    const initializeState = async () => {
      try {
        const [savedChecked, savedReciter, savedChapter, savedIdReader,savedReciterAR,savedChapterID,savedChapterAr] =
          await Promise.all([
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
        if (savedChapterAr) setArabicCH(savedChapterAr)
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    initializeState();
  }, []);

  // Memoized state update functions
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
      const progress = await TrackPlayer.getProgress();
      setPosition(progress.position);
      setDuration(progress.duration);
    };

    const checkTrackEnd = async () => {
      if (shuffle && position > 0 && duration > 0 && position >= duration) {
        await playNext(); // Play the next track when the current one ends
      }
    };
    const interval = setInterval(updateProgress, 1000);
    checkTrackEnd();
    return () => clearInterval(interval);
    
  }, [position,duration,playNext,shuffle]);




  const getAudio = useCallback(async (reciterId, chapterId) => {
    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterId}`
      );
      const data = await response.json();

      return data?.audio_file?.audio_url; // Return the audio URL
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    }
  }, []);

  // Play a specific track

  const playTrack = async (track, index) => {
    console.log(track,index)
    
    setColor2(index);
    setColor(track.id);
    idReciterSaved(track.id);
    setCurrentReciter(track.id);
    
    chapterSaved(
      track.title ? track.title[index - 1].name_simple : track.chapter
    );
    chapterArSaved(
      track.title ? track.title[index - 1].name_arabic : track.titleAR
    );
    reciterSaved(track.artist);
    reciterARSaved(track.artistAR);
    idChapterSaved(index);
    

     await TrackPlayer.reset();
    const uri = await getAudio(track.id, index);
   
    

    const tracker = {
      id: track.id,
      url: uri, // or a remote URL
      title: track.title
        ? languages
          ? track.title[index - 1].name_arabic
          : track.title[index - 1].name_simple
        : languages
        ? track.titleAR
        : track.chapter,
      artist: languages ? track.artistAR : track.artist,
      // artwork:require("../assets/images/icon.png")
       artwork: track.id
         ? dataArray[track.id].image
         : require("../assets/images/icon.png"),
       
    };

    await TrackPlayer.add(tracker);
    await TrackPlayer.play();
    setCurrentTrackIndex(index);
     setTrack(uri)
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  

  const playTrackSkip = async (track, index) => {

    

    setColor(track[index].artist[index].id);
    idReciterSaved(track[index].artist[index].id);
    reciterSaved( track[index].artist[index].reciter_name);
    chapterSaved(track[index].title);
    chapterArSaved(track[index].titleAR)
    reciterARSaved(track[index].artist[index].translated_name.name)

     await TrackPlayer.reset();
    const uri = await getAudio(track[index].artist[index].id, track[index].id);

    
 

    const tracker = {
      id: track[index].artist[index].id,
      url: uri, // or a remote URL
      title: languages? track[index].titleAR:track[index].title,   
      artist: languages? track[index].artist[index].translated_name.name : track[index].artist[index].reciter_name,
      // artwork:require("../assets/images/icon.png")
       artwork: dataArray[track[index].artist[index].id].image,
       
        
      
    };
    

    await TrackPlayer.add(tracker);
    await TrackPlayer.play();

    setCurrentTrack(track);
    setCurrentReciter(track[index].artist[index].id);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
   
    
    
  };

  // Play the next track

  const playNext = async () => {
    const nextIndex = currentTrackIndex + 1;
    const nextReciter = currentReciter;
    const nextTrack = tracks[nextIndex - 1];
    const nextTrackSkip = tracks;
    
    if (tracks.length === 114) {
      await playTrack(nextTrack, nextIndex);
      console.log("track",nextTrack);
    } else {
      await playTrackSkip(nextTrackSkip, nextReciter);
      console.log("skipper");
    }
  };

  // Play the previous track
  const playPrevious = async () => {
    const nextIndex = currentTrackIndex - 1;
    const nextReciter = currentReciter - 2;
    const nextTrack = tracks[nextIndex - 1];
    const nextTrackSkip = tracks;
  
    if (tracks.length === 114) {
      await playTrack(nextTrack, nextIndex);
      console.log("track");
    } else {
      await playTrackSkip(nextTrackSkip, nextReciter - 1);
      console.log("skipper");
    }
  };

  // Set the list of tracks
  const setTrackList = (trackList) => {
    setTracks(trackList);
    console.log(trackList)
    
    
  };

  // Toggle playback (play/pause)

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
        color, setColor,
        color2, setColor2,
        loading, setloading,
        track, setTrack
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
});

export default GlobalProvider;
