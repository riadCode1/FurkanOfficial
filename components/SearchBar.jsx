import { View, TextInput, useWindowDimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";

const SearchBar = ({ title, setSearchQuery, searchQuery }) => {
  const { width } = useWindowDimensions();
  const [isFocused, setIsFocused] = useState(false);
  const { languages } = useGlobalContext();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchField,
          {
            borderColor: isFocused
              ? "rgba(70, 131, 207, 0.65)"
              : "rgba(70, 131, 207, 0.22)",
            width: width * 0.93,
          },
        ]}
      >
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
            color="#91a9ce"
          />
        ) : null}
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
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
