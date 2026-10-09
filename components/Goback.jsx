import React from "react";
import { StyleSheet, I18nManager, useWindowDimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { router } from "expo-router";

const Goback = () => {
  const { width } = useWindowDimensions();
  const leftPosition = width > 700 ? 32 : 16;

  return (
    <TouchableRipple
      onPress={() => router.back()}
      rippleColor="rgba(255, 255, 255, 0.2)"
      style={[styles.backButton, { left: leftPosition }]}
      borderless
    >
      <MaterialIcons
        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
        size={24}
        color="white"
      />
    </TouchableRipple>
  );
};

export default Goback;

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    width: 48,
    height: 48,
    top: 44,
    zIndex: 99,
    elevation: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.barbottom,
    borderRadius: 50,
  },
});
