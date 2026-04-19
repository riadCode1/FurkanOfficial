import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import * as vector from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { prepare } from "@/app/(tabs)/(Home)/_layout";
import { ImageBackground } from "expo-image";
import { useWindowDimensions } from "react-native";

export default function PrayerTimes() {
  const [data, setData] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState("");
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const { width } = useWindowDimensions();
  const scale = width / 375; // base iPhone width
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

  useEffect(() => {
    fetchPrayerTimes();
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
      contentFit="fill"
        source={nextPrayer?.name === "Fajr" 
          ? require("../assets/images/fajr.jpg")
          : nextPrayer?.name === "Asr"
          ?require("../assets/images/asr.png")
          : nextPrayer?.name === "Maghrib"
          ? require("../assets/images/maghrib.png")
          : nextPrayer?.name === "Isha"
          ? require("../assets/images/isha.png")
          : nextPrayer?.name === "Sunrise"
          ? require("../assets/images/subh.jpg")
          :  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2t5JTIwY2xvdWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"}
        style={{ borderRadius: 8, overflow: "hidden",width:'100%'  }}
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

        {nextPrayer && (
          <View style={{padding:12  }}>
          <View style={{  marginBottom: 5 }}>

            <Text style={styles.nextTitle}>
              {languages
                ? `${prayerNames[nextPrayer.name] || nextPrayer.name} ${data[nextPrayer.name]} `
                
                : `${nextPrayer.name} ${data[nextPrayer.name]}`|| ` ${nextPrayer.name}`}
                 {nextPrayer.name === "Fajr"&& "Dhuhr" ? " AM" : " PM"}
            </Text>
            
          </View>
          <Text style={styles.countdown}>
           {  languages ? " في" : "In "} 
             {countdown}
            </Text>
          

          </View>
        )}

        
          {/* <Text style={styles.title}>
            {languages ? "مواقيت الصلاة اليوم" : "Today's Prayer Times"}
          </Text> */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.2,
              padding: 12,
               marginTop: 24, 
               
               alignSelf:'center'
             
              
              
            }}
          >
            {Object.entries(data)
               .filter((_, index) => [0,1, 2, 3, 5, 6].includes(index))
              .map(([name, time]) => (
                <View
                  key={name}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    borderRadius: 4,
                    gap: 4,
                    backgroundColor: "rgba(74, 74, 79, 0.75)",
                  }}
                >
                  <Text style={[styles.text, { fontSize: 12 * scale, }]}>
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

                  <Text style={styles.textTime}>{ time} {name === "Fajr" && "Dhuhr" ? " AM" : " PM"}</Text>
                </View>
              ))}
          
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 10,
    
    position: "relative",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  title: {  fontWeight: "bold", marginBottom: 10, color: "white" },
  text: {  color: "white" },
   textTime: { fontSize: 10 , color: "white" },
  nextTitle: {
    alignSelf: "flex-start",
    fontSize: 20 ,
    fontWeight: "700",
    color: "white",
  },
  countdown: {  fontSize: 13 , color:'rgba(255,255,255,0.9)', },
});
