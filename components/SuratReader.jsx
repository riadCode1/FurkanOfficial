import { View, Text, } from "react-native";
import { Image } from 'expo-image';
import React from "react";
import Dropmenu from "./Dropmenu";
import { dataArray } from "@/constants/RecitersImages";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";

import LottieView from "lottie-react-native";
import StyleSheet from 'react-native-media-query';
import { useGlobalContext } from "../context/GlobalProvider";

const SuratReader = ({
  color,
  languages,
  chapterName,
  chapterAr,
  reciterName,
  arab_name,
  index,
  dataAudio,
  chapteID,
  id,
  playAudio,
  data,
 
}) => {
const {
     
      loading
    } = useGlobalContext();
  
  const handlePlay = () => {
    playAudio(
      dataAudio[chapteID - 1]?.audio_url,
      chapteID,
      chapterName,
      reciterName,
      arab_name,
      id,
      chapterAr, index
    );
    
    
  };


  return (
    <View>
      {loading ? (
        <View style={styles.lottie}>
         <LottieView
      source={require("../assets/images/Loading.json")}
      style={{ width: "100%", height: "100%"}}
      autoPlay
      
      loop
    />
        </View>
      ) : (
        <View style={[color===chapteID && styles.Color, styles.container]}>
          <TouchableRipple
            onPress={handlePlay}
            rippleColor="rgba(200, 200, 200, 0.1)"
            style={styles.playButton}
          >
            <View style={styles.buttonContent}>

              <View style={{flexDirection:"row"}} >
                <View style={styles.imageContainer}>
                  <Image
                    contentFit="cover"
                    style={styles.image}
                    source={{
                      uri: dataArray[id]?.image
                        ? dataArray[id]?.image
                        : "",
                    }}
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.chapterText}>
                    {languages ? chapterAr : chapterName}
                  </Text>

                  <Text style={styles.reciterText}>
                    {languages ? arab_name : reciterName}
                  </Text>
                </View>
              </View>

              <Dropmenu
                chapter={chapterName}
                reciterName={reciterName}
                reciterID={id}
                arabName={arab_name}
                chapterAr={chapterAr}
                data={data}
                chapteID={chapteID}
                handlePlay={handlePlay}                  
                mp3={dataAudio[chapteID - 1]?.audio_url}
              />
            </View>
          </TouchableRipple>
        </View>
      )}
    </View>
  );
};

const {styles} = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    
  },
  Color: {
    backgroundColor: Colors.tint,
    height: 75,
  },

  lottie: {
    right:70,
    width: "100%",
    height: 50,
   
    '@media (min-width: 768px)': {
      
      right:270,
      width: "100%",
  },}
,    
  playButton: {
    borderRadius: 8,
    width: "100%",
    height: 75, // Ensures the ripple effect matches the container
    overflow: "hidden", // Ensures ripple stays within bounds
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: (16),
    '@media (min-width: 768px)': {
      
      paddingHorizontal:32
  },
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
    
  
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    marginRight:8,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  textContainer: {
    alignItems: "flex-start",
  },
  chapterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  reciterText: {
    color: Colors.textGray,
    fontSize: 12,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SuratReader;
