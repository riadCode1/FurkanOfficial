import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import StyleSheet from "react-native-media-query";
import { Colors } from '../constants/Colors';
import { TouchableRipple } from 'react-native-paper';
let { width, height } = Dimensions.get("window");

const ArrowScroll = ({scrollToTop}) => {
  return (
   <TouchableRipple
          onPress={scrollToTop}
          rippleColor="rgba(255, 255, 255, 0.2)"
          style={styles.buttonScroll}
          borderless={true}
        >
          <MaterialIcons name="arrow-upward" size={24} color="white" />
        </TouchableRipple>
  )
}

const { styles } = StyleSheet.create({

    buttonScroll: {
    width: 48,
    height: 48,
    right: 16,
    borderRadius: 50,
    position: "absolute",
    zIndex: 999,
    backgroundColor: Colors.barbottom,
    bottom: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 50,

    "@media (min-width: 700px)": {
      right: 32,
    },
  },
})

export default ArrowScroll