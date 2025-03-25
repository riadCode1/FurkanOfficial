import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PlayList from "../../../components/PlayList";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Library = ({}) => {
  const { languages } = useGlobalContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: Colors.text, fontSize: 20, fontWeight: "bold" }}>
          {languages ? "مدخراتك" : "Your Savings"}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <PlayList />
      </View>

      {/* Modal */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",

    padding: 16,
    marginBottom: 40,
  },
  goBackButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.tint,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  scrollContainer: {
    height: 94,
  },
  scrollView: {
    marginTop: 32,
    alignSelf: "center",
    height: 40,
  },

  button: {
    width: 102,
    height: 38,
    backgroundColor: "#373597",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 16,
  },
  backButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",

    width: 48,
    elevation: 50,
    height: 48,
    zIndex: 99,
    backgroundColor: "#454B8C",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  buttonsContainer: {},
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonText: {
    marginBottom: 8,
  },
  tabUnderline: {
    width: 112,
    height: 1,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: "90%",
    height: 250,
    padding: 20,
    backgroundColor: "#343C66",
    borderRadius: 10,

    elevation: 10, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: 700,
    marginBottom: 32,
  },

  searchBarContainer: {
    borderRadius: 8,
    paddingHorizontal: 16,

    backgroundColor: "#454B8C",
    height: 48,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    width: 290,
    color: "white",
  },
  filters: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  customRadius: {
    width: "45%",
    height: 48,
    borderRadius: 10,
    borderColor: Colors.tintLight,
    backgroundColor: Colors.tintLight,
  },
  customRadius2: {
    width: "49%",
    borderRadius: 10,
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
  },
  filterText: {
    color: Colors.textGray,
    fontSize: 16,
  },
});

export default Library;
