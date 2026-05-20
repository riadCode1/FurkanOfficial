import {
  View, Text, I18nManager, StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RadioButton, TouchableRipple } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Updates from "expo-updates";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";

const LANGUAGES = [
  { value: "first",  label: "العربية",  flag: "🇩🇿" },
  { value: "second", label: "English",  flag: "🇬🇧" },
];

const Languages = () => {
  const { languages, checked, saveCheck, setLanguages } = useGlobalContext();
  const ar = !!languages;

  const select = async (value) => {
    const isArabic = value === "first";
    setLanguages(isArabic);
    saveCheck(value);
    try {
      await Updates.reloadAsync();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={S.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      {/* ── header ── */}
      <View style={S.header}>
        <TouchableRipple
          onPress={() => router.back()}
          rippleColor="rgba(255,255,255,0.1)"
          style={S.backBtn}
          borderless
        >
          <MaterialIcons
            name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
            size={22}
            color="white"
          />
        </TouchableRipple>
        <Text style={S.headerTitle}>{ar ? "اللغة" : "Languages"}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── subtitle ── */}
      <Text style={S.subtitle}>
        {ar
          ? "اختر لغة التطبيق. سيتم إعادة التشغيل تلقائيًا."
          : "Choose the app language. The app will restart automatically."}
      </Text>

      {/* ── options ── */}
      <View style={S.list}>
        {LANGUAGES.map((lang, i) => {
          const isSelected = checked === lang.value;
          return (
            <React.Fragment key={lang.value}>
              <TouchableRipple
                onPress={() => select(lang.value)}
                rippleColor="rgba(91,141,238,0.12)"
                style={[S.option, isSelected && S.optionSelected]}
              >
                <View style={S.optionInner}>
                  <Text style={S.flag}>{lang.flag}</Text>
                  <Text style={[S.optionLabel, isSelected && S.optionLabelSelected]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={20} color={Colors.blue} style={{ marginRight: 4 }} />
                  )}
                  <RadioButton
                    value={lang.value}
                    status={isSelected ? "checked" : "unchecked"}
                    onPress={() => select(lang.value)}
                    uncheckedColor="rgba(255,255,255,0.3)"
                    color={Colors.blue}
                  />
                </View>
              </TouchableRipple>
              {i < LANGUAGES.length - 1 && <View style={S.divider} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* ── note ── */}
      <View style={S.note}>
        <MaterialIcons name="info-outline" size={16} color="rgba(255,255,255,0.35)" />
        <Text style={S.noteTxt}>
          {ar
            ? "ستتم إعادة تشغيل التطبيق بعد تغيير اللغة"
            : "The app will restart after changing the language"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Languages;

const S = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.background },

  // header
  header:             { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  backBtn:            { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center" },
  headerTitle:        { color: "white", fontSize: 17, fontWeight: "700" },

  // subtitle
  subtitle:           { color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", marginTop: 20, marginBottom: 12, paddingHorizontal: 32 },

  // list
  list:               { marginHorizontal: 16, borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  option:             { height: 64 },
  optionSelected:     { backgroundColor: "rgba(91,141,238,0.08)" },
  optionInner:        { flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12 },
  flag:               { fontSize: 24 },
  optionLabel:        { flex: 1, color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: "500" },
  optionLabelSelected:{ color: "white", fontWeight: "700" },
  divider:            { height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginLeft: 60 },

  // note
  note:               { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, paddingHorizontal: 24 },
  noteTxt:            { color: "rgba(255,255,255,0.35)", fontSize: 12 },
});