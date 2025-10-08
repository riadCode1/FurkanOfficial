import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;

  // Must be a real device
  if (Device.isDevice) {
    // Ask for permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted for push notifications!");
      return;
    }

    // ✅ Get the Expo push token
    const response = await Notifications.getExpoPushTokenAsync({
      projectId: "YOUR_EXPO_PROJECT_ID", // optional, but recommended (see below)
    });

    token = response.data;
    console.log("✅ Expo Push Token:", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  // Android channel
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return token;
}
