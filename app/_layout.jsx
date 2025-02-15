import React, { useCallback, useEffect } from "react";
import { router, SplashScreen, Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalPortal } from "react-native-modals";
import GlobalProvider from "../context/GlobalProvider";
import { Slot } from "expo-router";
import "../global.css";
import TrackPlayer from "react-native-track-player";
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { playbackService } from "../constants/playbackService";
import { Linking } from "react-native";

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(()=>playbackService)

export default function RootLayout() {

  const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	}) 
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (url === 'trackplayer://notification.click') {
        // Navigate to your player screen
        router.navigate('Index'); // Replace with your navigation logic
      }
    };

    // Check if the app was launched from a closed state with the URI
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for incoming links while the app is running
    Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Cleanup
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

	
  
  return (
    <GlobalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <Stack>
            <Slot/>
            <Stack.Screen
              name="index"
              options={{ animation: "fade", headerShown: false }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ animation: "fade", headerShown: false }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{ animation: "fade", headerShown: false }}
            />
          </Stack>
          <ModalPortal />
        </PaperProvider>
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}
