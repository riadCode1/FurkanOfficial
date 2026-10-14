<<<<<<< HEAD
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert, I18nManager, Pressable, StyleSheet, Text, View } from "react-native";
import * as Updates from "expo-updates";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/Colors";
import { images } from "../../../constants/images";
import { useGlobalContext } from "../../../context/GlobalProvider";
import Goback from "../../../components/Goback";

const LANGUAGES = [
  { value: "second", name: "English", subtitle: "English (United States)", icon: "language" },
  { value: "first", name: "العربية", subtitle: "Arabic (Saudi Arabia)", icon: "translate" },
];

const Languages = () => {
  const { languages, checked, saveCheck, setLanguages } = useGlobalContext();
  const [saving, setSaving] = useState(false);

  const chooseLanguage = async (value) => {
    if (saving || checked === value) return;
    setSaving(true);
    const isArabic = value === "first";
    setLanguages(isArabic);
    try {
      await saveCheck(value);
      if (I18nManager.isRTL !== isArabic) {
        I18nManager.allowRTL(isArabic);
        I18nManager.forceRTL(isArabic);
        Alert.alert(
          isArabic ? "إعادة التشغيل مطلوبة" : "Restart required",
          isArabic ? "أعد تشغيل التطبيق لتطبيق اتجاه اللغة الجديد." : "Restart the app to apply the language direction.",
          [{ text: isArabic ? "موافق" : "OK", onPress: () => Updates.reloadAsync() }],
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#071426]">
      <Image source={images.authPattern} contentFit="cover" style={styles.pattern} />
      <LinearGradient
        pointerEvents="none"
        colors={[Colors.background, "rgba(7,20,38,0.08)", "rgba(7,20,38,0.2)"]}
        locations={[0, 0.5, 1]}
        style={styles.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View className="h-10 flex-row items-center justify-between">
          <Goback inline style={styles.backButton} />
          <Text className="text-2xl font-bold text-[#F8F9FF]">
            {languages ? "اللغة" : "Language"}
          </Text>
          <View className="w-[42px]" />
        </View>

        <View className="h-24 items-center justify-center">
          
        </View>

        <View className="items-center pt-3">
          <Text className="text-center text-[27px] font-extrabold leading-[34px] text-[#F8F9FF]">
            {languages ? "اختر لغتك" : <>Choose your <Text className="text-[#03DAC5]">language</Text></>}
          </Text>
          <Text className="mt-2 text-center text-base font-semibold leading-[22px] text-[#9EB5FF]">
            {languages ? "اختر لغتك المفضلة للمتابعة مع الفرقان." : <>Select your preferred language to continue{"\n"}with Furkan.</>}
          </Text>
          <Text className="mt-1.5 text-center text-[17px] leading-6 text-[#9EB5FF]">
            {!languages && "اختر لغتك المفضلة للمتابعة مع الفرقان"}
          </Text>
        </View>

        <View className="mt-[18px]">
          <Text className="mb-2.5 ml-1 text-sm font-bold text-[#9EB5FF]">
            {languages ? "اللغات المتاحة" : "Available languages"}
          </Text>
          <View className="gap-2">
            {LANGUAGES.map((option) => {
              const selected = checked === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityLabel={`${option.name}, ${selected ? "selected" : "not selected"}`}
                  accessibilityState={{ checked: selected, disabled: saving }}
                  disabled={saving}
                  onPress={() => chooseLanguage(option.value)}
                  className={`min-h-[78px] flex-row items-center gap-3.5 rounded-[23px] border-2 border-[#253F91] bg-[rgba(7,20,59,0.88)] px-[18px] ${
                    selected
                      ? "border-[3px] border-[#08D9EF] bg-[rgba(3,218,197,0.12)]"
                      : ""
                  }`}
                  style={({ pressed }) => [
                    selected && styles.selectedShadow,
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    className={`h-[46px] w-[46px] items-center justify-center rounded-[15px] ${
                      selected ? "bg-[#03DAC5]" : "bg-[rgba(6,220,231,0.1)]"
                    }`}
                  >
                    <MaterialIcons
                      name={option.icon}
                      size={23}
                      color={selected ? Colors.background : Colors.textGray}
                    />
                  </View>
                  <View className="flex-1 gap-[5px]">
                    <Text className="text-[21px] font-bold text-[#F8F9FF]">{option.name}</Text>
                    <Text className="text-sm font-medium text-[#9EB5FF]">{option.subtitle}</Text>
                  </View>
                  <View
                    className={`h-[30px] w-[30px] items-center justify-center rounded-full border-2 ${
                      selected
                        ? "border-[#08D9EF] bg-[#08D9EF]"
                        : "border-[#344A9C] bg-transparent"
                    }`}
                  >
                    {selected ? (
                      <MaterialIcons name="check" size={20} color={Colors.background} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className="flex-1" />
      </SafeAreaView>
    </View>
=======
import {
  View,
  Text,
  Button,
  I18nManager,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RadioButton, TouchableRipple } from "react-native-paper";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Updates from "expo-updates";

const Languagues = () => {
  const { width } = useWindowDimensions();
  const { languages, checked, saveCheck, setLanguages } = useGlobalContext();

  const handleFirst = async () => {
    setLanguages(true);
    saveCheck("first");
    try {
      if (saveCheck === "first") {
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSecond = async () => {
    setLanguages(false);
    saveCheck("second");
    try {
      if (saveCheck === "second") {
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const dynamicStyles = StyleSheet.create({
    backButton: {
      position: "absolute",
      width: 48,
      height: 48,
      top: 44,
      left: width >= 700 ? 32 : 16,
      zIndex: 99,
      elevation: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.barbottom,
      borderRadius: 50,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableRipple
        onPress={() => router.back()}
        rippleColor="rgba(255, 255, 255, 0.2)"
        style={dynamicStyles.backButton}
        borderless={true}
      >
        <Ionicons
          name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
          size={24}
          color="white"
        />
      </TouchableRipple>

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {languages ? "اللغة" : "Languages"}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableRipple
          activeOpacity={1}
          rippleColor="rgba(53, 53, 151, 0.5)"
          onPress={handleFirst}
          style={styles.option}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionText}>العربية</Text>
            <RadioButton
              value="first"
              status={checked === "first" ? "checked" : "unchecked"}
              onPress={handleFirst}
              uncheckedColor={Colors.blue}
              color={Colors.blue}
              theme={"primary"}
            />
          </View>
        </TouchableRipple>

        <TouchableRipple
          activeOpacity={1}
          rippleColor="rgba(53, 53, 151, 0.5)"
          onPress={handleSecond}
          style={styles.option}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionText}>English</Text>
            <RadioButton
              value="second"
              status={checked === "second" ? "checked" : "unchecked"}
              onPress={handleSecond}
              uncheckedColor={Colors.blue}
              color={Colors.blue}
              theme={"primary"}
            />
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  safeArea: { flex: 1, paddingHorizontal: 16 },
  absoluteFill: { ...StyleSheet.absoluteFillObject },
  pattern: { ...StyleSheet.absoluteFillObject, opacity: 0.12 },
  backButton: {
    backgroundColor: "rgba(7,20,38,0.88)",
    borderColor: "rgba(3,218,197,0.35)",
  },
  logo: { width: 104, height: 100 },
  selectedShadow: {
    shadowColor: "#00DDF5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.58,
    shadowRadius: 16,
    elevation: 7,
  },
  pressed: { opacity: 0.84 },
});

export default Languages;
=======
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  optionsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  option: {
    height: 48,
    width: "100%",
  },
  optionContent: {
    height: 48,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});

export default Languagues;
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
