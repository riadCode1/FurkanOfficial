import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dropmenu from "./Dropmenu";
import { dataArray } from "@/constants/RecitersImages";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "../constants/Colors";
import SearchBar from "./SearchBar";
import { TouchableRipple } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { useQuranApi } from "../services/quranApi";
import { useAuth } from "../hooks/useAuth";

const PlayList = () => {
  const { width } = useWindowDimensions();
  const { languages, playTrack } = useGlobalContext();
  const { session } = useAuth();
  const api = useQuranApi();
  const isFocused = useIsFocused();

  const [playlist, setPlaylist]         = useState([]);
  const [bookmarks, setBookmarks]       = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [idColor, setIdColor]           = useState("");
  const [color2, setColor2]             = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);

  const t = (ar, en) => (languages ? ar : en);

  // ── local playlist — FIX: removed `playlist` from deps → was causing infinite loop ──
  const fetchPlaylist = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("playList");
      const res = JSON.parse(raw);
      if (res) setPlaylist(res);
    } catch (e) {
      console.error("fetchPlaylist error:", e);
    }
  }, []); // no deps — stable function

  useEffect(() => {
    if (isFocused) fetchPlaylist();
  }, [isFocused]); // FIX: only re-run when screen focus changes, not on playlist state change

  // ── API bookmarks ─────────────────────────────────────────────────────────
  const fetchBookmarks = useCallback(async () => {
    if (!session) return; // FIX: don't fetch when logged out
    setBookmarksLoading(true);
    try {
      const data = await api.getBookmarks();
      setBookmarks(data?.data ?? []);
    } catch (err) {
      console.error("Get bookmarks failed:", err);
    } finally {
      setBookmarksLoading(false); // FIX: was setBookmarksLoading(false) but undefined in original
    }
  }, [session]); // re-fetch on session change

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  // ── remove from local playlist ────────────────────────────────────────────
  const Remove = useCallback(async (item) => {
    try {
      const updatedPlaylist = playlist.filter(
        (p) => !(p?.id === item?.id && p?.reciterID === item?.reciterID) // FIX: original only filtered by id, not reciterID too
      );
      await AsyncStorage.setItem("playList", JSON.stringify(updatedPlaylist));
      setPlaylist(updatedPlaylist);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 2500);
    } catch (e) {
      console.error("Error removing item:", e);
    }
    // FIX: original had finally { setAlertVisible(false) } which hid the toast immediately
  }, [playlist]);

  // ── search filter ─────────────────────────────────────────────────────────
  const filteredData = searchQuery.length > 1
    ? playlist.filter((item) =>
        item.chapter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reciterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.arabName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapterAr?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : playlist; // FIX: was a separate state updated in useEffect — derived value is simpler and correct

  // ── play ──────────────────────────────────────────────────────────────────
  const playSound = useCallback((idReciter, trackId, chapterName, name, arabName, arabicCh) => {
    playTrack(
      {
        id: idReciter,
        chapterID: trackId,
        chapter: languages ? arabicCh : chapterName,
        artist: languages ? arabName : name,
        artistAR: arabName,
        titleAR: arabicCh,
      },
      trackId
    );
  }, [languages, playTrack]);

  // ── display data ──────────────────────────────────────────────────────────
  // FIX: original showed bookmarks.length check but rendered `playlist` data — now unified
  const displayData = session ? bookmarks : filteredData;
  const isEmpty = displayData.length === 0;

  return (
    <View style={S.root}>

      <View style={S.searchWrap}>
        <SearchBar
          title={t("بحث...", "Search your playlist")}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredData={filteredData}
        />
      </View>

      {isEmpty ? (
        <View style={S.emptyContainer}>
          <Image source={require("../assets/images/emptyState.png")} />
          <Text style={S.emptyText}>
            {t("لم تقم بحفظ أي شيء بعد", "No saves yet")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item?.reciterID}-${item?.id}-${index}`} // FIX: id alone isn't unique across reciters
          contentContainerStyle={S.listContent}
          renderItem={({ item }) => {
            const isActive = color2 === item.reciterID && idColor === item.id;
            return (
              <View style={isActive ? S.activeRow : null}>
                <TouchableRipple
                  onPress={() => {
                    playSound(item?.reciterID, item?.id, item?.chapter, item?.reciterName, item?.arabName, item?.chapterAr);
                    setColor2(item.reciterID);
                    setIdColor(item.id);
                  }}
                  rippleColor="rgba(200,200,200,0.1)"
                  style={[S.listItem, { paddingHorizontal: width >= 768 ? 40 : 16 }]}
                >
                  <View style={S.itemContent}>
                    <View style={S.itemLeft}>
                      <View style={S.imageContainer}>
                        <Image
                          resizeMode="cover"
                          style={S.image}
                          source={{ uri: dataArray[item?.reciterID]?.image || "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSBeNtIDXrucypAOP8APKT6-wuwPcJ8epwNvNMd4QbNlyWi9EfS" }}
                        />
                      </View>
                      <View>
                        <Text style={S.chapterText}>{t(item.chapterAr, item?.chapter)}</Text>
                        <Text numberOfLines={1} style={S.nameText}>{t(item.arabName, item?.reciterName)}</Text>
                      </View>
                    </View>

                    <View style={S.menuContainer}>
                      <Dropmenu
                        reciterName={item.reciterName}
                        reciterID={item.reciterID}
                        chapteID={item.id}
                        arabName={item.arabName}
                        chapter={item.chapter}
                        chapterAr={item.chapterAr}
                        mp3={item.uri}
                        Remove={Remove}
                        RemoveItem
                      />
                    </View>
                  </View>
                </TouchableRipple>
              </View>
            );
          }}
        />
      )}

      {/* delete toast */}
      <Modal transparent animationType="slide" visible={alertVisible} onRequestClose={() => setAlertVisible(false)}>
        <View style={S.toastOverlay}>
          <View style={S.toastBox}>
            <Text style={S.toastTitle}>{t("تمت الإزالة", "Removed")}</Text>
            <Text style={S.toastMsg}>{t("تمت إزالة السورة من القائمة", "Surah removed from playlist")}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlayList;

const S = StyleSheet.create({
  root:           { flex: 1, alignItems: "center" },
  searchWrap:     { marginBottom: 16, alignItems: "center" },
  listContent:    { paddingBottom: 450, marginTop: 16 },

  listItem:       { height: 75, paddingVertical: 8 },
  activeRow:      { backgroundColor: Colors.barbottom },
  itemContent:    { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  itemLeft:       { flexDirection: "row", alignItems: "center", gap: 10 },

  imageContainer: { overflow: "hidden", borderColor: "#00BCE5", borderWidth: 1, width: 50, height: 50, borderRadius: 25 },
  image:          { width: "100%", height: "100%" },

  chapterText:    { color: "white", fontWeight: "bold", fontSize: 16 },
  nameText:       { color: "#9ca3af", fontSize: 12 },

  menuContainer:  { justifyContent: "center", alignItems: "center", width: 48, height: 48 },

  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyText:      { color: Colors.text, fontWeight: "600", marginTop: 20 },

  toastOverlay:   { flex: 1, justifyContent: "flex-end" },
  toastBox:       { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 20, borderTopWidth: 3, borderTopColor: "#e85d5d", alignItems: "center", elevation: 8 },
  toastTitle:     { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 4 },
  toastMsg:       { fontSize: 14, color: "#555", textAlign: "center" },
});