import StyleSheet from "react-native-media-query";
import React from 'react'

import { router } from "expo-router";
import { I18nManager } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

const Goback = () => {
  return (
    <TouchableRipple
        onPress={() => router.back()}
        rippleColor="rgba(255, 255, 255, 0.2)"
        style={styles.backButton}
        borderless
      >
        <MaterialIcons
          name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
          size={24}
          color="white"
        />
      </TouchableRipple>
  )
}

export default Goback

const {styles} = StyleSheet.create({
 backButton: {
    position: "absolute",
    width: 48,
    height: 48,
    top: 44,
    left: 16,
    zIndex: 99,
    elevation: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.barbottom,
    borderRadius: 50,
    "@media (min-width: 700px)": {
      left: 32,
    },
  },

})