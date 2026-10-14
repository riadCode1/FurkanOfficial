import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dropmenu from "./Dropmenu";
import { getReciterImage } from "../constants/reciterArtwork";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "../constants/Colors";
import SearchBar from "./SearchBar";
import { TouchableRipple } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isTrackSelected } from "../constants/trackSelection";

const PlayList = () => {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const { languages, playTrack, track, color, color2 } = useGlobalContext();
  const bottomOverlayPadding =
    Math.max(insets.bottom + 112, track ? 220 : 0) + 32;

  useEffect(() => {
    if (isFocused) {
      const fetchBookMark = async () => {
        const token = await AsyncStorage.getItem("playList");
        const res = JSON.parse(token);
        if (res) setPlaylist(res);
      };
      fetchBookMark();
    }
  }, [isFocused]);

  const Remove = async (id) => {
    const updatedPlaylist = playlist.filter(
      (item) => !(item?.id === id?.id && item?.reciterID === id?.reciterID)
    );
    if (updatedPlaylist.length === playlist.length) return;

    setPlaylist(updatedPlaylist);
    try {
      await AsyncStorage.setItem("playList", JSON.stringify(updatedPlaylist));
    } catch (e) {
      console.error("Error removing item:", e);
      setPlaylist(playlist);
    }
  };

  const filteredData = useMemo(() => {
    if (searchQuery.length <= 1) return playlist;
    return playlist.filter(
        (item) =>
          item.chapter?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          item.reciterName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          item.arabName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          item.chapterAr?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );
  }, [playlist, searchQuery]);

  const playSound = (idReciter, trackId, chapterName, name, arabName, arabicCh) => {
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
  };

  const dynamicStyles = StyleSheet.create({
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      height: 75,
      paddingHorizontal: width >= 768 ? 40 : 16,
      paddingVertical: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16, alignItems: "center" }}>
        <SearchBar
          title={languages ? "بحث... " : "Search your savings"}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredData={filteredData}
        />
      </View>

      {playlist.length > 0 ? (
        filteredData.length > 0 ? (
        <View style={[styles.list, { paddingBottom: bottomOverlayPadding + 48 }]}>
          {filteredData.map((item) => (
            <View
              key={item?.id?.toString()}
              style={[
                isTrackSelected(color, color2, item.reciterID, item.id)
                  ? styles.Color
                  : null,
              ]}
            >
              <TouchableRipple
                onPress={() => {
                  playSound(
                    item?.reciterID,
                    item?.id,
                    item?.chapter,
                    item?.reciterName,
                    item?.arabName,
                    item?.chapterAr
                  );
                }}
                activeOpacity={0.7}
                rippleColor="rgba(200, 200, 200, 0.1)"
                style={[dynamicStyles.listItem]}
              >
                <View style={[styles.itemContent]}>
                  <View style={styles.buttonContent}>
                    <View style={styles.imageContainer}>
                      <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={{
                          uri: getReciterImage(item?.reciterID)
                            ? getReciterImage(item?.reciterID)
                            : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSBeNtIDXrucypAOP8APKT6-wuwPcJ8epwNvNMd4QbNlyWi9EfS",
                        }}
                      />
                    </View>

                    <View style={{ alignItems: "flex-start" }}>
                      <Text style={styles.chapterText}>
                        {languages ? item.chapterAr : item?.chapter}
                      </Text>
                      <Text numberOfLines={1} style={styles.nameText}>
                        {languages ? item.arabName : item?.reciterName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.menuContainer}>
                    <Dropmenu
                      playSound={playSound}
                      RemoveItem={true}
                      dataSave={item}
                      reciterName={item.reciterName}
                      reciterID={item.reciterID}
                      chapteID={item.id}
                      arabName={item.arabName}
                      chapter={item.chapter}
                      chapterAr={item.chapterAr}
                      Remove={Remove}
                    />
                  </View>
                </View>
              </TouchableRipple>
            </View>
          ))}
        </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <MaterialIcons name="search-off" size={30} color={Colors.blue} />
            </View>
            <Text style={styles.emptyTitle}>
              {languages ? "لا توجد نتائج" : "No matching recitations"}
            </Text>
            <Text style={styles.emptyDescription}>
              {languages
                ? "جرّب اسمًا أو عنوانًا آخر."
                : "Try a different Surah or reciter name."}
            </Text>
          </View>
        )
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <MaterialIcons name="bookmark-add" size={34} color={Colors.blue} />
          </View>
          <Text style={styles.emptyEyebrow}>
            {languages ? "مكتبتك الصوتية" : "YOUR LISTENING LIBRARY"}
          </Text>
          <Text style={styles.emptyTitle}>
            {languages ? "لم تحفظ أي تلاوة بعد" : "No saved recitations yet"}
          </Text>
          <Text style={styles.emptyDescription}>
            {languages
              ? "اضغط على علامة الحفظ أثناء الاستماع لإضافة السورة هنا."
              : "Save a recitation while listening and it will be ready to play here."}
          </Text>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center" },
  list: { marginTop: 16, width: "100%" },
  itemContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  chapterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  nameText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  Color: {
    backgroundColor: Colors.barbottom,
  },
  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  emptyCard: {
    width: "93%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.2)",
    backgroundColor: "#0A1B34",
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    backgroundColor: "rgba(3, 218, 197, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(3, 218, 197, 0.24)",
  },
  emptyEyebrow: {
    color: Colors.blue,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginTop: 18,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  emptyDescription: {
    color: Colors.textGray,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },
});

export default PlayList;
