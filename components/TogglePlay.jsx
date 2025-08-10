import { View, Text } from 'react-native'
import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import { Colors } from '../constants/Colors'
import StyleSheet from "react-native-media-query";
import { MaterialIcons } from '@expo/vector-icons';

const TogglePlay = ({name,dataAudio,togglePlayback,playAuto,arab_name,id,isPlaying}) => {
  return (
     <TouchableRipple
    onPress={
      isPlaying
        ? togglePlayback
        : () =>
            playAuto(
              dataAudio[0]?.audio_url,
              1,
              "Al-Fatihah",
              name,
              arab_name,
              id,
              "الفاتحة"
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

export default TogglePlay