import { View, Text, Image, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';


const Index = () => {
  useEffect(() => {
    setTimeout(() => {
      router.navigate("Index");
    }, 3000);
  }, []);

  return (
    <>
      
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/images/SplashFK.png")}
      style={styles.imageBackground}
    >
      <StatusBar barStyle={Colors.tint} backgroundColor={Colors.background}/>
      
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("../assets/images/Logo.png")}
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
  },
  title: {
    color: '#00D1FF',
    fontSize: 24, // Adjust size for better scaling across devices
    fontWeight: 'bold',
  },
  arabicText: {
    // Style the Arabic text image as needed
  },
});

export default Index;
