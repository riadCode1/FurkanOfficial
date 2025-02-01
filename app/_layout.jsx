import React, { useCallback, useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
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

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(()=>playbackService)

export default function RootLayout() {

  const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	}) 

	
  
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
