import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";
import { registerForPushNotificationsAsync } from "../../../constants/BackgroundTask";

// ✅ Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Main prepare function
export const prepareLocation = async (setCurrentLocation, currentLocation) => {
  try {
    // 1️⃣ Try to load stored location first
    const storedLocation = await AsyncStorage.getItem("currentLocation");

    if (storedLocation) {
      console.log("📦 Loaded location from AsyncStorage");
      const parsed = JSON.parse(storedLocation);
     
      setCurrentLocation(parsed);
      return; // Skip fetching again
    }

    // 2️⃣ If no stored location, request permissions
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus !== "granted") {
      alert("Permission for notifications not granted!");
      return;
    }

    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      alert("Permission for location not granted!");
      return;
    }

    // 3️⃣ Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    console.log("📍 Current coordinates:", latitude, longitude);

    // 4️⃣ Reverse geocode
    const placemarks = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (placemarks.length > 0) {
      const place = placemarks[0];
      const locationData = {
        city: place.city || "Unknown city",
        state: place.region || "Unknown state",
        country: place.country || "Unknown country",
      };

      console.log("🌍 Location data:", locationData);

      // Save to context
      setCurrentLocation(locationData);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(locationData)
      );

      console.log("✅ Location saved to AsyncStorage");
    }
  } catch (error) {
    console.error("❌ Error during prepare:", error);
  }
};

export const prepare = async (setCurrentLocation, currentLocation) => {
  try {
    // 1️⃣ Try to load stored location first
    

    // 2️⃣ If no stored location, request permissions
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus !== "granted") {
      alert("Permission for notifications not granted!");
      return;
    }

    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      alert("Permission for location not granted!");
      return;
    }

    // 3️⃣ Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    console.log("📍 Current coordinates:", latitude, longitude);

    // 4️⃣ Reverse geocode
    const placemarks = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (placemarks.length > 0) {
      const place = placemarks[0];
      const locationData = {
        city: place.city || "Unknown city",
        state: place.region || "Unknown state",
        country: place.country || "Unknown country",
      };

      console.log("🌍 Location data:", locationData);

      // Save to context
      setCurrentLocation(locationData);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(locationData)
      );

      console.log("✅ Location saved to AsyncStorage");
    }
  } catch (error) {
    console.error("❌ Error during prepare:", error);
  }
};

// ✅ Main layout component
const _layout = () => {
  const { setCurrentLocation, currentLocation } = useGlobalContext();

  useEffect(() => {
    prepareLocation(setCurrentLocation, currentLocation);
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
