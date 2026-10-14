import { I18nManager, useWindowDimensions, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";

const ArrowScroll = ({ scrollToTop }) => {
  const { width } = useWindowDimensions();

  return (
    <TouchableRipple
      accessibilityRole="button"
      accessibilityLabel={I18nManager.isRTL ? "العودة إلى الأعلى" : "Scroll back to top"}
      onPress={scrollToTop}
      rippleColor="rgba(7, 20, 38, 0.18)"
      style={[styles.buttonScroll, I18nManager.isRTL ? { left: width >= 700 ? 28 : 18 } : { right: width >= 700 ? 28 : 18 }, { bottom: width >= 700 ? 32 : 164 }]}
      borderless
    >
      <MaterialIcons name="keyboard-double-arrow-up" size={24} color={Colors.background} />
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  buttonScroll: {
    width: 50,
    height: 50,
    position: "absolute",
    zIndex: 999,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default ArrowScroll;
