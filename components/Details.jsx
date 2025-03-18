import { View, Text, ScrollView, Dimensions } from "react-native";
import React from "react";
import StyleSheet from 'react-native-media-query';
let { width, height } = Dimensions.get("window");

const Details = ({ info, }) => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>About Chapter</Text>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.text}>{info}</Text>
      </ScrollView>
    </View>
  );
};

const {styles} = StyleSheet.create({
  container: {
   
    paddingHorizontal: 16,
    zIndex:99,
    '@media (min-width: 700px)': {
      
     paddingHorizontal:32
        },
    

  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
   paddingBottom:200 // Adjust the height as needed
  },
  scrollContent: {
    paddingBottom: height*0.2,
  },
  text: {
    color: "#D1D1D1", // Gray color for the text
    fontSize: 14,
  },
});

export default Details;
