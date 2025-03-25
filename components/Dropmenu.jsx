import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useIsFocused } from "@react-navigation/native";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const Dropmenu = ({
  reciterName,
  chapteID,
  arabName,
  chapter,
  chapterAr,
  mp3,
  reciterID,
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
  const [isSaved, setIsSaved] = useState(false);
  const focused = useIsFocused(); // State to track if the item is saved

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
    setIsSaved(false);
    const bookMark = await AsyncStorage.getItem("playList").then((token) => {
      const res = JSON.parse(token);
      return res.filter(
        (id) => !(id.reciterID === item.reciterID && id.id === item.id)
      );
    });
    !(item.id === chapteID && item.reciterID === reciterID);

    await AsyncStorage.setItem("playList", JSON.stringify(bookMark));
    setAlertVisible2(true);

    setTimeout(() => {
      setAlertVisible2(false);
    }, 2000);
  };
  const renderBookmark = async (list) => {
    await AsyncStorage.getItem("playList").then((token) => {
      const res = JSON.parse(token);
      if (res) {
        let data = res.find(
          (val) => val.id === list.id && val.reciterID === list.reciterID
        );
        return data == null ? setIsSaved(false) : setIsSaved(true);
      }
    });
  };
  useEffect(() => {
    renderBookmark(SaveListe[0]);
  }, [focused]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: RFValue(45),
          height: 45,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
        onPress={() => {
          isSaved
            ? removeFromPlaylist(SaveListe[0])
            : saveToPlaylist(SaveListe[0]);
        }}
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
            color={Colors.blue} // Color changes when saved
          />
        )}
      </TouchableOpacity>

      {/*Alert modal */}
      <Modal transparent={true} animationType="slide" visible={alertVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Saved!</Text>
            <Text style={styles.alertMessage}>
              {chapter} Added to the Playlist
            </Text>
          </View>
        </View>
      </Modal>

      {/*Alert modal2 */}
      <Modal transparent={true} animationType="slide" visible={alertVisible2}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Removed</Text>
            <Text style={styles.alertMessage}>
              {chapter} Removed from Savelist
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RFValue(48),
    height: 48,
    alignItems: "center",
  },
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
  closeButton: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Dropmenu;
