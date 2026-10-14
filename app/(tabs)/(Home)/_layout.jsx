import React, { useEffect } from "react";
<<<<<<< HEAD
import { Alert } from "react-native";
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";
<<<<<<< HEAD
=======
import { registerForPushNotificationsAsync } from "../../../constants/BackgroundTask";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

// ✅ Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Main prepare function
<<<<<<< HEAD
export const prepareLocation = async (setCurrentLocation) => {
=======
export const prepareLocation = async (setCurrentLocation, currentLocation) => {
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
<<<<<<< HEAD
    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      Alert.alert("Location permission needed", "Allow location access to show prayer times.");
=======
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus !== "granted") {
      alert("Permission for notifications not granted!");
      return;
    }

    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      alert("Permission for location not granted!");
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(locationData)
      );
<<<<<<< HEAD
      setCurrentLocation(locationData);
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

      console.log("✅ Location saved to AsyncStorage");
    }
  } catch (error) {
    console.error("❌ Error during prepare:", error);
  }
};

<<<<<<< HEAD
export const prepare = async (setCurrentLocation) => {
=======
export const prepare = async (setCurrentLocation, currentLocation) => {
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  try {
    // 1️⃣ Try to load stored location first
    

    // 2️⃣ If no stored location, request permissions
<<<<<<< HEAD
    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      Alert.alert("Location permission needed", "Allow location access to show prayer times.");
=======
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus !== "granted") {
      alert("Permission for notifications not granted!");
      return;
    }

    const { status: locStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locStatus !== "granted") {
      alert("Permission for location not granted!");
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      await AsyncStorage.setItem(
        "currentLocation",
        JSON.stringify(locationData)
      );
<<<<<<< HEAD
      setCurrentLocation(locationData);
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

      console.log("✅ Location saved to AsyncStorage");
    }
  } catch (error) {
    console.error("❌ Error during prepare:", error);
  }
};

// ✅ Main layout component
<<<<<<< HEAD
const HomeLayout = () => {
  const { setCurrentLocation } = useGlobalContext();

  useEffect(() => {
    void prepareLocation(setCurrentLocation);
  }, [setCurrentLocation]);
=======
const _layout = () => {
  const { setCurrentLocation, currentLocation } = useGlobalContext();

  useEffect(() => {
    prepareLocation(setCurrentLocation, currentLocation);
    registerForPushNotificationsAsync();
  }, []);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

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

<<<<<<< HEAD
      <StatusBar backgroundColor="#071426" style="light" />
=======
      <StatusBar backgroundColor="#161622" style="light" />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </>
  );
};

<<<<<<< HEAD
export default HomeLayout;
=======
export default _layout;
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
