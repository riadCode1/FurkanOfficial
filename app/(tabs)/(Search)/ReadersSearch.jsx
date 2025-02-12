import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Dimensions, } from "react-native";
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
let { width, height } = Dimensions.get("window");
import { View, Text, StyleSheet, Animated } from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import Read from "../../../components/Read";
import Details from "../../../components/Details";
import Listen from "../../../components/Listen";
import { fetChapterInfo, fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { TouchableRipple } from "react-native-paper";

const HEADER_MAX_HEIGHT = height * 0.65;
const HEADER_MIN_HEIGHT = height * 0.3;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ReaderSearch = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 990],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 600],
    outputRange: [0, -600],
    extrapolate: "clamp",
  });

  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, 290],
    outputRange: [700, 0],
    extrapolate: "clamp",
  });

  const smallHeaderOpacity = scrollY.interpolate({
    inputRange: [
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
      290,
    ],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

 
  const params = useLocalSearchParams();
  const router = useRouter();

  const { name, Chapterid, arab_name, chapter_arab } = params;

  const { isPlaying, languages, } =
    useGlobalContext();

  const [activeButton, setActiveButton] = useState("button1");

  const [chapterInfo, setchapterInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [quranData, setQuranData] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    getReciter();
    getChapterInfo(Chapterid);
  }, []);

  const getReciter = async () => {
    setloading(true);
    const data = await fetchSuwar();

    // Example of hardcoded data (NewData)

    if (data && data.recitations) {
      const idSet = new Set();

      const uniqueFetchedData = data.recitations.filter((reciter) => {
        if (idSet.has(reciter.id)) {
          return false;
        }
        idSet.add(reciter.id);
        return true;
      });

      const uniqueNewData = NewData.recitations.filter((reciter) => {
        if (idSet.has(reciter.id)) {
          return false;
        }
        idSet.add(reciter.id);
        setloading(false);
        return true;
      });

      const combinedData = [...uniqueFetchedData, ...uniqueNewData];

      const filteredData = combinedData.filter(
        (item) => item.id !== 10 && item.status !== "inactive"
      ); // Example conditions

      setQuranData(filteredData.splice(1));

      
    }
  };

  const getChapterInfo = async (id) => {
    const data = await fetChapterInfo(id);
    if (data && data.chapter_info) setchapterInfo(data.chapter_info);
    
  };

  const handleButtonPress = (button) => {
    setActiveButton(button);
  };

  const getBackgroundColor = (button) => {
    return activeButton === button ? "#00D1FF" : "transparent";
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      

      fetchSuwar(searchQuery)
        .then((suwarData) => {
          const filteredRecitations = suwarData.recitations.filter(
            (item) =>
              item.reciter_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.translated_name.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

          const filterNewData = NewData.recitations.filter(
            (item) =>
              item.reciter_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.translated_name.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

          const combinedData = [...filteredRecitations, ...filterNewData];

          const uniqueRecitations = combinedData.filter(
            (recitation, index, self) =>
              index === self.findIndex((r) => r.id === recitation.id)
          );

          setFilteredData(uniqueRecitations);
           
        })
        .catch((error) => {
          console.error("Error fetching recitations: ", error);
        })
        .finally(() => {
          
        });
    }
  }, [searchQuery, ]);
  

  return (
    <View style={styles.container}>
      <TouchableRipple
        onPress={() => router.navigate("Index")}
        rippleColor="rgba(255, 255, 255, 0.2)"
        style={styles.backButton}
        borderless={true}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableRipple>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <Animated.View style={[styles.headerImage, {}]}>
          <Image
            source={require("../../../assets/images/quranLogo.png")}
            blurRadius={20}
            contentFit="cover"
            style={[styles.headerImage]}
          />
        </Animated.View>

        <Animated.View style={[styles.imageContainer, {}]}>
          <Image
            contentFit="cover"
            style={[styles.image]}
            source={require("../../../assets/images/quranLogo.png")}
          />
        </Animated.View>

        <Animated.View style={[styles.headerTitle]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={[styles.chapterNameText]}>
              <Text numberOfLines={1} style={[styles.chapterNameText]}>
                {languages ? chapter_arab : name}
              </Text>
              <Text style={{ color: Colors.textGray }}>
                114 {languages ? `السورة ${Chapterid} ` : "Chapter"}
              </Text>
            </View>

            {isPlaying ? (
              <View>
                <TouchableRipple
                  onPress={"pauseAudio"}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <FontAwesome5 name="pause" size={20} color="#00D1FF" />
                </TouchableRipple>
              </View>
            ) : (
              <View>
                <TouchableRipple
                  onPress={"playAuto"}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <Entypo name="controller-play" size={24} color="#00D1FF" />
                </TouchableRipple>
              </View>
            )}
          </View>

          <View style={{ marginTop: 0, width: "100%" }}>
            <View style={styles.relativeView}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleButtonPress("button1")}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {languages ? "استمع " : "Listen"}
                  </Text>
                  <View
                    style={[
                      { backgroundColor: getBackgroundColor("button1") },
                      styles.buttonUnderline,
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleButtonPress("button2")}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {languages ? "تفاصيل " : "Details"}
                  </Text>
                  <View
                    style={[
                      { backgroundColor: getBackgroundColor("button2") },
                      styles.buttonUnderline,
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleButtonPress("button3")}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {languages ? "اقراء " : "Read"}
                  </Text>
                  <View
                    style={[
                      { backgroundColor: getBackgroundColor("button3") },
                      styles.buttonUnderline,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {activeButton === "button2" || activeButton === "button3" ? (
              <View style={{ width: width * 0.93, height: 50 }}></View>
            ) : (
              <SearchBar
                title={languages ? "ابحث عن قارئ" : "Search Reciter"}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredData={filteredData}
              />
            )}
            <View style={{ width: width * 0.93 }}></View>
          </View>
        </Animated.View>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(24,26,60,1)",
            "rgba(24,26,60,1)",
            "rgba(24,26,60,1)",
          ]}
          style={{
            width: width,
            height: height * 0.2,
            position: "absolute",
            zIndex: 1,
            top: "75%",
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Small Header */}

      <Animated.View
        style={[
          styles.smallHeader,
          {
            opacity: smallHeaderOpacity,
          },
        ]}
      >
        <Animated.View style={[styles.SmallheaderTitle]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 60,
              justifyContent: "space-between",
            }}
          >
            <View style={[styles.chapterNameText]}>
              <Text numberOfLines={1} style={[styles.chapterNameText]}>
                {languages ? chapter_arab : name}
              </Text>
              <Text style={{ color: Colors.textGray }}>
                114 {languages ? `السورة ${Chapterid} ` : "Chapter"}
              </Text>
            </View>

            {isPlaying ? (
              <View>
                <TouchableRipple
                  onPress={"pauseAudio"}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <FontAwesome5 name="pause" size={20} color="#00D1FF" />
                </TouchableRipple>
              </View>
            ) : (
              <View>
                <TouchableRipple
                  onPress={"playAuto"}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <Entypo name="controller-play" size={24} color="#00D1FF" />
                </TouchableRipple>
              </View>
            )}
          </View>

          <View style={{ marginTop: 0, width: "100%" }}>
            
            <View style={{ width: width * 0.93 }}></View>
          </View>
        </Animated.View>
      </Animated.View>

      {activeButton === "button1" && (
        <Listen
          chapterName={name}
          scrollY={scrollY}         
          HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT}
          chapterAr={chapter_arab}
          searchQuery={searchQuery}
          filteredData={filteredData}     
          languages={languages}     
          Chapterid={Chapterid}
          loading={loading}
          ButtonTranslate={ButtonTranslate}
          quranData={quranData}
        />
      )}
      {activeButton === "button2" && (
        <Details
          scrollY={scrollY}
          languages={languages}
          info={chapterInfo.short_text}
        />
      )}

      {activeButton === "button3" && <Read />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A3C",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    backgroundColor: "#181A3C",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  imageContainer: {
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 20, // Shadow blur radius for iOS
    elevation: 10,
  },
  image: {
    width: 146,
    height: 146,
    // Match borderRadius of the container for consistent rounding
  },

  relativeView: {
    justifyContent: "center",
    position: "relative",
    marginTop: 50,
  },

  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.textGray,
    marginBottom: 8,
  },

  buttonUnderline: {
    width: 112,
    height: 1,
    borderRadius: 50,
  },

  chapterNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  playPauseButton: {
    width: 50,
    height: 50,
    backgroundColor: "#454B8C",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",

    zIndex: 10,
    bottom: 0,
  },

  SmallheaderTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
   paddingTop:20,
    zIndex: 10,
   
  },

  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    top: 45,
    left: 16,
    position: "absolute",
    width: 48,
    elevation: 50,
    height: 48,
    zIndex: 99,
    backgroundColor: "#454B8C",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemText: {
    color: "#fff",
    marginLeft: 16,
    fontSize: 16,
  },

  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    

    borderBottomColor: Colors.tint,
    height: "16%",
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
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




export default ReaderSearch;
