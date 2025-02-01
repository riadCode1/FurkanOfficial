import { View, TextInput, Animated, Platform, Dimensions } from "react-native";
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
    <View className="pt-2">
      <Animated.View
        className={`border ${
          isFocused ? "border-cyan-400" : "border-transparent"
        } rounded-lg px-4  flex flex-row justify-between items-center`}
        style={{height:48, width: width * 0.93,backgroundColor: Colors.backgroundTint }}
      >
        <TextInput
          placeholder={title}
          placeholderTextColor={Colors.textGray}
          
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-[90%] text-white ${
            languages ? "text-right" : "text-left"
          }`}
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
