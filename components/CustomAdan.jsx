<<<<<<< HEAD
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
=======
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,

} from "react-native";
import axios from "axios";
import * as vector from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { prepare } from "@/app/(tabs)/(Home)/_layout";
import { ImageBackground } from "expo-image";
;

export default function PrayerTimes() {
  const { width, height } = useWindowDimensions();
  const [data, setData] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [normalDate, setNormalDate] = useState(null);
  const [countdown, setCountdown] = useState("");
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const { currentLocation, setCurrentLocation, languages } = useGlobalContext(); // assume language comes from global context

  // Arabic translation map
  const prayerNames = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
    Midnight: "منتصف الليل",
    Firstthird: "الثلث الاول",
    Lastthird: "الثلث الاخير",
    Sunrise: "الشروق",
    Sunset: "الغروب",
  };

  const fetchPrayerTimes = async () => {
    try {
      const response = await axios.get(
        "https://api.aladhan.com/v1/timingsByAddress",
        {
          params: {
            address: currentLocation
              ? `${currentLocation?.city},${currentLocation?.country}`
              : "",

            method: 2,
          },
        },
      );
      
      setHijriDate(response.data.data.date.hijri);
      setNormalDate(response.data.data.date.gregorian);

      const timings = response.data.data.timings;
      setData(timings);

      // Calculate next prayer
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const prayers = Object.entries(timings);
      console.log(prayers);
      let next = null;
      for (const [name, time] of prayers) {
        const prayerTime = new Date(`${today}T${time}:00`);
        if (prayerTime > now) {
          next = { name, time: prayerTime };
          break;
        }
      }

      // If all prayers passed, pick first of next day (usually Fajr)
      if (!next) {
        const [firstName, firstTime] = Object.entries(timings)[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        next = {
          name: firstName,
          time: new Date(
            `${tomorrow.toISOString().split("T")[0]}T${firstTime}:00`,
          ),
        };
      }

      setNextPrayer(next);

      // Clear old timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);

      // Refetch at the next prayer
      const diffMs = next.time - now;
      timerRef.current = setTimeout(fetchPrayerTimes, diffMs);

      // Countdown timer
      countdownRef.current = setInterval(() => {
        const now = new Date();
        const diff = next.time - now;

        if (diff <= 0) {
          setCountdown("Now");
          clearInterval(countdownRef.current);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
  };
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

  useEffect(() => {
    fetchPrayerTimes();
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
<<<<<<< HEAD
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
=======
  }, [currentLocation]);
  if (!currentLocation) {
    return (
      <TouchableOpacity
        onPress={() => prepare(setCurrentLocation)}
        style={styles.center}
      >
        <vector.MaterialIcons
          color={Colors.blue}
          size={30}
          name="add-location"
        />
        <Text style={styles.text}>
          set your location to get today's prayer times
        </Text>
      </TouchableOpacity>
    );
  }
  if (!data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.blue} size="large" />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      </View>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <View style={styles.container}>
      <ImageBackground
        contentFit="cover"
        source={
          nextPrayer?.name === "Fajr"
            ? require("../assets/images/fajr.jpg")
            : nextPrayer?.name === "Asr"
              ? require("../assets/images/asr.png")
              : nextPrayer?.name === "Sunset"
                ? require("../assets/images/maghrib.png")
              : nextPrayer?.name === "Maghrib"
                ? require("../assets/images/maghrib.png")
                : nextPrayer?.name === "Isha"
                  ? require("../assets/images/ishaa.png")
                  : nextPrayer?.name === "Midnight"
                  ? require("../assets/images/ishaa.png")
                  : nextPrayer?.name === "Firstthird"
                  ? require("../assets/images/ishaa.png")
                  : nextPrayer?.name === "lastthird"
                  ? require("../assets/images/ishaa.png")
                  : nextPrayer?.name === "Sunrise"
                    ? require("../assets/images/subh.jpg")
                    : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2t5JTIwY2xvdWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        }
        style={{
          borderRadius: 8,
          
          overflow: "hidden",
          width: "100%",
        }}
      >
        <View
          style={{
            padding: 16,
          }}
        >


        <TouchableOpacity
          onPress={() => prepare(setCurrentLocation)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: "20%",
            alignItems: "center",
          }}
        >
          <Text style={styles.textTime}>
            {currentLocation.city}, {currentLocation?.country}
          </Text>
        </TouchableOpacity>


{/* hijri date */}

         <View style={{}}>
            <View style={{ alignItems: "center", marginBottom: 5 }}>
              <Text style={[  styles.countdown, { alignSelf: "flex-start", } ]}>
                {languages
                  ? `${hijriDate?.day} ${hijriDate?.month?.en} ${hijriDate?.year} `
                  : `${hijriDate?.day} ${hijriDate?.month?.en} ${hijriDate?.year} `}
                  •
                {languages
                  ? ` ${normalDate?.day} ${normalDate?.month?.en} ${normalDate?.year}`
                  : ` ${normalDate?.day} ${normalDate?.month?.en} ${normalDate?.year}`}
              </Text>
            </View>
          
          </View>


        {nextPrayer && (
          <View style={{}}>
            <View style={{ alignItems: "center", marginBottom: 5 }}>
              <Text style={styles.nextTitle}>
                {languages
                  ? `${prayerNames[nextPrayer.name] || nextPrayer.name} ${data[nextPrayer.name]} `
                  : `${nextPrayer.name} ${data[nextPrayer.name]}` ||
                    ` ${nextPrayer.name}`}
                {nextPrayer.name === "Fajr" && "Dhuhr" ? " AM" : " PM"}
              </Text>
            </View>
            <Text style={styles.countdown}>
              {languages ? " في" : "In "}
              {countdown}
            </Text>
          </View>
        )}

        <View style={{ borderRadius: 8, marginTop: 24 }}>
          {/* <Text style={styles.title}>
            {languages ? "مواقيت الصلاة اليوم" : "Today's Prayer Times"}
          </Text> */}

          <View
            style={{
              
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.2,
            }}
          >
            {Object.entries(data)
              .filter((_, index) => [0, 1, 2, 3, 5, 6].includes(index))
              .map(([name, time]) => (
                <View
                  key={name}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: width*0.14,
                    height: 50,
                    borderRadius: 4,
                    gap: 2,
                    backgroundColor: "rgba(74, 74, 79, 0.75)",
                  }}
                >
                  <Text style={styles.text}>
                    {languages ? prayerNames[name] || name : name}
                  </Text>

                  {/* {name === "Asr" && (
                    <vector.Ionicons
                      size={20}
                      color="white"
                      name="partly-sunny"
                    />
                  )}
                  {name === "Dhuhr" && (
                    <vector.Ionicons size={20} color="white" name="sunny" />
                  )}
                  {name === "Sunset" && (
                    <vector.Feather size={20} color="white" name="sunset" />
                  )}
                  {name === "Sunrise" && (
                    <vector.Feather size={20} color="white" name="sunrise" />
                  )}
                  {name === "Maghrib" && (
                    <vector.FontAwesome5
                      size={20}
                      color="white"
                      name="cloud-moon"
                    />
                  )}
                  {name === "Isha" && (
                    <vector.FontAwesome6 size={20} color="white" name="moon" />
                  )}
                  {name === "Fajr" && (
                    <vector.MaterialIcons
                      size={20}
                      color="white"
                      name="sunny-snowing"
                    />
                  )} */}

                  <Text style={styles.textTime}>
                    {time} <Text style={{fontSize:6}}>{name === "Fajr" || name === "Dhuhr" || name === "Sunrise" ? " AM" : " PM"}</Text> 
                  </Text>
                </View>
              ))}
          </View>
        </View>
        </View>
      </ImageBackground>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 16,

    position: "relative",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "white" },
  text: { fontSize: 12, color: "white" },
  textTime: { fontSize: 10, color: "white" },
  nextTitle: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  countdown: { fontSize: 13, color: "rgba(255,255,255,0.9)" },
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
});
