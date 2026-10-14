import React, { useEffect } from "react";
import { Alert } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";

// ✅ Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Main prepare function
export const prepareLocation = async (setCurrentLocation) => {
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
    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      Alert.alert("Location permission needed", "Allow location access to show prayer times.");
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

    if (placemarks.length === 0) {
      Alert.alert("Location unavailable", "Could not determine your location. Try again.");
      return;
    }

    if (placemarks.length > 0) {
      const place = placemarks[0];
      const locationData = {
        city: place.city || place.district || place.subregion || place.region,
        state: place.region || place.subregion,
        country: place.country,
      };

      if (!locationData.city || !locationData.country) {
        Alert.alert("Location unavailable", "Could not determine your city and country. Try again.");
        return;
      }

      console.log("🌍 Location data:", locationData);

      // Save to context
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(locationData)
      );
      setCurrentLocation(locationData);

      console.log("✅ Location saved to AsyncStorage");
    }
  } catch (error) {
    console.error("❌ Error during prepare:", error);
  }
};

export const prepare = async (setCurrentLocation) => {
  try {
    // 1️⃣ Try to load stored location first
    

    // 2️⃣ If no stored location, request permissions
    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      Alert.alert("Location permission needed", "Allow location access to show prayer times.");
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

    if (placemarks.length === 0) {
      Alert.alert("Location unavailable", "Could not determine your location. Try again.");
      return;
    }

    if (placemarks.length > 0) {
      const place = placemarks[0];
      const locationData = {
        city: place.city || place.district || place.subregion || place.region,
        state: place.region || place.subregion,
        country: place.country,
      };

      if (!locationData.city || !locationData.country) {
        Alert.alert("Location unavailable", "Could not determine your city and country. Try again.");
        return;
      }

      console.log("🌍 Location data:", locationData);

      // Save to context
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(locationData)
      );
      setCurrentLocation(locationData);

      console.log("✅ Location saved to AsyncStorage");
    }
  } catch (error) {
    console.error("❌ Error during prepare:", error);
  }
};

// ✅ Main layout component
const HomeLayout = () => {
  const { setCurrentLocation } = useGlobalContext();

  useEffect(() => {
    void prepareLocation(setCurrentLocation);
  }, [setCurrentLocation]);

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

      <StatusBar backgroundColor="#071426" style="light" />
    </>
  );
};

export default HomeLayout;
