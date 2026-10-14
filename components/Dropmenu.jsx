import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalContext } from "../context/GlobalProvider";
import {
  downloadRecitation,
  getDownloadedRecitation,
} from "../constants/offlineDownloads";

const Dropmenu = ({
  reciterName,
  chapteID,
  arabName,
  chapter,
  chapterAr,
  mp3,
  reciterID,
  RemoveItem = false,
  Remove,
}) => {
  const SaveListe = [
    {
      id: chapteID,
      arabName: arabName,
      chapter: chapter,
      uri: mp3,
      chapterAr: chapterAr,
      reciterName: reciterName,
      reciterID: reciterID,
    },
  ];

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [playlistPickerVisible, setPlaylistPickerVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const focused = useIsFocused(); // State to track if the item is saved
  const {
    languages,
    userPlaylists,
    createUserPlaylist,
    addItemToUserPlaylist,
  } = useGlobalContext();

  const playlistItem = {
    id: `${reciterID}-${chapteID}`,
    chapterId: Number(chapteID),
    chapter,
    chapterAr,
    reciterId: Number(reciterID),
    reciterName,
    arabName,
  };

  const addToUserPlaylist = async (playlistId) => {
    try {
      const result = await addItemToUserPlaylist(playlistId, playlistItem);
      setPlaylistPickerVisible(false);
      if (!result.foundPlaylist) {
        Alert.alert("Playlist unavailable", "Create the playlist again, then add this recitation.");
      } else if (!result.added) {
        Alert.alert("Already added", "This recitation is already in that playlist.");
      }
    } catch (error) {
      console.error("Failed to add recitation to playlist:", error);
      Alert.alert("Could not add recitation", "Please try again.");
    }
  };

  const handleDownload = async () => {
    if (isDownloading || isDownloaded) return;
    if (!mp3) {
      Alert.alert("Download unavailable", "The audio URL is not available yet.");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadRecitation({
        reciterId: Number(reciterID),
        chapterId: Number(chapteID),
        reciterName,
        reciterArabic: arabName,
        chapterName: chapter,
        chapterArabic: chapterAr,
        audioUrl: mp3,
      });
      setIsDownloaded(true);
      Alert.alert("Downloaded", "This Surah is ready to listen to offline.");
    } catch (error) {
      console.error("Could not download recitation:", error);
      Alert.alert("Download failed", "Check your connection and try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const createAndAddPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Name your playlist", "Enter a name before creating the playlist.");
      return;
    }

    try {
      const playlistId = await createUserPlaylist(newPlaylistName);
      if (playlistId) {
        const result = await addItemToUserPlaylist(playlistId, playlistItem);
        if (result.added) {
          setNewPlaylistName("");
          setPlaylistPickerVisible(false);
        } else {
          Alert.alert("Could not add recitation", "The playlist was created, but the recitation could not be added.");
        }
      }
    } catch (error) {
      console.error("Failed to create playlist:", error);
      Alert.alert("Could not create playlist", "Please try again.");
    }
  };

  const saveToPlaylist = async (list) => {
    setIsSaved(true);

    await AsyncStorage.getItem("playList").then((token) => {
      const res = JSON.parse(token);

      if (res !== null) {
        let data = res.find(
          (val) => val.id === list.id && val.reciterID === list.reciterID
        );
        if (data == null) {
          res.push(list);
          AsyncStorage.setItem("playList", JSON.stringify(res));
          setAlertVisible(true);
          setTimeout(() => {
            setAlertVisible(false);
          }, 2000);
        }
      } else {
        let bookmark = [];
        bookmark.push(list);
        AsyncStorage.setItem("playList", JSON.stringify(bookmark));
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 2000);
      }
    });
  };

  const removeFromPlaylist = async (item) => {
    if (RemoveItem && Remove) {
      await Remove(item);
      setIsSaved(false);
      setAlertVisible2(true);
      setTimeout(() => setAlertVisible2(false), 2000);
      return;
    }

    setIsSaved(false);
    const bookMark = await AsyncStorage.getItem("playList").then((token) => {
      const res = JSON.parse(token);
      return (res || []).filter(
        (id) => !(id.reciterID === item.reciterID && id.id === item.id)
      );
    });
    await AsyncStorage.setItem("playList", JSON.stringify(bookMark));
    setAlertVisible2(true);

    setTimeout(() => {
      setAlertVisible2(false);
    }, 2000);
  };
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem("playList")
      .then((token) => {
        const savedItems = JSON.parse(token || "[]");
        const saved = savedItems.some(
          (item) => item.id === chapteID && item.reciterID === reciterID
        );
        if (isMounted) setIsSaved(saved);
      })
      .catch((error) => console.error("Could not load saved recitations:", error));

    getDownloadedRecitation(reciterID, chapteID)
      .then((saved) => {
        if (isMounted) setIsDownloaded(Boolean(saved));
      })
      .catch((error) => console.error("Could not check downloaded recitation:", error));

    return () => {
      isMounted = false;
    };
  }, [focused, chapteID, reciterID]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={isDownloaded ? "Downloaded for offline listening" : "Download for offline listening"}
        activeOpacity={0.8}
        disabled={isDownloaded || isDownloading}
        style={styles.actionButton}
        onPress={handleDownload}
      >
        <MaterialIcons
          name={isDownloading ? "downloading" : isDownloaded ? "download-done" : "file-download"}
          size={24}
          color={isDownloaded ? Colors.blue : "white"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.actionButton}
        onPress={() => (isSaved
          ? removeFromPlaylist(SaveListe[0])
          : saveToPlaylist(SaveListe[0]))}
      >
        {isSaved ? (
          <MaterialIcons
            name="bookmark"
            size={24}
            color={Colors.blue} // Color changes when saved
          />
        ) : (
          <MaterialIcons
            name="bookmark-outline"
            size={24}
            color='white' // Color changes when saved
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Add to a playlist"
        activeOpacity={0.8}
        style={styles.actionButton}
        onPress={() => setPlaylistPickerVisible(true)}
      >
        <MaterialIcons name="playlist-add" size={25} color="white" />
      </TouchableOpacity>

      {/*Alert modal */}

      {languages ? (
        <Modal transparent={true} animationType="slide" visible={alertVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>حفظ!</Text>
              <Text style={styles.alertMessage}>
                تمت إضافته السورة إلى المكتبة
              </Text>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal transparent={true} animationType="slide" visible={alertVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{languages ? "تم الحفظ" : "Saved!"}</Text>
              <Text style={styles.alertMessage}>
                {languages ? "تمت إضافة السورة إلى المحفوظات" : "Chapter added to saved recitations"}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      {/*Alert modal2 */}
      {languages ? (
        <Modal transparent={true} animationType="slide" visible={alertVisible2}>
          <View style={styles.modalOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>تمت الإزالة</Text>
              <Text style={styles.alertMessage}>
                تمت إزالته السورة  من  المكتبة
              </Text>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal transparent={true} animationType="slide" visible={alertVisible2}>
          <View style={styles.modalOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{languages ? "تمت الإزالة" : "Removed"}</Text>
              <Text style={styles.alertMessage}>
                {languages ? "تمت إزالة السورة من المحفوظات" : "Chapter removed from saved recitations"}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={playlistPickerVisible}
        onRequestClose={() => setPlaylistPickerVisible(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{languages ? "إضافة إلى قائمة التشغيل" : "Add to playlist"}</Text>
              <TouchableOpacity
                accessibilityLabel="Close playlist picker"
                onPress={() => setPlaylistPickerVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={22} color={Colors.textGray} />
              </TouchableOpacity>
            </View>

            <Text style={styles.pickerSubtitle}>{languages ? "اختر قائمة تشغيل أو أنشئ قائمة جديدة." : "Choose a playlist or create a new one."}</Text>
            <ScrollView style={styles.playlistOptions} keyboardShouldPersistTaps="handled">
              {userPlaylists.map((savedPlaylist) => (
                <TouchableOpacity
                  key={savedPlaylist.id}
                  accessibilityRole="button"
                  onPress={() => addToUserPlaylist(savedPlaylist.id)}
                  style={styles.playlistOption}
                >
                  <MaterialIcons name="queue-music" size={21} color={Colors.blue} />
                  <Text numberOfLines={1} style={styles.playlistOptionName}>{savedPlaylist.name}</Text>
                  <Text style={styles.playlistCount}>{savedPlaylist.items.length}</Text>
                </TouchableOpacity>
              ))}
              {userPlaylists.length === 0 && (
                <Text style={styles.emptyPlaylistText}>{languages ? "لم تنشئ قائمة تشغيل بعد." : "You haven’t created a playlist yet."}</Text>
              )}
            </ScrollView>

            <TextInput
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="New playlist name"
              placeholderTextColor="#8190aa"
              returnKeyType="done"
              maxLength={40}
              style={styles.playlistInput}
            />
            <TouchableOpacity
              accessibilityRole="button"
              onPress={createAndAddPlaylist}
              style={styles.createButton}
            >
              <MaterialIcons name="add" size={20} color={Colors.background} />
              <Text style={styles.createButtonText}>{languages ? "إنشاء وإضافة" : "Create and add"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionButton: {
    width: 40,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },
  pickerCard: {
    maxHeight: "80%",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.28)",
    backgroundColor: Colors.background,
  },
  pickerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pickerTitle: { color: Colors.text, fontSize: 20, fontWeight: "700" },
  closeButton: { padding: 4 },
  pickerSubtitle: { color: Colors.textGray, fontSize: 13, marginTop: 4, marginBottom: 12 },
  playlistOptions: { maxHeight: 220 },
  playlistOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169, 177, 188, 0.14)",
  },
  playlistOptionName: { flex: 1, color: Colors.text, fontSize: 14 },
  playlistCount: { color: Colors.textGray, fontSize: 12 },
  emptyPlaylistText: { color: Colors.textGray, paddingVertical: 12, fontSize: 13 },
  playlistInput: {
    height: 48,
    marginTop: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(169, 177, 188, 0.25)",
    borderRadius: 12,
    color: Colors.text,
  },
  createButton: {
    height: 46,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 14,
    backgroundColor: Colors.blue,
  },
  createButtonText: { color: Colors.background, fontSize: 14, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.0)",
  },
  alertBox: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,

    height: 80,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default Dropmenu;
