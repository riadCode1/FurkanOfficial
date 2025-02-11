import { View, TextInput, Animated, Platform, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";

const Ios = Platform.OS == "ios";
let { width } = Dimensions.get("window");

const SearchBar = ({ title, setSearchQuery, searchQuery }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { languages } = useGlobalContext();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedView,
          {
            borderColor: isFocused ? Colors.blue : "transparent",
            backgroundColor: Colors.backgroundTint,
            width: width * 0.93,
          },
        ]}
      >
        <TextInput
          placeholder={title}
          placeholderTextColor={Colors.textGray}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            { textAlign: languages ? "right" : "left" },
          ]}
        />

        {searchQuery?.length > 1 ? (
          <Entypo
            onPress={() => setSearchQuery("")}
            name="circle-with-cross"
            size={24}
            color={Colors.textGray}
          />
        ) : (
          <Feather
            name="search"
            size={24}
            strokeWidth={2}
            color={Colors.textGray}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8, // Equivalent to pt-2 in Tailwind
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