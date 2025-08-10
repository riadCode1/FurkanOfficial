import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
let { width, height } = Dimensions.get("window");

const Lineargradient = () => {
  return (
    <LinearGradient
               colors={[
                 "transparent",
                 "rgba(17,18,35,1)",
                 "rgba(17,18,35,1)",
                 "rgba(17,18,35,1)",
               ]}
               style={{
                 width: width,
                 height: height * 0.1,
                 position: "absolute",
                 zIndex: 1,
                 bottom: 0,
               }}
               start={{ x: 0.5, y: 0 }}
               end={{ x: 0.5, y: 2 }}
             />
  )
}

export default Lineargradient

const styles = StyleSheet.create({})