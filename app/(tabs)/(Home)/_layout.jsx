import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { useGlobalContext } from "@/context/GlobalProvider";
import { registerForPushNotificationsAsync } from "../../../constants/BackgroundTask";

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Exported prepare function
export const prepare = async (setCurrentLocation) => {
  try {
    // Request notification permission
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications not granted!");
      return;
    }

    // Request location permission
    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      alert("Permission for location not granted!");
      return;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    console.log(location);

    // Reverse geocode coordinates → human readable address
    const placemarks = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    console.log(placemarks);

    if (placemarks.length > 0) {
      const place = placemarks[0];
      setCurrentLocation({
        city: place.city || "Unknown city",
        state: place.region || "Unknown state",
        country: place.country || "Unknown country",
      });
    }
  } catch (error) {
    console.error("Error during prepare:", error);
  }
};

// ✅ Main layout component
const _layout = () => {
  const { setCurrentLocation } = useGlobalContext();

  useEffect(() => {
    prepare(setCurrentLocation);
    registerForPushNotificationsAsync();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="Index"
          options={{ animation: "fade", headerShown: false }}
        />
        <Stack.Screen
          name="ReaderSurah"
          options={{ animation: "fade", headerShown: false }}
        />
        <Stack.Screen
          name="Readers"
          options={{ animation: "fade", headerShown: false }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default _layout;
