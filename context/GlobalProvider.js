import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
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
  const [languages, setLanguages] = useState(false);
  const [idReader, setIDreader] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chapterId, setChapterID] = useState(null);
  const [arabicCH, setArabicCH] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [checked, setChecked] = useState("second");
  const [chapterAudio, setAudioChapter] = useState([]);
  const [chapters, setchapters] = useState([]);
  const [dataAudio, setDataAudio] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [adtoList, setAdtoList] = useState(null);
  const [shuffle, setShuffle] = useState("first");
  const [modalVisible, setModalVisible] = useState(false)
 const [audioUri, setAudioUri] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState([]); // List of all tracks
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);

  


 



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




 

  useEffect(() => {
         const updateProgress = async () => {
           const progress = await TrackPlayer.getProgress();
           setPosition(progress.position);
           setDuration(progress.duration);
         };
      
         const interval = setInterval(updateProgress, 1000);  
      
         return () => clearInterval(interval);  
       }, []);

       const getAudio = async (reciterId,Chapterid) => {
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

  // Play a specific track

  const playTrack = async (track, index) => {

    const uri = await getAudio(track.id,index);
    console.log(uri)
    console.log(track,index)
   const tracker = {
    id: track.id,
    url: uri, // or a remote URL
    title:  track.title? track.title[index-1].name_simple : track.chapter,
    artist: track.artist,
    artwork: dataArray[track.id]?.image,
     // or a remote URL
  };


    await TrackPlayer.reset()
    await TrackPlayer.add(tracker);
    await TrackPlayer.play();

    setCurrentTrack(track);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    
    
  };

 
   // Play the next track
   const playNext = async () => {
  
      const nextIndex = currentTrackIndex + 1;
      const nextTrack = tracks[nextIndex-1];
      console.log(nextTrack.title[nextIndex].name_arabic,currentTrackIndex)
      await playTrack(nextTrack, nextIndex);
      
    
  };
   // Play the previous track
   const playPrevious = async () => {
   
      const nextIndex = currentTrackIndex - 1;
      const nextTrack = tracks[nextIndex];
      console.log("prv",nextTrack.title[nextIndex].name_arabic,currentTrackIndex)
      await playTrack(nextTrack, nextIndex);
     
  };

 

  // Set the list of tracks
  const setTrackList = (trackList) => {
    setTracks(trackList); 
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
        currentTrack,
        progress,
        tracks,
        currentTrackIndex,
        playTrack,
        playNext,
        playPrevious,
        setTrackList,
       


      }}
    >
      {children}
    </GlobalContext.Provider>
  );
});

export default GlobalProvider;
