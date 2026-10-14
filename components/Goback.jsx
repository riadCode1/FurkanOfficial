import React from "react";
import { StyleSheet, I18nManager, useWindowDimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { router } from "expo-router";

<<<<<<< HEAD
const Goback = ({ onPress, inline = false, style }) => {
=======
const Goback = () => {
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  const { width } = useWindowDimensions();
  const leftPosition = width > 700 ? 32 : 16;

  return (
    <TouchableRipple
<<<<<<< HEAD
      accessibilityRole="button"
      accessibilityLabel={I18nManager.isRTL ? "رجوع" : "Go back"}
      onPress={onPress || (() => router.back())}
      rippleColor="rgba(3, 218, 197, 0.2)"
      style={[inline ? styles.inlineButton : styles.backButton, !inline && (I18nManager.isRTL ? { right: leftPosition } : { left: leftPosition }), style]}
      borderless={inline}
=======
      onPress={() => router.back()}
      rippleColor="rgba(255, 255, 255, 0.2)"
      style={[styles.backButton, { left: leftPosition }]}
      borderless
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    >
      <MaterialIcons
        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
        size={24}
<<<<<<< HEAD
        color={Colors.text}
=======
        color="white"
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
    backgroundColor: "rgba(7,20,38,0.86)",
    borderWidth: 1,
    borderColor: "rgba(3,218,197,0.35)",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
  },
  inlineButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(3,218,197,0.1)",
    borderWidth: 1,
    borderColor: "rgba(3,218,197,0.24)",
=======
    backgroundColor: Colors.barbottom,
    borderRadius: 50,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
});
