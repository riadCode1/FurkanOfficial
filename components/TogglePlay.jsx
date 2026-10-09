import React from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

const TogglePlay = ({
  name,
  dataAudio,
  togglePlayback,
  playAuto,
  arab_name,
  id,
  isPlaying,
}) => {
  const { width } = useWindowDimensions();

  // Example: Adjust button size based on screen width
  const dynamicSize = width > 700 ? 56 : 48;

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
      style={[
        styles.playPauseButton,
        {
          width: dynamicSize,
          height: dynamicSize,
          borderRadius: dynamicSize / 2,
        },
      ]}
      borderless
    >
      <MaterialIcons
        name={isPlaying ? "pause" : "play-arrow"}
        size={24}
        color={Colors.blue}
      />
    </TouchableRipple>
  );
};

const styles = {
  playPauseButton: {
    backgroundColor: Colors.barbottom,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default TogglePlay;
