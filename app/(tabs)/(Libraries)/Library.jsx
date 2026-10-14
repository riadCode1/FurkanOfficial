<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import PlayList from "../../../components/PlayList";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/images";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";
import {
  getOfflineRecitations,
  removeOfflineRecitation,
} from "../../../constants/offlineDownloads";
import { getReciterImage } from "../../../constants/reciterArtwork";
import { isTrackSelected } from "../../../constants/trackSelection";

const Library = () => {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [offlineRecitations, setOfflineRecitations] = useState([]);
  const isFocused = useIsFocused();
  const { languages, userPlaylists, createUserPlaylist, removeUserPlaylist, playTrack, color, color2 } = useGlobalContext();

  useEffect(() => {
    if (!isFocused) return;
    getOfflineRecitations()
      .then(setOfflineRecitations)
      .catch((error) => console.error("Could not load offline recitations:", error));
  }, [isFocused]);

  const handlePlayOffline = (item) => {
    playTrack(
      {
        id: Number(item.reciterId),
        url: item.localUri,
        chapter: item.chapterName,
        titleAR: item.chapterArabic,
        artist: item.reciterName,
        artistAR: item.reciterArabic,
      },
      Number(item.chapterId)
    );
  };

  const handleRemoveOffline = async (item) => {
    try {
      await removeOfflineRecitation(item.id);
      setOfflineRecitations((saved) => saved.filter((entry) => entry.id !== item.id));
    } catch (error) {
      console.error("Could not remove offline recitation:", error);
      Alert.alert("Could not remove download", "Please try again.");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlistToDelete) return;
    await removeUserPlaylist(playlistToDelete.id);
    setPlaylistToDelete(null);
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      Alert.alert(
        languages ? "سمِّ قائمة التشغيل" : "Name your playlist",
        languages ? "أدخل اسمًا قبل إنشاء قائمة التشغيل." : "Enter a name before creating the playlist.",
      );
      return;
    }

    await createUserPlaylist(playlistName);
    setPlaylistName("");
    setCreateModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.pageContent}
        contentContainerStyle={styles.pageContentContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>{languages ? "مجموعتك" : "YOUR COLLECTION"}</Text>
          <Text style={styles.title}>{languages ? String.fromCharCode(0x0627, 0x0644, 0x0645, 0x0643, 0x062A, 0x0628, 0x0629) : "Your Library"}</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={languages ? "إنشاء قائمة تشغيل" : "Create playlist"}
          onPress={() => setCreateModalVisible(true)}
          style={styles.createButton}
        >
          <MaterialIcons name="add" size={23} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={["#12345B", "#0B1D3B", "#09172D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureCard}
      >
        <View style={styles.featureIcon}>
          <MaterialIcons name="queue-music" size={26} color={Colors.blue} />
        </View>
        <View style={styles.featureCopy}>
          <Text style={styles.featureTitle}>{languages ? "أنشئ قائمة التشغيل الخاصة بك" : "Create your own playlist"}</Text>
          <Text style={styles.featureSubtitle}>{languages ? "اجمع التلاوات التي تحبها في مكان واحد." : "Keep the recitations you love together."}</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={languages ? "إنشاء قائمة تشغيل" : "Create a playlist"}
          onPress={() => setCreateModalVisible(true)}
          style={styles.featureAction}
        >
          <MaterialIcons name="arrow-forward" size={20} color={Colors.background} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>{languages ? "قوائم التشغيل" : "Your playlists"}</Text>
          <Text style={styles.sectionSubtitle}>{languages ? "مخصصة للاستماع إليها" : "Made for your listening"}</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{userPlaylists.length}</Text>
        </View>
      </View>

      {userPlaylists.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.playlistList}
        >
          {userPlaylists.map((playlist) => (
            <View
              key={playlist.id}
              style={styles.playlistCard}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Open ${playlist.name}`}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(Libraries)/[playlistId]",
                    params: { playlistId: playlist.id },
                  })
                }
              >
              <View style={styles.coverWrap}>
                <Image source={images.quranCover} contentFit="cover" style={styles.cover} />
                <LinearGradient
                  pointerEvents="none"
                  colors={["transparent", "rgba(4, 13, 29, 0.82)"]}
                  style={styles.coverShade}
                />
                <View style={styles.coverIcon}>
                  <MaterialIcons name="queue-music" size={21} color={Colors.blue} />
                </View>
              </View>
              <Text numberOfLines={1} style={styles.playlistName}>{playlist.name}</Text>
              <Text style={styles.playlistCount}>{playlist.items.length} {languages ? "تلاوات" : "recitations"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={languages ? `حذف ${playlist.name}` : `Delete ${playlist.name}`}
                onPress={() => setPlaylistToDelete(playlist)}
                style={styles.deletePlaylistButton}
              >
                <MaterialIcons name="delete-outline" size={19} color={Colors.textGray} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setCreateModalVisible(true)}
          style={styles.emptyPlaylist}
        >
          <View style={styles.emptyIcon}>
            <MaterialIcons name="add" size={22} color={Colors.blue} />
          </View>
          <View style={styles.emptyTextWrap}>
            <Text style={styles.emptyTitle}>{languages ? "ابدأ بقائمة تشغيل جديدة" : "Start with a new playlist"}</Text>
            <Text style={styles.emptyHint}>{languages ? "أضف السور والقراء أثناء الاستماع." : "Add chapters and reciters as you listen."}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.textGray} />
        </TouchableOpacity>
      )}

      <View style={styles.savedHeading}>
        <View>
          <Text style={styles.sectionTitle}>{languages ? "التنزيلات" : "Downloads"}</Text>
          <Text style={styles.sectionSubtitle}>{languages ? "استمع دون اتصال بالإنترنت" : "Listen without an internet connection"}</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{offlineRecitations.length}</Text>
        </View>
      </View>
      <View style={styles.downloadList}>
        {offlineRecitations.length ? offlineRecitations.map((item) => (
          <View
            key={item.id}
            style={[
              styles.downloadItem,
              isTrackSelected(color, color2, item.reciterId, item.chapterId) && styles.downloadItemSelected,
            ]}
          >
            <Image
              source={{ uri: getReciterImage(item.reciterId) || undefined }}
              contentFit="cover"
              style={styles.downloadArtwork}
            />
            <View style={styles.downloadInfo}>
              <Text numberOfLines={1} style={styles.downloadChapter}>
                {languages ? item.chapterArabic : item.chapterName}
              </Text>
              <Text numberOfLines={1} style={styles.downloadReciter}>
                {languages ? item.reciterArabic : item.reciterName}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Play ${item.chapterName} offline`}
              onPress={() => handlePlayOffline(item)}
              style={styles.downloadAction}
            >
              <MaterialIcons name="play-arrow" size={23} color={Colors.blue} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.chapterName} download`}
              onPress={() => handleRemoveOffline(item)}
              style={styles.downloadAction}
            >
              <MaterialIcons name="delete-outline" size={21} color={Colors.textGray} />
            </TouchableOpacity>
          </View>
        )) : (
          <Text style={styles.emptyDownloads}>
            {languages ? "لم يتم تنزيل أي سورة بعد." : "No Surahs downloaded yet. Download one from a reciter’s Surah list."}
          </Text>
        )}
      </View>

      <View style={styles.savedHeading}>
        <View>
          <Text style={styles.sectionTitle}>{languages ? String.fromCharCode(0x0627, 0x0644, 0x0645, 0x062D, 0x0641, 0x0648, 0x0638, 0x0627, 0x062A) : "Saved recitations"}</Text>
          <Text style={styles.sectionSubtitle}>{languages ? "السور التي حفظتها" : "Your bookmarked chapters"}</Text>
        </View>
        <MaterialIcons name="bookmark-border" size={22} color={Colors.blue} />
      </View>
      <View style={styles.savedList}>
        <PlayList />
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{languages ? "إنشاء قائمة تشغيل" : "Create playlist"}</Text>
              <TouchableOpacity
              accessibilityLabel={languages ? "إغلاق" : "Close"}
                onPress={() => setCreateModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={22} color={Colors.textGray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>{languages ? "اختر اسمًا لقائمة التشغيل." : "Give your listening list a name."}</Text>
            <TextInput
              autoFocus
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder={languages ? "اسم قائمة التشغيل" : "Playlist name"}
              placeholderTextColor="#8190aa"
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleCreatePlaylist}
              style={styles.nameInput}
            />
            <TouchableOpacity onPress={handleCreatePlaylist} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>{languages ? "إنشاء قائمة التشغيل" : "Create playlist"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={Boolean(playlistToDelete)}
        onRequestClose={() => setPlaylistToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <MaterialIcons name="delete-outline" size={25} color="#FF7474" />
            </View>
            <Text style={styles.confirmTitle}>{languages ? "حذف قائمة التشغيل؟" : "Delete playlist?"}</Text>
            <Text style={styles.confirmMessage}>
              {playlistToDelete?.name
                ? languages
                  ? `سيتم حذف «${playlistToDelete.name}» والتلاوات المحفوظة فيها.`
                  : `“${playlistToDelete.name}” and its saved recitations will be removed.`
                : languages
                  ? "سيتم حذف قائمة التشغيل والتلاوات المحفوظة فيها."
                  : "This playlist and its saved recitations will be removed."}
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity onPress={() => setPlaylistToDelete(null)} style={styles.cancelDeleteButton}>
                <Text style={styles.cancelDeleteText}>{languages ? "إلغاء" : "Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletePlaylist} style={styles.confirmDeleteButton}>
                <Text style={styles.confirmDeleteText}>{languages ? "حذف القائمة" : "Delete playlist"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
=======
import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PlayList from "../../../components/PlayList";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Library = ({}) => {
  const { languages } = useGlobalContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: Colors.text, fontSize: 20, fontWeight: "bold" }}>
          {languages ? "المكتبة" : "Library"}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <PlayList />
      </View>

      {/* Modal */}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 8 },
  pageContent: { flex: 1 },
  pageContentContent: { paddingBottom: 180 },
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: { color: Colors.blue, fontSize: 9, fontWeight: "800", letterSpacing: 1.6, marginBottom: 4 },
  title: { color: Colors.text, fontSize: 27, fontWeight: "700", letterSpacing: -0.5 },
  createButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.35)",
    backgroundColor: Colors.blue,
  },
  featureCard: {
    minHeight: 108,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(72, 131, 196, 0.32)",
    overflow: "hidden",
  },
  featureIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(3, 218, 197, 0.12)",
  },
  featureCopy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  featureTitle: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  featureSubtitle: { color: "#9DB0CA", fontSize: 11, lineHeight: 16, marginTop: 4 },
  featureAction: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: Colors.blue,
  },
  sectionHeading: {
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: "700" },
  sectionSubtitle: { color: Colors.textGray, fontSize: 11, marginTop: 3 },
  countPill: {
    minWidth: 30,
    height: 26,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "rgba(3, 218, 197, 0.12)",
  },
  countText: { color: Colors.blue, fontSize: 12, fontWeight: "700" },
  playlistList: { paddingHorizontal: 20, gap: 12, paddingBottom: 3 },
  playlistCard: {
    width: 136,
    paddingBottom: 11,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(80, 129, 184, 0.26)",
    backgroundColor: "#0B1C36",
  },
  deletePlaylistButton: {
    position: "absolute",
    top: 7,
    end: 7,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "rgba(7, 20, 38, 0.9)",
  },
  coverWrap: { height: 104, position: "relative" },
  cover: { width: "100%", height: "100%" },
  coverShade: { ...StyleSheet.absoluteFillObject },
  coverIcon: {
    position: "absolute",
    end: 9,
    bottom: 9,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(7, 20, 38, 0.92)",
  },
  playlistName: { marginHorizontal: 10, marginTop: 10, color: Colors.text, fontSize: 13, fontWeight: "700" },
  playlistCount: { marginHorizontal: 10, marginTop: 4, color: Colors.textGray, fontSize: 10 },
  emptyPlaylist: {
    minHeight: 78,
    marginHorizontal: 20,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(80, 129, 184, 0.28)",
    backgroundColor: "#0B1C36",
  },
  emptyIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(3, 218, 197, 0.12)",
  },
  emptyTextWrap: { flex: 1 },
  emptyTitle: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  emptyHint: { color: Colors.textGray, fontSize: 11, marginTop: 4 },
  savedHeading: {
    marginTop: 22,
    marginBottom: 4,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  savedList: { width: "100%" },
  downloadList: { paddingHorizontal: 20 },
  downloadItem: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169, 177, 188, 0.14)",
  },
  downloadItemSelected: { backgroundColor: Colors.barbottom, borderLeftWidth: 3, borderLeftColor: Colors.blue },
  downloadArtwork: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#102541" },
  downloadInfo: { flex: 1 },
  downloadChapter: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  downloadReciter: { color: Colors.textGray, fontSize: 12, marginTop: 4 },
  downloadAction: { width: 38, height: 42, alignItems: "center", justifyContent: "center" },
  emptyDownloads: { color: Colors.textGray, paddingVertical: 14, fontSize: 13, lineHeight: 19 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },
  modalCard: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.28)",
    backgroundColor: Colors.background,
  },
  confirmCard: { padding: 22, alignItems: "center", borderRadius: 22, borderWidth: 1, borderColor: "rgba(80, 129, 184, 0.35)", backgroundColor: "#0B1C36" },
  confirmIcon: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "rgba(255, 116, 116, 0.12)" },
  confirmTitle: { color: Colors.text, fontSize: 19, fontWeight: "700", marginTop: 14 },
  confirmMessage: { color: Colors.textGray, fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 7 },
  confirmActions: { width: "100%", flexDirection: "row", gap: 10, marginTop: 22 },
  cancelDeleteButton: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: "rgba(169, 177, 188, 0.22)", backgroundColor: "#102541" },
  cancelDeleteText: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  confirmDeleteButton: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#C94F5A" },
  confirmDeleteText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { color: Colors.text, fontSize: 20, fontWeight: "700" },
  closeButton: { padding: 4 },
  modalSubtitle: { color: Colors.textGray, fontSize: 13, marginTop: 4 },
  nameInput: {
    height: 48,
    marginTop: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(169, 177, 188, 0.25)",
    borderRadius: 12,
    color: Colors.text,
  },
  saveButton: {
    height: 46,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: Colors.blue,
  },
  saveButtonText: { color: Colors.background, fontSize: 14, fontWeight: "700" },
=======
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",

    padding: 16,
    marginBottom: 40,
  },
  goBackButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.tint,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  scrollContainer: {
    height: 94,
  },
  scrollView: {
    marginTop: 32,
    alignSelf: "center",
    height: 40,
  },

  button: {
    width: 102,
    height: 38,
    backgroundColor: "#373597",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 16,
  },
  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",

    width: 48,
    elevation: 50,
    height: 48,
    zIndex: 99,
    backgroundColor: "#454B8C",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  buttonsContainer: {},
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonText: {
    marginBottom: 8,
  },
  tabUnderline: {
    width: 112,
    height: 1,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "90%",
    height: 250,
    padding: 20,
    backgroundColor: "#343C66",
    borderRadius: 10,

    elevation: 10, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: 700,
    marginBottom: 32,
  },

  searchBarContainer: {
    borderRadius: 8,
    paddingHorizontal: 16,

    backgroundColor: "#454B8C",
    height: 48,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    width: 290,
    color: "white",
  },
  filters: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  customRadius: {
    width: "45%",
    height: 48,
    borderRadius: 10,
    borderColor: Colors.tintLight,
    backgroundColor: Colors.tintLight,
  },
  customRadius2: {
    width: "49%",
    borderRadius: 10,
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
  },
  filterText: {
    color: Colors.textGray,
    fontSize: 16,
  },
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
});

export default Library;
