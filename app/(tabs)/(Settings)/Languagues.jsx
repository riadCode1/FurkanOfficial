import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RadioButton, TouchableRipple } from "react-native-paper";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";

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

const styles = StyleSheet.create({
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
