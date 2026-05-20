import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  if (error) {
    console.error("Background task error:", error);
    return;
  }

  if (data) {
    const { notification } = data;
    console.log("📩 Received background notification:", notification);

    // Example: trigger a local notification with sound
    if (notification.request.content.data?.playSound) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Background Action",
          body: "Triggered from silent push",
          sound: "mysound.wav",
        },
        trigger: null,
      });
    }
  }
});

// Register the task
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
