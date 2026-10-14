import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const DOWNLOADS_KEY = "offlineRecitations";
const DOWNLOAD_DIRECTORY = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}quran-downloads/`
  : null;

const readDownloads = async () => {
  try {
    const value = await AsyncStorage.getItem(DOWNLOADS_KEY);
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not read offline recitations:", error);
    return [];
  }
};

export const getOfflineRecitations = async () => {
  const downloads = await readDownloads();
  const available = [];
  for (const item of downloads) {
    if (!item.localUri) continue;
    const file = await FileSystem.getInfoAsync(item.localUri);
    if (file.exists) available.push(item);
  }

  if (available.length !== downloads.length) {
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(available));
  }
  return available;
};

export const getDownloadedRecitation = async (reciterId, chapterId) => {
  const id = `${reciterId}-${chapterId}`;
  const downloads = await readDownloads();
  const saved = downloads.find((item) => item.id === id);
  if (!saved) return null;

  const file = await FileSystem.getInfoAsync(saved.localUri);
  return file.exists ? saved : null;
};

export const getDownloadedAudioUri = async (reciterId, chapterId) => {
  const saved = await getDownloadedRecitation(reciterId, chapterId);
  return saved?.localUri || null;
};

export const downloadRecitation = async (recitation) => {
  const { reciterId, chapterId, audioUrl } = recitation;
  if (!reciterId || !chapterId || !audioUrl) {
    throw new Error("This recitation is missing its audio information.");
  }

  const existing = await getDownloadedRecitation(reciterId, chapterId);
  if (existing) return existing;
  if (!DOWNLOAD_DIRECTORY) {
    throw new Error("Device storage is not available.");
  }

  const directory = await FileSystem.getInfoAsync(DOWNLOAD_DIRECTORY);
  if (!directory.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOAD_DIRECTORY, { intermediates: true });
  }
  const localUri = `${DOWNLOAD_DIRECTORY}${reciterId}-${chapterId}.mp3`;
  const result = await FileSystem.downloadAsync(audioUrl, localUri);
  if (result.status < 200 || result.status >= 300) {
    await FileSystem.deleteAsync(localUri, { idempotent: true });
    throw new Error(`Download failed (${result.status}).`);
  }

  const saved = {
    ...recitation,
    id: `${reciterId}-${chapterId}`,
    localUri: result.uri,
    downloadedAt: Date.now(),
  };
  const downloads = await readDownloads();
  await AsyncStorage.setItem(
    DOWNLOADS_KEY,
    JSON.stringify([...downloads.filter((item) => item.id !== saved.id), saved])
  );
  return saved;
};

export const removeOfflineRecitation = async (id) => {
  const downloads = await readDownloads();
  const saved = downloads.find((item) => item.id === id);
  if (saved?.localUri) {
    await FileSystem.deleteAsync(saved.localUri, { idempotent: true });
  }
  await AsyncStorage.setItem(
    DOWNLOADS_KEY,
    JSON.stringify(downloads.filter((item) => item.id !== id))
  );
};
