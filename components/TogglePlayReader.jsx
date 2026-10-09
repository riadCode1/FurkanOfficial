import React from "react";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";

const TogglePlayReader = ({ isPlaying, togglePlayback, playAuto, Chapterid }) => {
  const { width } = useWindowDimensions();

  // Adjust size dynamically based on screen width
  const dynamicSize = width > 700 ? 56 : 48;

  return (
    <TouchableRipple
      onPress={
        isPlaying
          ? togglePlayback
          : () => playAuto(1, Chapterid)
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

export default TogglePlayReader;

const styles = {
  playPauseButton: {
    backgroundColor: Colors.barbottom,
    justifyContent: "center",
    alignItems: "center",
  },
};
