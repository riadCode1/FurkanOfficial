import { View, Text } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [reciter, setReciter] = useState("");
  const [color, setColor] = useState(0);
  const [color2, setColor2] = useState(0);
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




  const pauseAudio = async () => {
    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      setPlaying(true);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      setPlaying(true);
    }
  };

  // const playSound = async (
  //   uri,
  //   trackId,
  //   chapterName,
  //   name,
  //   arabName,
  //   id,
  //   arabicCh
  // ) => {
  //   try {
  //     if (soundRef.current._loaded) {
  //       await soundRef.current.stopAsync();
  //       await soundRef.current.unloadAsync();
  //     }

  //     await soundRef.current.loadAsync({ uri });
  //     await soundRef.current.playAsync();

  //     // Set the current index in the list

  //     soundRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  //   } catch (error) {
  //     console.error("Error playing sound:", error);
  //   }
  //   setCurrentTrackId(trackId);
  //   chapterSaved(chapterName);
  //   setArabicCH(arabicCh);
  //   setIsPlaying(true);
  //   reciterSaved(name);
  //   idReciterSaved(id);
  //   setColor(trackId);
  //   setColor2(id)
  //   setReciterAR(arabName);
  // };
  
  // Function to handle playback status updates
  // const onPlaybackStatusUpdate = (status) => {
  //   if (status.isLoaded) {
  //     setPosition(status.positionMillis);
  //     setDuration(status.durationMillis);
  //     setIsPlaying(status.isPlaying);

  //     // Check if the audio has finished playing
  //     if (status.didJustFinish) {
  //       setCurrentTrackId();
  //     }
  //   }
  // };

  useEffect(() => {
    const setupAudioMode = async () => {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };

    setupAudioMode();
  }, []);

  useEffect(() => {
    const initializeState = async () => {
      try {
        const [savedChecked, savedReciter, savedChapterId, savedIdReader] = await Promise.all([
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
  }, []);

  // Save state to AsyncStorage whenever it changes

  const saveCheck = async (newName) => {
    try {
      setChecked(newName); // Update state
      await AsyncStorage.setItem("checked", newName); // Save as string
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  };

  const reciterSaved = async (newName) => {
    try {
      setReciter(newName); // Update state
      await AsyncStorage.setItem("reciter", newName); // Save as string
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  };

  const chapterSaved = async (newName) => {
    try {
      setChapterID(newName); // Update state
      await AsyncStorage.setItem("chapterId", newName); // Save as string
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  };

  const idReciterSaved = async (newName) => {
    try {
      setIDreader(newName); // Update state
      await AsyncStorage.setItem("idReader", String(newName)); // Save as string
    } catch (error) {
      console.error("Error saving name to AsyncStorage:", error);
    }
  };

  

  return (
    <GlobalContext.Provider
      value={{
        reciter,
        setReciter: reciterSaved,
        pauseAudio,
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
            setIDchapter
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
