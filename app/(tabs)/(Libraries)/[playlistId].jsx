import React, { useMemo, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import { getReciterImage } from "../../../constants/reciterArtwork";
import { images } from "../../../constants/images";
import Goback from "../../../components/Goback";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";
import { isTrackSelected } from "../../../constants/trackSelection";

const PlaylistDetails = () => {
  const listRef = useRef(null);
  const handleScroll = useScrollToTop(listRef);
  const { playlistId } = useLocalSearchParams();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { userPlaylists, languages, playTrack, removeItemFromUserPlaylist, removeUserPlaylist, color, color2 } =
    useGlobalContext();
  const playlist = useMemo(
    () => userPlaylists.find((item) => String(item.id) === String(playlistId)),
    [userPlaylists, playlistId]
  );

  const playItem = (item) => {
    playTrack({
      ...item,
      id: item.reciterId,
      titleAR: item.chapterAr,
    }, item.chapterId);
  };

  const returnToLibrary = () => {
    router.replace("/(tabs)/(Libraries)/Library");
  };

  const confirmDeletePlaylist = () => {
    if (playlist) setDeleteModalVisible(true);
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    await removeUserPlaylist(playlist.id);
    setDeleteModalVisible(false);
    returnToLibrary();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Goback inline onPress={returnToLibrary} />
        <View style={styles.headerText}>
          <Text numberOfLines={1} style={styles.title}>{playlist?.name || "Playlist"}</Text>
          <Text style={styles.subtitle}>{playlist?.items.length || 0} {languages ? "تلاوات" : "recitations"}</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={languages ? "حذف قائمة التشغيل" : "Delete playlist"}
          onPress={confirmDeletePlaylist}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete-outline" size={22} color={Colors.textGray} />
        </TouchableOpacity>
      </View>

      {playlist?.items.length ? (
        <FlatList
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={playlist.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[
              styles.row,
              isTrackSelected(color, color2, item.reciterId, item.chapterId) && styles.rowSelected,
            ]}>
              <TouchableOpacity onPress={() => playItem(item)} style={styles.playRow}>
                <Image
                  source={
                    getReciterImage(item.reciterId)
                      ? { uri: getReciterImage(item.reciterId) }
                      : images.reciterPlaceholder
                  }
                  contentFit="cover"
                  style={styles.artwork}
                />
                <View style={styles.itemInfo}>
                  <Text numberOfLines={1} style={styles.chapterName}>
                    {languages ? item.chapterAr : item.chapter}
                  </Text>
                  <Text numberOfLines={1} style={styles.reciterName}>
                    {languages ? item.arabName : item.reciterName}
                  </Text>
                </View>
                <MaterialIcons name="play-circle" size={30} color={Colors.blue} />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Remove from playlist"
                onPress={() => removeItemFromUserPlaylist(playlist.id, item.id)}
                style={styles.removeButton}
              >
                <MaterialIcons name="close" size={20} color={Colors.textGray} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="playlist-add" size={48} color={Colors.blue} />
          <Text style={styles.emptyTitle}>{languages ? "قائمة التشغيل فارغة" : "This playlist is empty"}</Text>
          <Text style={styles.emptyHint}>{languages ? "أضف سورة أو قارئًا من قائمته باستخدام زر الإضافة إلى قائمة التشغيل." : "Add a chapter or reciter from its list using the playlist button."}</Text>
        </View>
      )}
      <Modal
        transparent
        animationType="fade"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <MaterialIcons name="delete-outline" size={25} color="#FF7474" />
            </View>
            <Text style={styles.confirmTitle}>{languages ? "حذف قائمة التشغيل؟" : "Delete playlist?"}</Text>
            <Text style={styles.confirmMessage}>
              {playlist?.name
                ? languages
                  ? `سيتم حذف «${playlist.name}» والتلاوات المحفوظة فيها.`
                  : `“${playlist.name}” and its saved recitations will be removed.`
                : languages
                  ? "سيتم حذف قائمة التشغيل والتلاوات المحفوظة فيها."
                  : "This playlist and its saved recitations will be removed."}
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.cancelDeleteButton}>
                <Text style={styles.cancelDeleteText}>{languages ? "إلغاء" : "Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletePlaylist} style={styles.confirmDeleteButton}>
                <Text style={styles.confirmDeleteText}>{languages ? "حذف القائمة" : "Delete playlist"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    minHeight: 76,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(169, 177, 188, 0.12)",
  },
  headerText: { flex: 1 },
  deleteButton: { width: 42, height: 48, alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgba(0, 0, 0, 0.68)" },
  confirmCard: { padding: 22, alignItems: "center", borderRadius: 22, borderWidth: 1, borderColor: "rgba(80, 129, 184, 0.35)", backgroundColor: "#0B1C36" },
  confirmIcon: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "rgba(255, 116, 116, 0.12)" },
  confirmTitle: { color: Colors.text, fontSize: 19, fontWeight: "700", marginTop: 14 },
  confirmMessage: { color: Colors.textGray, fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 7 },
  confirmActions: { width: "100%", flexDirection: "row", gap: 10, marginTop: 22 },
  cancelDeleteButton: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: "rgba(169, 177, 188, 0.22)", backgroundColor: "#102541" },
  cancelDeleteText: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  confirmDeleteButton: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#C94F5A" },
  confirmDeleteText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  title: { color: Colors.text, fontSize: 20, fontWeight: "700" },
  subtitle: { color: Colors.textGray, fontSize: 12, marginTop: 3 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 180 },
  row: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169, 177, 188, 0.14)",
  },
  rowSelected: { backgroundColor: Colors.barbottom, borderLeftWidth: 3, borderLeftColor: Colors.blue },
  playRow: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  artwork: { width: 52, height: 52, borderRadius: 12, backgroundColor: Colors.barbottom },
  itemInfo: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  chapterName: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  reciterName: { color: Colors.textGray, fontSize: 12, marginTop: 4 },
  removeButton: { width: 42, height: 48, alignItems: "center", justifyContent: "center" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: "700", marginTop: 14 },
  emptyHint: { color: Colors.textGray, fontSize: 13, textAlign: "center", lineHeight: 20, marginTop: 8 },
});

export default PlaylistDetails;
