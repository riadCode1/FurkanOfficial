import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import React, { useEffect, useState } from "react";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useGlobalContext } from "../context/GlobalProvider";
import { Colors } from "../constants/Colors";
import Slider from "@react-native-community/slider";
import { TouchableRipple } from "react-native-paper";
import TrackPlayer, { useProgress } from "react-native-track-player";
import Dropmenu from "./Dropmenu";



const ModalAudio = ({ }) => {
  const {
    setModalVisible,
    chapterId,
    duration,
    position,
    reciter,
    reciterAR,
    isPlaying,
    languages,
    setShuffle,
    arabicCH,
    playNext,
    playPrevious,
    togglePlayback,
    shuffle,
    IDchapter,
    idReader
    
  } = useGlobalContext();
 

 

  const progress = useProgress();
  

  useEffect(() => {

    progress.position;
  }, [,shuffle]);

  const handlerepeat = () => {
    
    setShuffle(false);
    
  };

  const handleShuffle = () => {
    
    setShuffle(true);
    
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Convert to hours
    const minutes = Math.floor((seconds % 3600) / 60); // Calculate remaining minutes
    const secs = Math.floor(seconds % 60); // Calculate remaining seconds
  
    // Format as HH:MM:SS or MM:SS
    if (hours > 0) {
      return `0${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    } else {
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableRipple
          onPress={() => setModalVisible(false)}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.backButton}
          borderless={true}
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
        </TouchableRipple>

        <Dropmenu
                chapter={chapterId}
                reciterName={reciter}
                reciterID={idReader}
                arabName={reciterAR}
                chapterAr={arabicCH}
                chapteID={IDchapter}                               
              
              /> 
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={require("../assets/images/moon.png")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.chapterText}>
            {languages ? arabicCH : chapterId}
          </Text>
          <Text style={styles.reciterText}>
            {languages ? reciterAR : reciter}
          </Text>
        </View>
      </View>

      {/* Progress bar and time display */}
      <View style={styles.progressContainer}>
        {/* Slider for progress */}
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1} // Ensure duration is valid
          value={position} // Use the position state
          thumbTintColor={Colors.blue} // Apply track style
          minimumTrackTintColor={Colors.blue}
          maximumTrackTintColor="#fff"
          onSlidingComplete={async (value) => {
            await TrackPlayer.seekTo(value); // Seek to the new position
          }}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={playPrevious}>
            <MaterialIcons name="skip-previous" size={40} color="white" />
          </TouchableOpacity>

          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={togglePlayback}
            style={styles.playPauseButton}
          >
            {isPlaying?
             <FontAwesome name="pause" size={24} color="white" />
            :
            <FontAwesome name="play" size={24} color="white" /> }
            
          </TouchableOpacity>
     

          <TouchableOpacity activeOpacity={0.7} onPress={playNext}>
            <MaterialIcons name="skip-next" size={40} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.shuffleRepeatContainer}>
          <TouchableOpacity
            style={[
              {
                backgroundColor:
                  shuffle === true ? Colors.backgroundTint : "transparent",
                padding: 10,
                borderRadius: 5,
              },
            ]}
            onPress={handleShuffle}
            activeOpacity={0.7}
          >
            <MaterialIcons name="shuffle" size={30} color="#00D1FF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                backgroundColor:
                  shuffle === false ? Colors.backgroundTint : "transparent",
                padding: 10,
                borderRadius: 5,
              },
            ]}
            onPress={handlerepeat}
            activeOpacity={0.7}
          >
            <MaterialIcons name="repeat" size={30} color="#00D1FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    marginTop: 16,
    backgroundColor: Colors.background,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal:16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
   
    
    width: 44,
    elevation: 50,
    height: 44,
    zIndex: 99,
    backgroundColor: "#454B8C",
  },
  imageContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#00D1FF",
    width: "90%",
    height: 294,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  chapterText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  reciterText: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  progressContainer: {
    marginTop:16,
    alignItems: "center",
    
  },
  slider: {
    width: "100%",
    
    
  },
  
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "90%",
    
  },
  timeText: {
    color: "white",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal:67,
    width: "100%",
  },
  playPauseButton: {
    backgroundColor: "#00D1FF",
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  shuffleRepeatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 30,
  },
});

export default ModalAudio;
