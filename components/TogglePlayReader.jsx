import StyleSheet from "react-native-media-query";
import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import { Colors } from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

const TogglePlayReader = ({isPlaying,togglePlayback,playAuto,Chapterid}) => {
  return (
    <TouchableRipple
            onPress={
              isPlaying
                ? togglePlayback
                : () =>
                    playAuto(
                     1,Chapterid
                    )
            }
            rippleColor="rgba(0, 209, 255, 0.2)"
            style={styles.playPauseButton}
            borderless
          >
            <MaterialIcons
              name={isPlaying ? "pause" : "play-arrow"}
              size={24}
              color={Colors.blue}
            />
          </TouchableRipple>
  )
}

export default TogglePlayReader

const { ids, styles } = StyleSheet.create({
 
  playPauseButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.barbottom,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

 
});