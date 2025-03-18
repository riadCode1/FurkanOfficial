import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Dimensions, ScrollView, StatusBar, } from "react-native";
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
let { width, height } = Dimensions.get("window");
import { View, Text, Animated } from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors, } from "../../../constants/Colors";
import Read from "../../../components/Read";
import Details from "../../../components/Details";
import Listen from "../../../components/Listen";
import { fetChapterInfo, fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { TouchableRipple } from "react-native-paper";
import StyleSheet from 'react-native-media-query';
import {  RFValue } from "react-native-responsive-fontsize";
import { ImageBackground } from "react-native";

const HEADER_MAX_HEIGHT =( height * 0.65);
const HEADER_MIN_HEIGHT = height * 0.3;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ReaderSearch = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  
 
  const ButtonTranslate = scrollY.interpolate({
    inputRange: [0, RFValue(290)],
    outputRange: [700, 0],
    extrapolate: "clamp",
  });

  const smallHeaderOpacity = scrollY.interpolate({
    inputRange: [
      HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
      RFValue(350),
    ],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

 
  const params = useLocalSearchParams();
  const router = useRouter();

  const { name, Chapterid,chapter_arab } = params;

  const { isPlaying, languages,togglePlayback,playTrack,loading } =
    useGlobalContext();

  const [activeButton, setActiveButton] = useState("button1");

  const [chapterInfo, setchapterInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [quranData, setQuranData] = useState([]);
  
  const flashListRef = useRef(null);

  const scrollToTop = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollTo({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    getReciter();
    getChapterInfo(Chapterid);
  }, []);

  const getReciter = async () => {
    
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
        
        return true;
      });

      const combinedData = [...uniqueFetchedData, ...uniqueNewData];

      const filteredData = combinedData.filter(
        (item) => item.id !== 10 && item.status !== "inactive"
      ); // Example conditions

      setQuranData(filteredData.splice(2));

      
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

  const PlayAuto = async (reciterId) => {
    
  

    playTrack(
      {
        
        id: reciterId,
        chapterID: Chapterid,
        chapter: name,
        chapterAr:chapter_arab,
        artist: quranData.find((r) => r?.id === reciterId)?.reciter_name,
        artistAR: quranData.find((r) => r?.id === reciterId)?.translated_name.name,
        titleAR: chapter_arab,
      },
      Chapterid
    );
  };
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" />
      {/* Small Header */}
      <Animated.View
        style={[
          styles.smallHeader,
          {
            opacity: smallHeaderOpacity,
          },
        ]}
      >
        <View style={styles.chapterSmall}>
          <View style={{width:210,justifyContent:"center", }}>
            <Text
              style={[
                styles.chapterTextSmall,
                { fontSize: 20, textAlign: "left" },
              ]}
            >
              {languages ? chapter_arab : name}
            </Text>
            <Text
              style={{
                color: Colors.textGray,
                fontSize: 14,
                textAlign: "left",
              }}
            >
              {Chapterid}/114 {languages ? `السورة` : "Chapter"}
            </Text>
          </View>

          {isPlaying ? (
            <View style={{}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={togglePlayback}
                style={styles.playPauseButtonSmall}
              >
                <MaterialIcons name="pause" size={24} color="#00D1FF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => PlayAuto(1)}
                style={styles.playPauseButtonSmall}
              >
                <MaterialIcons name="play-arrow" size={24} color="#00D1FF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>

      <TouchableRipple
        onPress={() => router.back()}
        rippleColor="rgba(255, 255, 255, 0.2)"
        style={styles.backButton}
        borderless={true}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableRipple>

      {/* Scroll Header */}

      <Animated.ScrollView
        ref={flashListRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <ImageBackground
          source={require("../../../assets/images/quranLogo.jpeg")}
          blurRadius={20}
          style={styles.headerImage}
        >
          <View style={[styles.imageContainer]}>
            <Image
              contentFit="contain"
              source={require("../../../assets/images/quranLogo.jpeg")}
              style={styles.image}
            />
          </View>
          <View style={styles.BotHeader}>
            <View style={styles.chapterName}>
              <Text style={[styles.chapterNameText, { textAlign: "left" }]}>
                {languages ? chapter_arab : name}
              </Text>
              <Text
                style={{
                  color: Colors.textGray,
                  fontSize: 16,
                  textAlign: "left",
                }}
              >
                {Chapterid}/114 {languages ? `السورة` : "Chapter"}
              </Text>
            </View>

            {isPlaying ? (
              <View>
                <TouchableRipple
                  onPress={togglePlayback}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <MaterialIcons name="pause" size={24} color="#00D1FF" />
                </TouchableRipple>
              </View>
            ) : (
              <View>
                <TouchableRipple
                  onPress={() => PlayAuto(1)}
                  rippleColor="rgba(0, 209, 255, 0.2)"
                  style={styles.playPauseButton}
                  borderless={true}
                >
                  <MaterialIcons name="play-arrow" size={24} color="#00D1FF" />
                </TouchableRipple>
              </View>
            )}
          </View>

          <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(24,26,60,1)",
                        "rgba(24,26,60,1)",
                        "rgba(24,26,60,1)",
                      ]}
                      style={{
                        width: width,
                        height: height * 0.1,
                        position: "absolute",
                        zIndex: 1,
                        bottom: 0,
                      }}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 2 }}
                    />

          
        </ImageBackground>

{/* button group */}
        <View style={{ alignItems: "center", marginTop: 24,  }}>
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
              <View style={{}}></View>
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

        {activeButton === "button3" && <Read id={Chapterid} />}
      </Animated.ScrollView>

     <Animated.View
             style={[
               styles.buttonScroll,
               {
                 transform: [{ translateX: ButtonTranslate }],
               },
             ]}
           >
             <TouchableRipple
               onPress={scrollToTop}
               rippleColor="rgba(255, 255, 255, 0.2)"
               style={styles.button}
               borderless={true}
             >
               <MaterialIcons name="arrow-upward" size={24} color="white" />
             </TouchableRipple>
           </Animated.View>
    </View>
  );
};

const {styles} = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A3C",
  },
  

  headerImage: {
    width:"100%",
    height:366,
    alignItems:"center",
    justifyContent:"center",
    position:"relative"
  },

  imageContainer: {
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 100,
    elevation: 10,
  },
  image: {
   width:114,
   height:126,
    elevation:100,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",

    '@media (min-width: 700px)': {
      width:140,
      height:146,
        },
    // Match borderRadius of the container for consistent rounding
  },
  BotHeader:{
    position:"absolute",
    bottom:0,
    width:"100%",
    zIndex:99,
    paddingHorizontal:16,
    flexDirection:"row",
    justifyContent:"space-between",

    '@media (min-width: 768px)': {
    paddingHorizontal:32,
      },
},

  relativeView: {
    justifyContent: "center",
    position: "relative",
    alignItems:"center",
    paddingHorizontal:16,
    '@media (min-width: 768px)': {
    paddingHorizontal:32,
      },
   
  },

  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    
    bottom: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonScroll: {
    width:48,
    height:48,
    right: 16,
    borderRadius:50,
    position:"absolute",
    zIndex:999,
    backgroundColor: Colors.tint,
    bottom: 170,
    alignItems:"center",
    justifyContent:"center",
    elevation: 50,
    
    
    '@media (min-width: 700px)': {
            right:32
        },
  },
  buttonText: {
    color: Colors.textGray,
    marginBottom: 8,
  },

  buttonUnderline: {
    width: RFValue(112),
    height: 1,
    borderRadius: 50,
  },

  chapterNameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    width: width * 0.6,
  },
  playPauseButton: {
    width:45,
    height:45,
    backgroundColor: "#454B8C",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    top:5
  },
 

 
  playPauseButtonSmall: {
    width:48,
    height:48,
    backgroundColor: "#454B8C",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  chapterSmall:{
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 30,
    paddingLeft: 80,
    paddingRight: 16,
    alignItems: "center",
    '@media (min-width: 768px)': {
    paddingRight:32,
    paddingLeft: 100,
  },},

  chapterTextSmall:{
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  backButton: {
    position:"absolute",
    width:48,
    height:48,
    top:44,
    left:16,
    zIndex:99,
    elevation: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#454B8C",
    borderRadius: 50,
    '@media (min-width: 700px)': {
            left:32
        },
  },

  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tint,
    height:108,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  

});










export default ReaderSearch;
