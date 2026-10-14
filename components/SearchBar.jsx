<<<<<<< HEAD
import { View, TextInput, useWindowDimensions, StyleSheet } from "react-native";
=======
import { View, TextInput, Animated, Platform, Dimensions, StyleSheet } from "react-native";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";

<<<<<<< HEAD
const SearchBar = ({ title, setSearchQuery, searchQuery }) => {
  const { width } = useWindowDimensions();
  const [isFocused, setIsFocused] = useState(false);
  const { languages } = useGlobalContext();

=======

let { width } = Dimensions.get("window");

const SearchBar = ({ title, setSearchQuery, searchQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { languages } = useGlobalContext();

  console.log("search3",searchQuery)
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  return (
    <View style={styles.container}>
      <View
        style={[
<<<<<<< HEAD
          styles.searchField,
          {
            borderColor: isFocused
              ? "rgba(70, 131, 207, 0.65)"
              : "rgba(70, 131, 207, 0.22)",
=======
          styles.animatedView,
          {
            borderColor: isFocused ? Colors.blue : "transparent",
            backgroundColor: Colors.barbottom,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
            width: width * 0.93,
          },
        ]}
      >
<<<<<<< HEAD
        <MaterialIcons
          name="search"
          size={25}
          color="#91aed8"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={title}
          placeholderTextColor="#91a9ce"
          onChangeText={setSearchQuery}
=======
        <TextInput
          placeholder={title}
          placeholderTextColor={Colors.textGray}
          onChangeText={(text) => setSearchQuery(text)}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            { textAlign: languages ? "right" : "left" },
          ]}
        />

        {searchQuery?.length >= 1 ? (
          <MaterialIcons
            onPress={() => setSearchQuery("")}
            name="close"
            size={24}
<<<<<<< HEAD
            color="#91a9ce"
          />
        ) : null}
=======
            color={Colors.textGray}
          />
        ) : (
          <MaterialIcons
            name="search"
            size={24}
            strokeWidth={5}
            color={Colors.textGray}
          />
        )}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {},
  searchField: {
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    backgroundColor: "#0b1b3c",
  },
  searchIcon: { marginEnd: 12 },
  textInput: {
    flex: 1,
    paddingVertical: 0,
    color: Colors.textGray,
    fontSize: 14,
  },
});
=======
  container: {
    // Equivalent to pt-2 in Tailwind
  },
  animatedView: {
    borderWidth: 1, // Equivalent to border in Tailwind
    borderRadius: 8, // Equivalent to rounded-lg in Tailwind
    paddingHorizontal: 16, // Equivalent to px-4 in Tailwind
    flexDirection: "row", // Equivalent to flex-row in Tailwind
    justifyContent: "space-between", // Equivalent to justify-between in Tailwind
    alignItems: "center", // Equivalent to items-center in Tailwind
    height: 48, // Equivalent to h-12 in Tailwind
  },
  textInput: {
    width: "90%", // Equivalent to w-[90%] in Tailwind
    color: Colors.textGray, // Equivalent to text-white in Tailwind
  },
});
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
