import { Alert } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setDeviceLocation(setCurrentLocation) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location permission needed", "Allow location access to show prayer times.");
      return false;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    let place;
    try {
      [place] = await Location.reverseGeocodeAsync(position.coords);
    } catch (geocodingError) {
      console.warn("Could not reverse geocode device location:", geocodingError);
    }
    const locationData = {
      city: place?.city || place?.district || place?.subregion || place?.region,
      state: place?.region || place?.subregion,
      country: place?.country,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    if (!Number.isFinite(locationData.latitude) || !Number.isFinite(locationData.longitude)) {
      Alert.alert("Location unavailable", "Could not determine your city and country. Try again.");
      return false;
    }

    await AsyncStorage.setItem("currentLocation", JSON.stringify(locationData));
    setCurrentLocation(locationData);
    return true;
  } catch (error) {
    console.error("Could not set device location:", error);
    Alert.alert("Could not set location", error?.message || "Check your location settings and try again.");
    return false;
  }
}
