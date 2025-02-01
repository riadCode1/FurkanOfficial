import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = memo(({ children }) => {
  const [reciter, setReciter] = useState("");
  const [IDchapter, setIDchapter] = useState(0);
  const [reciterAR, setReciterAR] = useState("");
  const [languages, setLanguages] = useState(false);
  const [idReader, setIDreader] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chapterId, setChapterID] = useState(null);
  const [arabicCH, setArabicCH] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [checked, setChecked] = useState("second");
  const [chapterAudio, setAudioChapter] = useState([]);
  const [chapters, setchapters] = useState([]);
  const [dataAudio, setDataAudio] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [adtoList, setAdtoList] = useState(null);
  const soundRef = useRef(new Audio.Sound());
  const [shuffle, setShuffle] = useState("first");

  


 



  useEffect(() => {
    const initializeState = async () => {
      try {
        const [savedChecked, savedReciter, savedChapterId, savedIdReader] =
          await Promise.all([
            AsyncStorage.getItem("checked"),
            AsyncStorage.getItem("reciter"),
            AsyncStorage.getItem("chapterId"),
            AsyncStorage.getItem("idReader"),
          ]);

        if (savedChecked) {
          setChecked(savedChecked);
          setLanguages(savedChecked === "first");
        }
        if (savedReciter) setReciter(savedReciter);
        if (savedChapterId) setChapterID(savedChapterId);
        if (savedIdReader) setIDreader(Number(savedIdReader));
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    initializeState();
  }, [shuffle]);

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

  const chapterSaved = useCallback(async (newName) => {
    try {
      setChapterID(newName);
      await AsyncStorage.setItem("chapterId", newName);
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
        soundRef,
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
        chapterAudio,
        setAudioChapter,
        languages,
        setLanguages,
        playing,
        isPlaying,
        chapterId,
        setChapterID: chapterSaved,
        setIsPlaying,
        modalVisible,
        setModalVisible,
        arabicCH,
        setArabicCH,
        saveCheck,
        checked,
        chapters,
        setchapters,
        dataAudio,
        setDataAudio,
        playlist,
        setPlaylist,
        adtoList,
        setAdtoList,
        IDchapter,
        setIDchapter,
        shuffle,
        setShuffle,
       
        togglePlayback,
       


      }}
    >
      {children}
    </GlobalContext.Provider>
  );
});

export default GlobalProvider;
