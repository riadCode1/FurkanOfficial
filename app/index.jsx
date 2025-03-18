import { View, Text, Image, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import { router, useFocusEffect } from 'expo-router';



const Index = () => {
   useEffect(() => {
     setTimeout(() => {
       router.navigate("Index");
      
     }, 3000);
   }, []);

   useFocusEffect(
     React.useCallback(() => {
        
       setTimeout(() => {
         router.navigate("Index");
        
       }, 2000);
     }, [])
   );

  

  return (
    <>
      
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/images/SplashFK.png")}
      style={styles.imageBackground}
    >
      
      
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("../assets/images/logoIndex.png")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Furqan</Text>
          <Image
            style={styles.arabicText}
            resizeMode="contain"
            source={require("../assets/images/الفرقان.png")}
          />
        </View>
      </View>
    </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    height: 150,
    width: 150,
    
  },
  textContainer: {
    alignItems: 'center',
    bottom:30
  },
  title: {
    color: '#00D1FF',
    fontSize: 24, // Adjust size for better scaling across devices
    fontWeight: 'bold',
  },
  arabicText: {
   width:75,
   height:42
  },
});

export default Index;
