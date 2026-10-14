import TrackPlayer from "react-native-track-player";
import { NewData } from "./NewData";
import { getDownloadedAudioUri } from "./offlineDownloads";
import { getReciterImage } from "./reciterArtwork";

const QURAN_API_URL = "https://api.quran.com/api/v4";

export const navigateToSurah = async (chapterNumber, fallbackTrack = {}) => {
  const currentTrack = await TrackPlayer.getActiveTrack();
  const idParts = String(currentTrack?.id || "").match(/^(\d+)-(\d+)$/);
  const reciterId = Number(
    currentTrack?.reciterId ?? fallbackTrack.reciterId ?? idParts?.[1] ?? currentTrack?.id
  );
  const currentChapter = Number(
    currentTrack?.chapterNumber ?? fallbackTrack.chapterNumber ?? idParts?.[2]
  );

  if (!reciterId || !currentChapter) {
    throw new Error("The active track is missing reciter or chapter information.");
  }

  if (chapterNumber < 1 || chapterNumber > 114) return;

  let audioUrl = await getDownloadedAudioUri(reciterId, chapterNumber);
  const customReciter = NewData.recitations.find(
    (reciter) => reciter.id === reciterId && reciter.audio_files
  );
  audioUrl ||= customReciter?.audio_files.find(
    (audioFile) => audioFile.chapter_id === chapterNumber
  )?.audio_url;

  if (!audioUrl && !customReciter) {
    const response = await fetch(
      `${QURAN_API_URL}/chapter_recitations/${reciterId}/${chapterNumber}`
    );
    if (!response.ok) {
      throw new Error(`Could not load Surah ${chapterNumber}: ${response.status}`);
    }

    const data = await response.json();
    audioUrl = data?.audio_file?.audio_url;
  }
  if (!audioUrl) throw new Error(`No audio is available for Surah ${chapterNumber}.`);

  const chapterTitles = currentTrack?.chapterTitles || fallbackTrack.chapterTitles;
  const chapter = chapterTitles?.[chapterNumber - 1];
  const nextTrack = {
    id: `${reciterId}-${chapterNumber}`,
    url: audioUrl,
    title: chapter?.title || `Surah ${chapterNumber}`,
    artist: currentTrack?.artist || fallbackTrack.artist,
    artistAR: currentTrack?.artistAR || fallbackTrack.artistAR,
    artwork: currentTrack?.artwork || fallbackTrack.artwork || getReciterImage(reciterId),
    reciterId,
    chapterNumber,
    titleEnglish: chapter?.titleEnglish || chapter?.title || `Surah ${chapterNumber}`,
    titleArabic: chapter?.titleArabic,
    chapterTitles,
  };

  await TrackPlayer.reset();
  await TrackPlayer.add(nextTrack);
  await TrackPlayer.play();
};

export const navigateToAdjacentSurah = async (direction, fallbackTrack = {}) => {
  const currentTrack = await TrackPlayer.getActiveTrack();
  const currentChapter = Number(
    currentTrack?.chapterNumber ?? fallbackTrack.chapterNumber
  );
  if (!currentChapter) {
    throw new Error("The active track is missing chapter information.");
  }

  await navigateToSurah(currentChapter + direction, fallbackTrack);
};
