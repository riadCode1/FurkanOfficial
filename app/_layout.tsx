import React, { useCallback, useEffect } from "react";
<<<<<<< HEAD
import "../global.css";
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
import { router, SplashScreen, Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalPortal } from "react-native-modals";
import GlobalProvider from "../context/GlobalProvider";
<<<<<<< HEAD
=======
import { Slot } from "expo-router";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

import TrackPlayer from "react-native-track-player";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { playbackService } from "../constants/playbackService";
import { Linking, Platform, StatusBar } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';


import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { Colors } from "@/constants/Colors";
<<<<<<< HEAD
import { ScrollToTopProvider } from "../context/ScrollToTopProvider";
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3



SplashScreen.preventAutoHideAsync();

TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {

 

 
//new update
 useEffect(() => {
    const inAppUpdates = new SpInAppUpdates(false); // false = not debug

   inAppUpdates.checkNeedsUpdate().then((result) => {
  if (result.shouldUpdate) {
    let updateOptions: StartUpdateOptions = {};
    if (Platform.OS === 'android') {
      // android only, on iOS the user will be promped to go to your app store page
      updateOptions = {
        updateType: IAUUpdateKind.IMMEDIATE,
      };
    }
    inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
  }
});
console.log(inAppUpdates.startUpdate)
  }, []);


// native tab bar 

 useEffect(() => {
<<<<<<< HEAD
      NavigationBar.setBackgroundColorAsync(Colors.background);
=======
      NavigationBar.setBackgroundColorAsync(Colors.barbottom);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      NavigationBar.setButtonStyleAsync('dark'); // or 'light'
  
      return () => {
        // Optional: reset on unfocus
<<<<<<< HEAD
        NavigationBar.setBackgroundColorAsync(Colors.background);
=======
        NavigationBar.setBackgroundColorAsync(Colors.barbottom);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      };
   }, [])


  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  });
  useEffect(() => {
<<<<<<< HEAD
    const handleDeepLink = (url: string) => {
      if (url === "trackplayer://notification.click") {
        // Navigate to your player screen
        router.navigate("/(tabs)/(Home)/Index"); // Replace with your navigation logic
=======
    const handleDeepLink = (url) => {
      if (url === "trackplayer://notification.click") {
        // Navigate to your player screen
        router.navigate("Index"); // Replace with your navigation logic
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
            <ScrollToTopProvider>
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
            <Stack>


              
<<<<<<< HEAD
=======
              <Slot />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
              <Stack.Screen
                name="index"
                options={{
                  statusBarBackgroundColor: "transparent",
                  animation: "fade",
                  headerShown: false,
                }}
              />
              <Stack.Screen
<<<<<<< HEAD
                name="onboarding"
                options={{
                  animation: "fade",
                  headerShown: false,
                }}
              />
              <Stack.Screen
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
            </ScrollToTopProvider>
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          </PaperProvider>
       
          
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}
