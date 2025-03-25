import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RadioButton, TouchableRipple } from "react-native-paper";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import StyleSheet from "react-native-media-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
const Languagues = () => {
  const { languages, checked, saveCheck, setLanguages } = useGlobalContext();

  const handleFirst = () => {
    setLanguages(true);
    saveCheck("first");
  };

  const handleSecond = () => {
    setLanguages(false);
    saveCheck("second");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableRipple
        onPress={() => router.back()}
        rippleColor="rgba(255, 255, 255, 0.2)"
        style={styles.backButton}
        borderless={true}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableRipple>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {languages ? "اللغة" : "Languages"}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Arabic Option */}
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
              uncheckedColor="#00D1FF"
              color="#00D1FF"
              theme={"primary"}
            />
          </View>
        </TouchableRipple>

        {/* English Option */}
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
              uncheckedColor="#00D1FF"
              color="#00D1FF"
              theme={"primary"}
            />
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

const { styles } = StyleSheet.create({
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
  backButton: {
    position: "absolute",
    width: 48,
    height: 48,
    top: 44,
    left: 16,
    zIndex: 99,
    elevation: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#454B8C",
    borderRadius: 50,
    "@media (min-width: 700px)": {
      left: 32,
    },
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
