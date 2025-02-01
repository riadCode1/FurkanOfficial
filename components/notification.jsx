import * as Notifications from "expo-notifications";

export async function showAudioNotification(isPlaying) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Now Playing",
      body: isPlaying ? "Tap to pause" : "Tap to play",
      data: { action: isPlaying ? "pause" : "play" },
    },
    trigger: null, // Show immediately
  });
}
