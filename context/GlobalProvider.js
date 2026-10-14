import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer, { Event } from "react-native-track-player";
import { getReciterImage } from "../constants/reciterArtwork";
import { images } from "../constants/images";
import {
  navigateToAdjacentSurah,
  navigateToSurah,
} from "../constants/trackNavigation";
import { getDownloadedAudioUri } from "../constants/offlineDownloads";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);
const audioUrlCache = new Map();

const readUserPlaylists = async (fallback = []) => {
  const storedPlaylists = await AsyncStorage.getItem("userPlaylists");
  if (!storedPlaylists) return fallback;

  const parsedPlaylists = JSON.parse(storedPlaylists);
  return Array.isArray(parsedPlaylists)
    ? parsedPlaylists.map((playlist) => ({
        ...playlist,
        id: String(playlist.id),
        items: Array.isArray(playlist.items) ? playlist.items : [],
      }))
    : fallback;
};

const GlobalProvider = memo(({ children }) => {
  // Persisted user and Quran selection state.
  const [reciter, setReciter] = useState("");
  const [IDchapter, setIDchapter] = useState(0);
  const [reciterAR, setReciterAR] = useState("");
  const [languages, setLanguages] = useState(false);
  const [idReader, setIDreader] = useState(null);
  const [chapterId, setChapterID] = useState(null);
  const [arabicCH, setArabicCH] = useState(null);
  const [checked, setChecked] = useState("second");

  // Audio playback state.
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [shuffle, setShuffle] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [track, setTrack] = useState(null);

  // Shared UI and location state.
  const [playlist, setPlaylist] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [color, setColor] = useState(0);
  const [color2, setColor2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Restore saved language and playback selection on app launch.
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
          savedTrack,
          savedPlaylists,
        ] = await Promise.all([
          AsyncStorage.getItem("checked"),
          AsyncStorage.getItem("reciter"),
          AsyncStorage.getItem("chapterId"),
          AsyncStorage.getItem("idReader"),
          AsyncStorage.getItem("reciterAR"),
          AsyncStorage.getItem("idChapter"),
          AsyncStorage.getItem("chapterAR"),
          AsyncStorage.getItem("currentTrackUrl"),
          AsyncStorage.getItem("userPlaylists"),
        ]);

        if (savedChecked) {
          setChecked(savedChecked);
          setLanguages(savedChecked === "first");
        }
        if (savedReciter) setReciter(savedReciter);
        if (savedReciterAR) setReciterAR(savedReciterAR);
        if (savedChapter) setChapterID(savedChapter);
        if (savedIdReader) {
          const reciterId = Number(savedIdReader);
          setIDreader(reciterId);
          setColor(reciterId);
        }
        if (savedChapterID) {
          const chapterNumber = Number(savedChapterID);
          setIDchapter(chapterNumber);
          setColor2(chapterNumber);
        }
        if (savedChapterAr) setArabicCH(savedChapterAr);
        if (savedTrack) setTrack(savedTrack);
        if (savedPlaylists) {
          const parsedPlaylists = JSON.parse(savedPlaylists);
          setUserPlaylists(
            Array.isArray(parsedPlaylists)
              ? parsedPlaylists.map((savedPlaylist) => ({
                  ...savedPlaylist,
                  id: String(savedPlaylist.id),
                  items: Array.isArray(savedPlaylist.items)
                    ? savedPlaylist.items
                    : [],
                }))
              : []
          );
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    initializeState();
  }, []);

  // Persist selection changes alongside their in-memory state.
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

  const createUserPlaylist = useCallback(async (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const currentPlaylists = await readUserPlaylists(userPlaylists);
    const createdPlaylist = {
      id: `${Date.now()}`,
      name: trimmedName,
      items: [],
    };
    const updatedPlaylists = [...currentPlaylists, createdPlaylist];
    setUserPlaylists(updatedPlaylists);
    await AsyncStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
    return createdPlaylist.id;
  }, [userPlaylists]);

  const addItemToUserPlaylist = useCallback(async (playlistId, item) => {
    let didAdd = false;
    let foundPlaylist = false;
    const currentPlaylists = await readUserPlaylists(userPlaylists);
    const updatedPlaylists = currentPlaylists.map((savedPlaylist) => {
      if (String(savedPlaylist.id) !== String(playlistId)) return savedPlaylist;
      foundPlaylist = true;

      const alreadyAdded = (savedPlaylist.items || []).some(
        (savedItem) =>
          savedItem.chapterId === item.chapterId &&
          savedItem.reciterId === item.reciterId
      );
      if (alreadyAdded) return savedPlaylist;

      didAdd = true;
      return { ...savedPlaylist, items: [...(savedPlaylist.items || []), item] };
    });

    setUserPlaylists(updatedPlaylists);
    await AsyncStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
    return { added: didAdd, foundPlaylist };
  }, [userPlaylists]);

  const removeItemFromUserPlaylist = useCallback(async (playlistId, itemId) => {
    const updatedPlaylists = userPlaylists.map((savedPlaylist) =>
      String(savedPlaylist.id) === String(playlistId)
        ? { ...savedPlaylist, items: savedPlaylist.items.filter((item) => item.id !== itemId) }
        : savedPlaylist
    );
    setUserPlaylists(updatedPlaylists);
    await AsyncStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
  }, [userPlaylists]);

  const removeUserPlaylist = useCallback(async (playlistId) => {
    const updatedPlaylists = userPlaylists.filter(
      (item) => String(item.id) !== String(playlistId)
    );
    setUserPlaylists(updatedPlaylists);
    await AsyncStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists));
  }, [userPlaylists]);

  // Resolve the audio URL for a reciter and chapter.
  const getAudio = useCallback(async (reciterId, chapterId) => {
    try {
      if (!reciterId || !chapterId) {
        console.warn("getAudio: Missing reciterId or chapterId");
        return null;
      }

      const cacheKey = `${reciterId}:${chapterId}`;
      const cachedUrl = audioUrlCache.get(cacheKey);
      if (cachedUrl) return cachedUrl;
      
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
      
      audioUrlCache.set(cacheKey, audioUrl);
      return audioUrl;
    } catch (error) {
      console.error("Error fetching audio URL:", error);
      return null;
    }
  }, []);

  // Playback actions.
  const playTrack = useCallback(async (track, index) => {
    try {
      if (!track || !track.id) {
        console.error("Invalid track object");
        return;
      }

      setColor2(index);
      setColor(track.id);
      idReciterSaved(track.id);
      setLoading(true);

      // Safely get chapter name with null checks
      const chapterName = track.title?.[index - 1]?.name_simple || track.chapter;
      const chapterNameAR = track.title?.[index - 1]?.name_arabic || track.titleAR;
      const chapterTitles = Array.isArray(track.title)
        ? track.title.map((chapter) => ({
            title: languages
              ? chapter.name_arabic || chapter.name_simple
              : chapter.name_simple || chapter.name_arabic,
            titleEnglish: chapter.name_simple,
            titleArabic: chapter.name_arabic,
          }))
        : undefined;
      
      chapterSaved(chapterName);
      chapterArSaved(chapterNameAR);
      reciterSaved(track.artist);
      reciterARSaved(track.artistAR);
      idChapterSaved(index);

      // Reciter pages already provide audio URLs. Reuse them instead of
      // making another network request before playback.
      const downloadedUri = track.url
        ? null
        : await getDownloadedAudioUri(track.id, index);
      const uri = track.url || downloadedUri || await getAudio(track.id, index);
      
      if (!uri) {
        console.error("Failed to get audio URL");
        return;
      }

      const tracker = {
        id: `${track.id}-${index}`,
        url: uri,
        title: languages ? chapterNameAR : chapterName,
        artist: languages ? track.artistAR : track.artist,
        artwork: track.image || getReciterImage(track.id) || images.trackPlayerIcon,
        reciterId: Number(track.id),
        chapterNumber: Number(index),
        titleEnglish: chapterName,
        titleArabic: chapterNameAR,
        artistEnglish: track.artist,
        artistArabic: track.artistAR,
        chapterTitles,
      };

      await TrackPlayer.reset();
      await TrackPlayer.add(tracker);
      await TrackPlayer.play();
      void AsyncStorage.multiSet([
        ["currentTrackUrl", uri],
        ["currentTrackPosition", "0"],
      ]).catch((error) => console.error("Error saving current playback:", error));
      setCurrentTrackIndex(index);
      setTrack(uri);
      setCurrentTrack(Number(index));
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
    } finally {
      setLoading(false);
    }
  }, [getAudio, idReciterSaved, chapterSaved, chapterArSaved, reciterSaved, reciterARSaved, idChapterSaved, languages]);

  const playNext = useCallback(async () => {
    try {
      const fallbackTrack = {
        reciterId: idReader,
        chapterNumber: currentTrack || IDchapter,
        artist: reciter,
        artistAR: reciterAR,
      };

      if (shuffle) {
        const currentChapter = Number(currentTrack || IDchapter);
        const randomOffset = Math.floor(Math.random() * 113) + 1;
        const randomChapter = ((currentChapter - 1 + randomOffset) % 114) + 1;
        await navigateToSurah(randomChapter, fallbackTrack);
      } else {
        await navigateToAdjacentSurah(1, fallbackTrack);
      }
    } catch (error) {
      console.error("Error playing next track:", error);
    }
  }, [idReader, currentTrack, IDchapter, reciter, reciterAR, shuffle]);

  const playPrevious = useCallback(async () => {
    try {
      await navigateToAdjacentSurah(-1, {
        reciterId: idReader,
        chapterNumber: currentTrack || IDchapter,
        artist: reciter,
        artistAR: reciterAR,
      });
    } catch (error) {
      console.error("Error playing previous track:", error);
    }
  }, [idReader, currentTrack, IDchapter, reciter, reciterAR]);

  const setTrackList = useCallback((trackList) => {
    setTracks(trackList);
  }, []);

  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      const queue = await TrackPlayer.getQueue();

      // A force-closed app may have saved the mini-player metadata but no queue.
      if (queue.length === 0 && track) {
        const savedPosition = Number(
          await AsyncStorage.getItem("currentTrackPosition")
        ) || 0;
        await TrackPlayer.add({
          id: String(idReader ?? "restored-track"),
          url: track,
          title: languages ? arabicCH : chapterId,
          artist: languages ? reciterAR : reciter,
          artwork: getReciterImage(idReader) || images.trackPlayerIcon,
          reciterId: Number(idReader),
          chapterNumber: Number(IDchapter),
          titleEnglish: chapterId,
          titleArabic: arabicCH,
          artistEnglish: reciter,
          artistArabic: reciterAR,
        });
        if (savedPosition > 0) await TrackPlayer.seekTo(savedPosition);
      }

      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  }, [
    isPlaying,
    track,
    idReader,
    IDchapter,
    languages,
    arabicCH,
    chapterId,
    reciterAR,
    reciter,
  ]);

  // Advance the shuffled queue only once when a track reaches its end.
  useEffect(() => {
    const endedListener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        if (shuffle) void playNext();
      }
    );
    const activeTrackListener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async ({ track: activeTrack, index }) => {
        const chapterNumber = Number(activeTrack?.chapterNumber);
        if (!activeTrack || !chapterNumber) return;

        setCurrentTrack(chapterNumber);
        setCurrentTrackIndex(index ?? chapterNumber - 1);
        setTrack(activeTrack.url);
        setCurrentTrackId(activeTrack.id);
        setIsPlaying(true);
        if (activeTrack.reciterId) {
          setColor(activeTrack.reciterId);
          idReciterSaved(activeTrack.reciterId);
        }
        setColor2(chapterNumber);
        await AsyncStorage.setItem("currentTrackUrl", activeTrack.url);
        await idChapterSaved(chapterNumber);
        await AsyncStorage.setItem("currentTrackPosition", "0");
        await chapterSaved(activeTrack.titleEnglish || activeTrack.title);
        if (activeTrack.titleArabic) await chapterArSaved(activeTrack.titleArabic);
        if (activeTrack.artistEnglish || activeTrack.artist) {
          await reciterSaved(activeTrack.artistEnglish || activeTrack.artist);
        }
        if (activeTrack.artistArabic) await reciterARSaved(activeTrack.artistArabic);
      }
    );

    return () => {
      endedListener.remove();
      activeTrackListener.remove();
    };
  }, [
    shuffle,
    playNext,
    idReciterSaved,
    idChapterSaved,
    chapterSaved,
    chapterArSaved,
    reciterSaved,
    reciterARSaved,
    setColor,
    setColor2,
  ]);

  // Preserve the existing flat context API for current screen consumers.
  const contextValue = useMemo(() => ({
    reciter,
    setReciter: reciterSaved,
    currentTrackId,
    setCurrentTrackId,
    reciterAR,
    setReciterAR,
    idReader,
    setIDreader: idReciterSaved,
    languages,
    setLanguages,
    chapterId,
    setChapterID: chapterSaved,
    modalVisible,
    setModalVisible,
    arabicCH,
    setArabicCH,
    saveCheck,
    checked,
    playlist,
    setPlaylist,
    userPlaylists,
    createUserPlaylist,
    addItemToUserPlaylist,
    removeItemFromUserPlaylist,
    removeUserPlaylist,
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
  }), [
    reciter, reciterSaved, currentTrackId, reciterAR, idReader,
    idReciterSaved, languages, chapterId, chapterSaved, modalVisible, arabicCH,
    saveCheck, checked, playlist, userPlaylists, createUserPlaylist,
    addItemToUserPlaylist, removeItemFromUserPlaylist, removeUserPlaylist,
    IDchapter, shuffle, togglePlayback, currentTrack,
    tracks, currentTrackIndex, playTrack, playNext, playPrevious, setTrackList,
    isPlaying, color, color2, loading, track, currentLocation,
  ]);

  return (
    <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
  );
});

export default GlobalProvider;
