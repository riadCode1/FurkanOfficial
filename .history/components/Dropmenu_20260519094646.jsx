import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { useQuranApi } from "../services/quranApi";
import { useAuth } from "../hooks/useAuth";

// ─── simple toast ─────────────────────────────────────────────────────────────
const Toast = ({ visible, icon, title, message, color = Colors.blue }) => (
  <Modal transparent animationType="slide" visible={visible}>
    <View style={S.toastOverlay}>
      <View style={[S.toastBox, { borderTopColor: color }]}>
        <MaterialIcons name={icon} size={20} color={color} />
        <View style={{ flex: 1 }}>
          <Text style={S.toastTitle}>{title}</Text>
          <Text style={S.toastMsg}>{message}</Text>
        </View>
      </View>
    </View>
  </Modal>
);

// ─── main component ───────────────────────────────────────────────────────────
const Dropmenu = ({
  reciterName,
  chapteID,
  arabName,
  chapter,
  chapterAr,
  mp3,
  reciterID,
  verseNumber,   // verse number to bookmark (pass from parent)
  verseKey,      // verse key e.g. "2:255"
  mushafId = 4,
}) => {
  const { languages } = useGlobalContext();
  const { session } = useAuth();
  const api = useQuranApi();

  const [isSaved, setIsSaved]       = useState(false);
  const [adding, setAdding]         = useState(false);
  const [toastSaved, setToastSaved] = useState(false);
  const [toastRemoved, setToastRemoved] = useState(false);

  const t = (ar, en) => (languages ? ar : en);

  const showToast = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  // ── check if already saved in local playlist ──────────────────────────────
  const checkSaved = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("playList");
      const list = JSON.parse(raw) ?? [];
      const found = list.find(
        (v) => v.id === chapteID && v.reciterID === reciterID
      );
      setIsSaved(!!found);
    } catch {
      setIsSaved(false);
    }
  }, [chapteID, reciterID]);

  useEffect(() => { checkSaved(); }, [checkSaved]);

  // ── save to local playlist ────────────────────────────────────────────────
  const saveToPlaylist = async () => {
    if (isSaved) { await removeFromPlaylist(); return; }
    try {
      const raw  = await AsyncStorage.getItem("playList");
      const list = JSON.parse(raw) ?? [];
      const alreadyIn = list.find(
        (v) => v.id === chapteID && v.reciterID === reciterID
      );
      if (!alreadyIn) {
        list.push({ id: chapteID, arabName, chapter, uri: mp3, chapterAr, reciterName, reciterID });
        await AsyncStorage.setItem("playList", JSON.stringify(list));
      }
      setIsSaved(true);
      showToast(setToastSaved);
    } catch (err) {
      console.error("Save playlist failed:", err);
    }
  };

  const removeFromPlaylist = async () => {
    try {
      const raw  = await AsyncStorage.getItem("playList");
      const list = JSON.parse(raw) ?? [];
      const filtered = list.filter(
        (v) => !(v.id === chapteID && v.reciterID === reciterID)
      );
      await AsyncStorage.setItem("playList", JSON.stringify(filtered));
      setIsSaved(false);
      showToast(setToastRemoved);
    } catch (err) {
      console.error("Remove playlist failed:", err);
    }
  };

  // ── API bookmark (only when logged in) ────────────────────────────────────
  const handleApiBookmark = async () => {
    if (!session) {
      // fall back to local playlist when not logged in
      await saveToPlaylist();
      return;
    }
    setIsSaved(true);
    try {
      await api.addBookmark(verseNumber, verseKey, mushafId);
      setIsSaved(true);
      showToast(setToastSaved);
    } catch (err) {
      console.error("Add bookmark failed:", err);
    } finally {
      setIsSaved(false);
    }
  };

  const handlePress = () => {
    if (isSaved) removeFromPlaylist();
    else handleApiBookmark();
  };

  return (
    <View style={S.container}>

      {/* bookmark button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        disabled={adding}
        style={S.iconBtn}
      >
        {adding ? (
          <ActivityIndicator size={18} color={Colors.blue} />
        ) : (
          <MaterialIcons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isSaved ? Colors.blue : "white"}
          />
        )}
      </TouchableOpacity>

      {/* saved toast */}
      <Toast
        visible={toastSaved}
        icon="bookmark"
        color={Colors.blue}
        title={t("حفظ!", "Saved!")}
        message={t("تمت إضافة السورة إلى المكتبة", "Chapter added to playlist")}
      />

      {/* removed toast */}
      <Toast
        visible={toastRemoved}
        icon="bookmark-remove"
        color="#e85d5d"
        title={t("تمت الإزالة", "Removed")}
        message={t("تمت إزالة السورة من المكتبة", "Chapter removed from playlist")}
      />
    </View>
  );
};

export default Dropmenu;

// ─── styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  container:    {},
  iconBtn:      { justifyContent: "center", alignItems: "center", width: 36, height: 36 },

  // toast
  toastOverlay: { flex: 1, justifyContent: "flex-end" },
  toastBox:     {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "white",
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: 3,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 8,
  },
  toastTitle:   { fontSize: 14, fontWeight: "700", color: "#111" },
  toastMsg:     { fontSize: 13, color: "#666", marginTop: 1 },
});