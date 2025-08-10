import React, { useCallback, useEffect } from "react";
import { router, SplashScreen, Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalPortal } from "react-native-modals";
import GlobalProvider from "../context/GlobalProvider";
import { Slot } from "expo-router";

import TrackPlayer from "react-native-track-player";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { playbackService } from "../constants/playbackService";
import { Linking, StatusBar } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
import { Colors } from "../constants/Colors";





SplashScreen.preventAutoHideAsync();

TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {

// native tab bar 

 useEffect(() => {
      NavigationBar.setBackgroundColorAsync(Colors.barbottom);
      NavigationBar.setButtonStyleAsync(Colors.barbottom); // or 'dark'
  
      return () => {
        // Optional: reset on unfocus
        NavigationBar.setBackgroundColorAsync(Colors.barbottom);
      };
   }, [])


  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  });
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (url === "trackplayer://notification.click") {
        // Navigate to your player screen
        router.navigate("Index"); // Replace with your navigation logic
      }
    };

    // Check if the app was launched from a closed state with the URI
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for incoming links while the app is running
    Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    // Cleanup
    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);
  {
    /*check internet */
  }

  

  return (
    <GlobalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      

       
          <PaperProvider>
            <Stack>


              
              <Slot />
              <Stack.Screen
                name="index"
                options={{
                  statusBarBackgroundColor: "transparent",
                  animation: "fade",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  statusBarBackgroundColor: "transparent",
                  animation: "slide_from_bottom",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  statusBarBackgroundColor: "transparent",
                  animation: "fade",
                  headerShown: false,
                }}
              />
            </Stack>
            <ModalPortal />
          </PaperProvider>
       
          
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}
