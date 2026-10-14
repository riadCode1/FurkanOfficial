import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { setDeviceLocation } from "@/lib/location";
import { schedulePrayerNotifications } from "../constants/notificationReminders";

const PRAYER_NAMES = {
  Fajr: "\u0627\u0644\u0641\u062c\u0631",
  Dhuhr: "\u0627\u0644\u0638\u0647\u0631",
  Asr: "\u0627\u0644\u0639\u0635\u0631",
  Maghrib: "\u0627\u0644\u0645\u063a\u0631\u0628",
  Isha: "\u0627\u0644\u0639\u0634\u0627\u0621",
};

const DAILY_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
export default function PrayerTimes() {
  const { width } = useWindowDimensions();
  const [data, setData] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [isLoadingPrayerTimes, setIsLoadingPrayerTimes] = useState(false);
  const [prayerTimesError, setPrayerTimesError] = useState("");
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const { currentLocation, setCurrentLocation, languages } = useGlobalContext();

  const handleSetLocation = useCallback(async () => {
    if (isSettingLocation) return;
    setIsSettingLocation(true);
    try {
      await setDeviceLocation(setCurrentLocation);
    } finally {
      setIsSettingLocation(false);
    }
  }, [isSettingLocation, setCurrentLocation]);

  const fetchPrayerTimes = useCallback(async () => {
    const hasCoordinates = Number.isFinite(Number(currentLocation?.latitude))
      && Number.isFinite(Number(currentLocation?.longitude));
    const hasAddress = Boolean(currentLocation?.city && currentLocation?.country);
    if (!hasCoordinates && !hasAddress) {
      setIsLoadingPrayerTimes(false);
      return;
    }

    setIsLoadingPrayerTimes(true);
    setPrayerTimesError(false);
    try {
      const requestDate = new Date();
      const date = `${String(requestDate.getDate()).padStart(2, "0")}-${String(requestDate.getMonth() + 1).padStart(2, "0")}-${requestDate.getFullYear()}`;
      const endpoint = hasCoordinates ? "timings" : "timingsByAddress";
      const params = new URLSearchParams({
        method: "2",
        ...(hasCoordinates
          ? { latitude: String(currentLocation.latitude), longitude: String(currentLocation.longitude) }
          : { address: `${currentLocation.city}, ${currentLocation.country}` }),
      });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      let response;
      try {
        response = await fetch(`https://api.aladhan.com/v1/${endpoint}/${date}?${params}`, {
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
      if (!response.ok) throw new Error(`Prayer times service returned ${response.status}.`);

      const result = await response.json();
      const prayerData = result?.data;
      if (result?.code !== 200 || !prayerData?.timings) {
        throw new Error(result?.status || "Prayer times were not returned.");
      }
      setHijriDate(prayerData.date.hijri);
      setData(prayerData.timings);
      try {
        await schedulePrayerNotifications(prayerData.timings, languages);
      } catch (notificationError) {
        console.warn("Could not schedule prayer notifications:", notificationError);
      }

      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const next = DAILY_PRAYERS
        .map((name) => ({
          name,
          time: new Date(`${today}T${String(prayerData.timings[name]).slice(0, 5)}:00`),
        }))
        .find((prayer) => prayer.time > now);

      const nextTime = next || {
        name: "Fajr",
        time: new Date(`${today}T${String(prayerData.timings.Fajr).slice(0, 5)}:00`),
      };
      if (!next) nextTime.time.setDate(nextTime.time.getDate() + 1);
      setNextPrayer(nextTime);

      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
      timerRef.current = setTimeout(fetchPrayerTimes, nextTime.time.getTime() - now.getTime());
      countdownRef.current = setInterval(() => {
        const remaining = nextTime.time.getTime() - Date.now();
        if (remaining <= 0) {
          setCountdown(languages ? "\u0627\u0644\u0622\u0646" : "Now");
          clearInterval(countdownRef.current);
          return;
        }
        const hours = Math.floor(remaining / 3_600_000);
        const minutes = Math.floor((remaining % 3_600_000) / 60_000);
        const seconds = Math.floor((remaining % 60_000) / 1_000);
        setCountdown(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch prayer times:", error.response?.data || error.message);
      setPrayerTimesError(
        error?.name === "AbortError"
          ? "The request timed out. Check your internet connection and retry."
          : error?.message || "Check your internet connection and retry."
      );
    } finally {
      setIsLoadingPrayerTimes(false);
    }
  }, [currentLocation, languages]);

  useEffect(() => {
    fetchPrayerTimes();
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchPrayerTimes]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") fetchPrayerTimes();
    });
    return () => subscription.remove();
  }, [fetchPrayerTimes]);

  const hasCoordinates = Number.isFinite(Number(currentLocation?.latitude))
    && Number.isFinite(Number(currentLocation?.longitude));
  if ((!currentLocation?.city || !currentLocation?.country) && !hasCoordinates) {
    return (
      <TouchableOpacity disabled={isSettingLocation} onPress={handleSetLocation} style={[styles.card, styles.locationPrompt]}>
        {isSettingLocation ? <ActivityIndicator size="small" color={Colors.blue} /> : <MaterialIcons name="add-location-alt" size={22} color={Colors.blue} />}
        <Text style={styles.locationText}>
          {isSettingLocation ? (languages ? "\u064a\u062c\u0631\u064a \u062a\u062d\u062f\u064a\u062f \u0645\u0648\u0642\u0639\u0643..." : "Getting your location...") : languages ? "\u0627\u062e\u062a\u0631 \u0645\u0648\u0642\u0639\u0643 \u0644\u0639\u0631\u0636 \u0645\u0648\u0627\u0642\u064a\u062a \u0627\u0644\u0635\u0644\u0627\u0629" : "Set your location to see prayer times"}
        </Text>
        {!isSettingLocation && <MaterialIcons name="chevron-right" size={21} color={Colors.textGray} />}
      </TouchableOpacity>
    );
  }

  if (!data) {
    return (
      <View style={[styles.card, styles.loading]}>
        {isLoadingPrayerTimes ? (
          <ActivityIndicator color={Colors.blue} />
        ) : prayerTimesError ? (
          <>
            <Text style={styles.locationText}>
              {languages ? "تعذر تحميل مواقيت الصلاة" : "Could not load prayer times"}
            </Text>
            <Text style={styles.errorDetail}>{prayerTimesError}</Text>
            <TouchableOpacity onPress={fetchPrayerTimes} style={styles.retryButton}>
              <Text style={styles.retryText}>{languages ? "إعادة المحاولة" : "Try again"}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.locationText}>
            {languages ? "في انتظار مواقيت الصلاة" : "Waiting for prayer times..."}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity disabled={isSettingLocation} onPress={handleSetLocation} style={styles.locationRow}>
        {isSettingLocation ? <ActivityIndicator size="small" color={Colors.blue} /> : <MaterialIcons name="location-on" size={16} color={Colors.blue} />}
        <Text numberOfLines={1} style={styles.locationName}>
          {[currentLocation.city || currentLocation.state, currentLocation.country].filter(Boolean).join(", ") || (languages ? "الموقع الحالي" : "Current location")}
        </Text>
        <MaterialIcons name="edit-location-alt" size={16} color={Colors.textGray} />
      </TouchableOpacity>

      <View style={styles.nextPrayerRow}>
        <View>
          <Text style={styles.eyebrow}>{languages ? "\u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0642\u0627\u062f\u0645\u0629" : "NEXT PRAYER"}</Text>
          <Text style={styles.nextPrayerName}>
            {languages ? PRAYER_NAMES[nextPrayer?.name] : nextPrayer?.name}
          </Text>
        </View>
        <Text style={styles.countdown}>{countdown}</Text>
      </View>

      <View style={styles.divider} />
      <View style={[styles.prayerRow, width < 360 && styles.compactPrayerRow]}>
        {DAILY_PRAYERS.map((name) => (
          <View key={name} style={styles.prayerItem}>
            <Text style={styles.prayerName}>{languages ? PRAYER_NAMES[name] : name}</Text>
            <Text style={styles.prayerTime}>{data[name]}</Text>
          </View>
        ))}
      </View>

      {hijriDate && (
        <Text style={styles.dateText}>
          {hijriDate.day} {hijriDate.month?.en} {hijriDate.year} AH
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(48, 106, 167, 0.3)",
    backgroundColor: "#0b1b3b",
  },
  locationPrompt: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 10 },
  locationText: { flex: 1, color: "#a9c1e5", fontSize: 13 },
  loading: { minHeight: 80, alignItems: "center", justifyContent: "center" },
  retryButton: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 12 },
  retryText: { color: Colors.blue, fontSize: 13, fontWeight: "700" },
  errorDetail: { color: Colors.textGray, fontSize: 11, textAlign: "center", marginTop: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", maxWidth: "100%" },
  locationName: { color: "#a9c1e5", fontSize: 12, flexShrink: 1 },
  nextPrayerRow: { marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: "#91a9ce", fontSize: 10, fontWeight: "700", letterSpacing: 0.8 },
  nextPrayerName: { color: Colors.text, fontSize: 22, fontWeight: "700", marginTop: 3 },
  countdown: { color: Colors.blue, fontSize: 20, fontWeight: "700", fontVariant: ["tabular-nums"] },
  divider: { height: 1, backgroundColor: "rgba(145, 169, 206, 0.14)", marginVertical: 14 },
  prayerRow: { flexDirection: "row", justifyContent: "space-between", gap: 5 },
  compactPrayerRow: { gap: 2 },
  prayerItem: { flex: 1, minWidth: 0, alignItems: "center", gap: 5 },
  prayerName: { color: "#91a9ce", fontSize: 10, fontWeight: "500" },
  prayerTime: { color: Colors.text, fontSize: 11, fontWeight: "600", fontVariant: ["tabular-nums"] },
  dateText: { color: Colors.textGray, fontSize: 10, marginTop: 13 },
});
