import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import * as vector from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { prepare } from "@/app/(tabs)/(Home)/_layout";
import { ImageBackground } from "expo-image";

export default function PrayerTimes() {
  const [data, setData] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState("");

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const { width } = useWindowDimensions();
  const scale = width / 375;

  const { currentLocation, setCurrentLocation, languages } =
    useGlobalContext();

  const prayerNames = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
    Sunrise: "الشروق",
  };

  /* ---------------- FETCH ---------------- */
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
        }
      );

      const timings = response.data.data.timings;
      setData(timings);

      const now = new Date();
      const today = now.toISOString().split("T")[0];

      let next = null;

      for (const [name, time] of Object.entries(timings)) {
        const prayerTime = new Date(`${today}T${time}:00`);
        if (prayerTime > now) {
          next = { name, time: prayerTime };
          break;
        }
      }

      if (!next) {
        const [firstName, firstTime] = Object.entries(timings)[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        next = {
          name: firstName,
          time: new Date(
            `${tomorrow.toISOString().split("T")[0]}T${firstTime}:00`
          ),
        };
      }

      setNextPrayer(next);

      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);

      const diffMs = next.time - now;
      timerRef.current = setTimeout(fetchPrayerTimes, diffMs);

      countdownRef.current = setInterval(() => {
        const now = new Date();
        const diff = next.time - now;

        if (diff <= 0) {
          setCountdown("Now");
          clearInterval(countdownRef.current);
          return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(
          `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        );
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [currentLocation]);

  /* ---------------- STATES ---------------- */
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
      </View>
    );
  }

  /* ---------------- IMAGE ---------------- */
  const bgImage =
    nextPrayer?.name === "Fajr"
      ? require("../assets/images/fajr.jpg")
      : nextPrayer?.name === "Asr"
      ? require("../assets/images/asr.png")
      : nextPrayer?.name === "Maghrib"
      ? require("../assets/images/maghrib.png")
      : nextPrayer?.name === "Isha"
      ? require("../assets/images/isha.png")
      : require("../assets/images/subh.jpg");

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage}
        contentFit="cover"
        style={{ borderRadius: 10, overflow: "hidden" }}
      >
        {/* Location */}
        <TouchableOpacity
          onPress={() => prepare(setCurrentLocation)}
          style={styles.locationBox}
        >
          <Text style={[styles.textTime, { fontSize: 11 * scale }]}>
            {currentLocation.city}, {currentLocation.country}
          </Text>
        </TouchableOpacity>

        {/* Next Prayer */}
        {nextPrayer && (
          <View style={{ padding: 12 }}>
            <Text style={[styles.nextTitle, { fontSize: 20 * scale }]}>
              {languages
                ? prayerNames[nextPrayer.name] || nextPrayer.name
                : nextPrayer.name}{" "}
              {data[nextPrayer.name]}{" "}
              {nextPrayer.name === "Fajr" ||
              nextPrayer.name === "Sunrise"
                ? "AM"
                : "PM"}
            </Text>

            <Text style={[styles.countdown, { fontSize: 13 * scale }]}>
              {languages ? "في " : "In "} {countdown}
            </Text>
          </View>
        )}

        {/* Grid */}
        <View style={styles.grid}>
          {Object.entries(data)
            .filter((_, i) => [0, 1, 2, 3, 5, 6].includes(i))
            .map(([name, time]) => (
              <View
                key={name}
                style={[
                  styles.card,
                  { minWidth: width / 4 - 12 },
                ]}
              >
                <Text style={{ fontSize: 12 * scale, color: "white" }}>
                  {languages ? prayerNames[name] || name : name}
                </Text>

                <Text style={{ fontSize: 10 * scale, color: "white" }}>
                  {time}{" "}
                  {name === "Fajr" || name === "Sunrise"
                    ? "AM"
                    : "PM"}
                </Text>
              </View>
            ))}
        </View>
      </ImageBackground>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    color: "white",
  },
  textTime: {
    color: "white",
  },
  nextTitle: {
    fontWeight: "700",
    color: "white",
  },
  countdown: {
    color: "rgba(255,255,255,0.9)",
  },
  locationBox: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 12,
    marginTop: 20,
  },
  card: {
    margin: 4,
    padding: 8,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "rgba(74,74,79,0.75)",
  },
});