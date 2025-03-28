import { View, Text, FlatList, Image, Modal, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dropmenu from "./Dropmenu";
import { dataArray } from "@/constants/RecitersImages";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "../constants/Colors";
import SearchBar from "./SearchBar";
import { TouchableRipple } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import StyleSheet from 'react-native-media-query';


const PlayList = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idColor, setIdColor] = useState("");
  const [loading, setloading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [color2, setColor2] = useState(0);
  const isFocused = useIsFocused();

   const {
     
      languages,
     
     
      playTrack
    } = useGlobalContext();

  const hideAlert = () => {
    setAlertVisible(false);
  };

  
  useEffect(() => {
    
    if (isFocused) {
      const fetchBookMark = async () => {
        const token = await AsyncStorage.getItem("playList");
        const res = JSON.parse(token);

        if (res) {
          setPlaylist(res);
        }
      };

      fetchBookMark();
    }
  }, [playlist, isFocused]);


  

  const Remove = async (id) => {
    try {
      const removedItem = playlist.find((item) => item && item.id === id?.id);

      if (!removedItem) {
        console.log("Item not found in playlist.");
        return;
      }

      const updatedPlaylist = playlist.filter((item) => item?.id !== id?.id);
      await AsyncStorage.setItem("playList", JSON.stringify(updatedPlaylist));
      setPlaylist(updatedPlaylist);

      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    } catch (e) {
      console.error("Error removing item:", e);
    } finally {
      setAlertVisible(false);
    }
  };

  {/*SearchQuery */}

  useEffect(() => {
    if (searchQuery.length > 1) {
      setloading(true);

      const filteredRecitations = playlist.filter(
        (item) =>
          item.chapter?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          item.reciterName?.toLowerCase()?.includes(searchQuery.toLowerCase())||
          item.arabName?.toLowerCase()?.includes(searchQuery.toLowerCase())||
          item.chapterAr?.toLowerCase()?.includes(searchQuery.toLowerCase())
          
      );

      setFilteredData(filteredRecitations); 
     

    }
  }, [languages, searchQuery]);

 
//PlaySound



const playSound = (
  idReciter,
  trackId,
  chapterName,
  name,
  arabName,
  arabicCh
) => {

 
  playTrack(
    {
      
      id: idReciter,
      chapterID: trackId,
      chapter: languages? arabicCh: chapterName,
      artist: languages?arabName: name,
      artistAR: arabName,
      titleAR: arabicCh,
      
    },
    trackId
    
  );

  
  
};


// Function to handle playback status updates







  return (
    <View className=" items-center">
      <View style={{ marginBottom: 16,alignItems:"center" }}>
        <SearchBar
          title={languages ? "ابحث عن مدخراتك" : "Search your savings"}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredData={filteredData}
        />
      </View>

      {playlist[0] ? (
        searchQuery.length > 1 ? (
          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={70}
            keyExtractor={(item, index) => item?.id?.toString()}
            contentContainerStyle={styles.flatlistContent}
            renderItem={({ item }) => (
              <View
                style={[
                  color2 === item.reciterID && idColor === item.id
                    ? styles.Color
                    : "",
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
                    ),
                      setColor2(item.reciterID),
                      setIdColor(item.id);
                  }}
                  activeOpacity={0.7}
                  rippleColor="rgba(200, 200, 200, 0.1)"
                  style={[styles.listItem]}
                >
                  <View style={[styles.itemContent]}>
                    <View style={styles.buttonContent}>
                      <View style={styles.imageContainer}>
                        <Image
                          resizeMode="cover"
                          style={styles.image}
                          source={{
                            uri: dataArray[item?.reciterID]?.image
                              ? dataArray[item?.reciterID]?.image
                              : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSBeNtIDXrucypAOP8APKT6-wuwPcJ8epwNvNMd4QbNlyWi9EfS",
                          }}
                        />
                      </View>

                      <View>
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
            )}
          />
        ) : (<>
          <FlatList
            data={playlist}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={70}
            keyExtractor={(item, index) => item?.id?.toString()}
            contentContainerStyle={styles.flatlistContent}
            renderItem={({ item }) => (
              <View
                style={[
                  color2 === item.reciterID && idColor === item.id
                    ? styles.Color
                    : "",
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
                    ),
                      setColor2(item.reciterID),
                      setIdColor(item.id);
                  }}
                  activeOpacity={0.7}
                  rippleColor="rgba(200, 200, 200, 0.1)"
                  style={[styles.listItem]}
                >
                  <View style={[styles.itemContent]}>
                    <View style={styles.buttonContent}>
                      <View style={styles.imageContainer}>
                        <Image
                          resizeMode="cover"
                          style={styles.image}
                          source={{
                            uri: dataArray[item?.reciterID]?.image
                              ? dataArray[item?.reciterID]?.image
                              : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSBeNtIDXrucypAOP8APKT6-wuwPcJ8epwNvNMd4QbNlyWi9EfS",
                          }}
                        />
                      </View>

                      <View style={{alignItems:"flex-start"}}>
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
            )}
          />
         
          </>
        )
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 60,
          }}
        >
          <Image source={require("../assets/images/emptyState.png")} />
          <Text
            style={{ color: Colors.text, fontWeight: "600", marginTop: 20 }}
          >
            {" "}
            No Savings Yet
          </Text>
        </View>
      )}

      <Modal
        transparent={true}
        animationType="slide"
        visible={alertVisible}
        onRequestClose={hideAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Delete!</Text>
            <Text style={styles.alertMessage}>Surah Removed From PlayList</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const {styles} = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistContent: {
    paddingBottom: 450,
    marginTop: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    height:75,
    paddingHorizontal:16,
    paddingVertical: 8,
    '@media (min-width: 768px)': {
      paddingHorizontal: 40,
  
    }
  },
  itemContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
    paddingVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  touchableContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
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
  textContainer: {
    alignItems: "flex-start",
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
  chapterName: {
    color: Colors.textGray,
    fontSize: 12,
  },
  Color: {
    backgroundColor: Colors.tint,
  },

  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 30,
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
  
  centeredView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.background,
  },
  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
  },
});

export default PlayList;
