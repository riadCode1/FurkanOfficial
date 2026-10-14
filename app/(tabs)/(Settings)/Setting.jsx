<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  I18nManager,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Switch } from "react-native-paper";
import { router } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/images";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { useScrollToTop } from "../../../context/ScrollToTopProvider";
import {
  cancelNotificationsByType,
  refreshPrayerNotifications,
  scheduleAdhanTestNotification,
  scheduleAdhkarReminders,
} from "../../../constants/notificationReminders";

const DONATE_URL = "https://www.paypal.com/ncp/payment/4GFTTGH38F4EC";

function SettingsLink({ icon, title, subtitle, onPress, last = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`min-h-[76px] flex-row items-center justify-between px-[15px] ${
        last ? "" : "border-b border-[rgba(143,169,212,0.16)]"
      }`}
      style={({ pressed }) => pressed && { opacity: 0.78 }}
    >
      <View className="mr-3.5 h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[rgba(6,220,231,0.1)]">
        <MaterialIcons name={icon} size={21} color={Colors.blue} />
      </View>
      <View  className="flex-1 rtl:items-start" >
        <Text className="text-base font-semibold text-white">{title}</Text>
        {!!subtitle && (
          <Text className="mt-1 text-sm text-[#9baed5]">{subtitle}</Text>
        )}
      </View>
      <MaterialIcons
        name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
        size={25}
        color="#8298c3"
      />
    </Pressable>
  );
}

function SectionTitle({ children }) {
  return (
    <Text className="mb-2.5 ml-1 text-xs font-bold tracking-[1.2px] text-[#9baed5]">
      {children}
    </Text>
  );
}

export default function Setting() {
  const scrollRef = useRef(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { currentLocation, languages } = useGlobalContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [adhkarRemindersEnabled, setAdhkarRemindersEnabled] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("prayerNotificationsEnabled"),
      AsyncStorage.getItem("notificationsEnabled"),
      AsyncStorage.getItem("adhkarRemindersEnabled"),
      Notifications.getPermissionsAsync(),
    ]).then(([prayerValue, legacyPrayerValue, adhkarValue, permission]) => {
      const savedPrayerValue = prayerValue ?? legacyPrayerValue;
      setNotificationsEnabled(savedPrayerValue === null ? permission.status === "granted" : savedPrayerValue === "true");
      setAdhkarRemindersEnabled(adhkarValue === "true");
    }).catch((error) => console.warn("Could not load notification preference", error));
  }, []);

  const requestNotificationPermission = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      ({ status } = await Notifications.requestPermissionsAsync());
    }
    if (status !== "granted") {
      Alert.alert(
        languages ? "الإشعارات غير مفعلة" : "Notifications are off",
        languages ? "اسمح بالإشعارات من إعدادات جهازك لتفعيلها." : "Allow notifications in your device settings to turn them on."
      );
      return false;
    }
    return true;
  };

  const togglePrayerNotifications = async (enabled) => {
    if (enabled && !(await requestNotificationPermission())) return;
    if (!enabled) await cancelNotificationsByType("prayer-time");

    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem("notificationsEnabled", String(enabled));
    await AsyncStorage.setItem("prayerNotificationsEnabled", String(enabled));
    if (enabled) {
      try {
        await refreshPrayerNotifications(currentLocation, languages);
      } catch (error) {
        console.warn("Could not schedule prayer notifications:", error);
      }
    }
  };

  const toggleAdhkarReminders = async (enabled) => {
    if (enabled) {
      if (!(await requestNotificationPermission())) return;
      await scheduleAdhkarReminders(languages);
    } else {
      await cancelNotificationsByType("adhkar-reminder");
    }

    setAdhkarRemindersEnabled(enabled);
    await AsyncStorage.setItem("adhkarRemindersEnabled", String(enabled));
  };

  const testAdhanSound = async () => {
    if (!(await requestNotificationPermission())) return;
    try {
      await scheduleAdhanTestNotification(languages);
    } catch (error) {
      console.warn("Could not schedule the Adhan test notification:", error);
      Alert.alert(
        languages ? "تعذر تشغيل الاختبار" : "Could not test the sound",
        languages ? "يرجى المحاولة مرة أخرى." : "Please try again.",
      );
    }
  };
  const openDonatePage = () => {
    Linking.openURL(DONATE_URL).catch((error) => {
      console.warn("Could not open the donation page", error);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View className="mb-7 px-1 pt-3">
          <Text className="text-[30px] font-bold text-white">
            {languages ? "الإعدادات" : "Settings"}
          </Text>
          <Text className="mt-2 text-base text-[#9baed5]">
            {languages
              ? "خصص تجربتك مع الفرقان"
              : "Make Furqan feel right for you."}
          </Text>
        </View>

        <View className="mb-7 rounded-[24px] border border-[rgba(75,142,224,0.42)] bg-[#0d2058] p-[18px]">
          <View className="flex-row items-center">
            <View className="mr-3.5 h-14 w-14 items-center justify-center rounded-[18px] bg-[rgba(6,220,231,0.12)]">
              <Image
                source={images.authLogo}
                className="h-[42px] w-[42px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">
                {languages ? "ادعم الفرقان" : "Support Furqan"}
              </Text>
              <Text className="mt-1 text-sm leading-5 text-[#b8c8e8]">
                {languages
                  ? "ساعدنا على إبقاء التطبيق مجانيًا وخاليًا من الإعلانات."
                  : "Help keep Quran listening free and ad-free for everyone."}
              </Text>
            </View>
          </View>
         <Pressable
            accessibilityRole="button"
            onPress={openDonatePage}
            className="mt-[18px] min-h-12 flex-row items-center justify-center rounded-2xl bg-[#03DAC5]"
            style={({ pressed }) => pressed && { opacity: 0.78 }}
          >
            <MaterialIcons name="favorite" size={19} color="#101a68" />
            <Text className="ml-2 text-base font-bold text-[#101a68]">
              {languages ? "تبرع" : "Make a donation"}
            </Text>
            <MaterialIcons
              name="open-in-new"
              size={17}
              color="#101a68"
              style={styles.externalIcon}
            />
          </Pressable>
        </View>

        <SectionTitle>{languages ? "التفضيلات" : "PREFERENCES"}</SectionTitle>
        <View className="mb-[26px] overflow-hidden rounded-[22px] border border-[rgba(75,142,224,0.3)] bg-[#0b1b4b]">
          <SettingsLink
            icon="language"
            title={languages ? "اللغة" : "Language"}
            subtitle={languages ? "العربية" : "English"}
            onPress={() => router.push("/(tabs)/(Settings)/Languagues")}
          />
          <View className="min-h-[82px] flex-row items-center justify-between px-[15px]">
            <View className="mr-3.5 h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[rgba(6,220,231,0.1)]">
              <MaterialIcons name="notifications-none" size={21} color={Colors.blue} />
            </View>
            <View className="flex-1 rtl:items-start ">
              <Text className="text-base font-semibold text-white">
                {languages ? "الإشعارات" : "Notifications"}
              </Text>
              <Text className="mt-1 text-sm text-[#9baed5]">
                {languages
                  ? "تنبيهات الاستماع والتحديثات"
                  : "Adhan sound at each prayer time"}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={togglePrayerNotifications}
              color={Colors.blue}
              accessibilityLabel={languages ? "الإشعارات" : "Notifications"}
            />
          </View>

         

          <View className="min-h-[82px]  flex-row items-center justify-between px-[15px]">
            <View className="mr-3.5 h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[rgba(6,220,231,0.1)]">
              <MaterialIcons name="self-improvement" size={21} color={Colors.blue} />
            </View>
            
            <View className="flex-1 text-start rtl:items-start">
              <Text className="text-base  font-semibold text-white">
                {languages ? "تذكير الأذكار" : "Adhkar reminders"}
              </Text>
              <Text className="mt-1 text-sm text-[#9baed5]">
                {languages ? "أذكار الصباح ٨:٠٠ والمساء ٦:٠٠" : "Morning at 8:00 AM and evening at 6:00 PM"}
              </Text>
            </View>
            <Switch
              value={adhkarRemindersEnabled}
              onValueChange={toggleAdhkarReminders}
              color={Colors.blue}
              accessibilityLabel={languages ? "تذكير الأذكار" : "Adhkar reminders"}
=======
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  
  StyleSheet,
  
  Linking,
  I18nManager,
} from "react-native";

import  { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {  MaterialIcons } from "@expo/vector-icons";

import { router } from "expo-router";
import {  Switch, TouchableRipple } from "react-native-paper";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Setting = () => {
  const { languages } = useGlobalContext();
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {languages ? "إعدادات" : "Settings"}
          </Text>
        </View>

        <View style={styles.card}>
          <ImageBackground
            resizeMode="cover"
            source={require("../../../assets/images/SplashIndex.png")}
            style={styles.imageBackground}
          >
            <View style={styles.imageContent}>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={require("../../../assets/images/Logo.png")}
              />
              <Text style={styles.supportText}>
                {languages ? "ادعمنا" : "Support Us"}
              </Text>
              <View style={styles.textContainer}>
                <Text style={styles.descriptionText}>
                  {languages
                    ? "تم إنشاء تطبيق الفرقان ليتم استخدامه بالكامل مجانًا خالية تماما من الإعلانات، يمكنك دعم عملنا من خلال التبرعات"
                    : "Furqan App is created to be used completely for free with absolutely zero ads, you can support our work through donation"}
                </Text>
              </View>
            </View>

            {/*section 2 */}
            <TouchableRipple
              rippleColor="rgb(200, 200, 200,0.8)"
              onPress={() =>
                Linking.openURL(
                  "https://www.paypal.com/ncp/payment/4GFTTGH38F4EC"
                )
              }
              style={styles.donateButton}
            >
              <Text style={styles.donateButtonText}>
                {languages ? "تبرع" : "Donate"}
              </Text>
            </TouchableRipple>
          </ImageBackground>
        </View>

        {/*section 2 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/Languagues/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons name="public" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? "اللغات" : "Languages"}
              </Text>
            </View>
            <MaterialIcons
              size={30}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color={"white"}
            />
          </View>
        </TouchableRipple>

        {/*section 3 */}
        <View style={styles.touchable}>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons
                name="notifications-active"
                size={24}
                color="white"
              />
              <Text style={styles.optionText}>
                {languages ? "إشعارات" : "Notifications"}
              </Text>
            </View>
            <Switch
              color={Colors.blue}
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
            />
          </View>
        </View>

<<<<<<< HEAD
        <SectionTitle>{languages ? "حول التطبيق" : "ABOUT"}</SectionTitle>
        <View className="mb-[26px] overflow-hidden rounded-[22px] border border-[rgba(75,142,224,0.3)] bg-[#0b1b4b]">
          <SettingsLink
            icon="verified-user"
            title={languages ? "سياسة الخصوصية" : "Privacy policy"}
            subtitle={languages ? "كيف نحمي بياناتك" : "How we handle your data"}
            onPress={() => router.push("/(tabs)/(Settings)/Privacy")}
          />
          <SettingsLink
            icon="description"
            title={languages ? "الشروط والأحكام" : "Terms & conditions"}
            subtitle={languages ? "شروط استخدام التطبيق" : "App usage information"}
            onPress={() => router.push("/(tabs)/(Settings)/Terms")}
            last
          />
        </View>

        <Text className="mb-3 mt-1 text-center text-xs text-[#7287b2]">
          Furqan · Quran audio for every day
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 150 },
  externalIcon: { marginStart: 8 },
});
=======
        {/*section 4 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/Privacy/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons name="privacy-tip" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? "سياسة الخصوصية" : "Privacy & policy"}
              </Text>
            </View>
            <MaterialIcons
              size={30}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color={"white"}
            />
          </View>
        </TouchableRipple>

        {/*section 5 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/Terms/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons name="fact-check" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? " شروط الخدمة" : "Terms & Conditions  "}
              </Text>
            </View>
            <MaterialIcons
              size={30}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color={"white"}
            />
          </View>
        </TouchableRipple>

     
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    paddingBottom: 200,
  },
  header: {
    marginTop: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 36,
    marginBottom: 34,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    alignItems:"center",
    justifyContent:"center"
  },
  imageContent: {
    alignItems: "center",
  },
  logo: {
    width: 56,
    height: 56,
  },
  supportText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  textContainer: {
    paddingHorizontal: 16,
    marginTop: 16,

    height: 60,
  },
  descriptionText: {
    color: Colors.textGray,
    textAlign: "center",
  },
  donateButton: {
    width: "50%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    alignSelf: "center",
  },
  donateButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  touchable: {
    flexDirection: "row",
    width: "100%",
    height: 56,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
  },
  optionTextContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: "white",
  },

  modalContainer: {
    justifyContent: "center",
    alignItems: "center",

    height: "100%",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonD: {
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCE5",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    width: 150,
    alignSelf: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Setting;
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
