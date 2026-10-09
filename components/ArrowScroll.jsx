import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";

const ArrowScroll = ({ scrollToTop }) => {
  const { width } = useWindowDimensions();

  const dynamicStyles = StyleSheet.create({
    buttonScroll: {
      width: 48,
      height: 48,
      right: width >= 700 ? 32 : 16,
      borderRadius: 50,
      position: "absolute",
      zIndex: 999,
      backgroundColor: Colors.barbottom,
      bottom: width * 0.5,
      alignItems: "center",
      justifyContent: "center",
      elevation: 50,
    },
  });

  return (
    <TouchableRipple
      onPress={scrollToTop}
      rippleColor="rgba(255, 255, 255, 0.2)"
      style={dynamicStyles.buttonScroll}
      borderless={true}
    >
      <MaterialIcons name="arrow-upward" size={24} color="white" />
    </TouchableRipple>
  );
};

export default ArrowScroll;
