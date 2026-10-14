import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PRAYER_NOTIFICATION_CHANNEL = "prayer-adhan-v2";
export const ADHKAR_NOTIFICATION_CHANNEL = "adhkar-reminders";
const DAILY_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_NAMES_AR = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export async function cancelNotificationsByType(type) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.content.data?.type === type)
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
}

export async function schedulePrayerNotifications(timings, languages) {
  const enabled = await AsyncStorage.getItem("prayerNotificationsEnabled")
    ?? await AsyncStorage.getItem("notificationsEnabled");
  if (enabled === "false") return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(PRAYER_NOTIFICATION_CHANNEL, {
      name: "Prayer time Adhan",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  await cancelNotificationsByType("prayer-time");
  await Promise.all(
    DAILY_PRAYERS.map((name) => {
      const match = String(timings[name]).match(/^(\d{1,2}):(\d{2})/);
      if (!match) return Promise.resolve();

      return Notifications.scheduleNotificationAsync({
        content: {
          title: languages ? `حان وقت صلاة ${PRAYER_NAMES_AR[name]}` : `${name} prayer time`,
          body: languages ? "حان الآن وقت الصلاة" : "It's time to pray.",
          sound: "default",
          data: { type: "prayer-time", prayer: name },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: Number(match[1]),
          minute: Number(match[2]),
          ...(Platform.OS === "android" ? { channelId: PRAYER_NOTIFICATION_CHANNEL } : {}),
        },
      });
    }),
  );
}

export async function scheduleAdhanTestNotification(languages) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(PRAYER_NOTIFICATION_CHANNEL, {
      name: "Prayer time Adhan",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: languages ? "اختبار صوت الأذان" : "Adhan sound test",
      body: languages ? "هذا إشعار تجريبي لصوت الأذان." : "This is a test of the Adhan notification sound.",
      sound: "default",
      data: { type: "adhan-test" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      ...(Platform.OS === "android" ? { channelId: PRAYER_NOTIFICATION_CHANNEL } : {}),
    },
  });
}

export async function refreshPrayerNotifications(location, languages) {
  const hasCoordinates = Number.isFinite(Number(location?.latitude))
    && Number.isFinite(Number(location?.longitude));
  const hasAddress = Boolean(location?.city && location?.country);
  if (!hasCoordinates && !hasAddress) return;

  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const endpoint = hasCoordinates ? "timings" : "timingsByAddress";
  const params = new URLSearchParams({
    method: "2",
    ...(hasCoordinates
      ? { latitude: String(location.latitude), longitude: String(location.longitude) }
      : { address: `${location.city}, ${location.country}` }),
  });
  const response = await fetch(`https://api.aladhan.com/v1/${endpoint}/${date}?${params}`);
  if (!response.ok) throw new Error(`Prayer times service returned ${response.status}.`);
  const result = await response.json();
  if (result?.code !== 200 || !result?.data?.timings) {
    throw new Error(result?.status || "Prayer times were not returned.");
  }
  await schedulePrayerNotifications(result.data.timings, languages);
}

export async function scheduleAdhkarReminders(languages) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  await cancelNotificationsByType("adhkar-reminder");

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ADHKAR_NOTIFICATION_CHANNEL, {
      name: "Adhkar reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    });
  }

  const reminders = [
    {
      hour: 8,
      title: languages ? "أذكار الصباح" : "Morning adhkar",
      body: languages ? "ابدأ يومك بذكر الله" : "Take a moment for your morning remembrance.",
    },
    {
      hour: 18,
      title: languages ? "أذكار المساء" : "Evening adhkar",
      body: languages ? "حان وقت أذكار المساء" : "Take a moment for your evening remembrance.",
    },
  ];

  await Promise.all(
    reminders.map(({ hour, title, body }) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          data: { type: "adhkar-reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute: 0,
          ...(Platform.OS === "android" ? { channelId: ADHKAR_NOTIFICATION_CHANNEL } : {}),
        },
      }),
    ),
  );
}
