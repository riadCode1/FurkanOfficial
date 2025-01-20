import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const Readerplay = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push("ReaderSurah")}
      className=" border-b-[1px] border-[#99A5FF] mb-4   flex-row items-center justify-between"
    >
      <View className="flex-row  items-center">
        <View className="border border-[#00D1FF] overflow-hidden rounded-full h-16 w-16 mb-4 mr-10">
          <ImageBackground
            className="w-full h-full overflow-hidden"
            source={require("../assets/images/reader.png")}
          ></ImageBackground>
        </View>
        <Text
          numberOfLines={1}
          className="  text-[#000C61]  text-xs font-bold "
        >
          Abdulbaset abd assamed
        </Text>
      </View>

      <TouchableOpacity className=" mr-5">
        <AntDesign name="playcircleo" size={24} color="#00D1FF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default Readerplay;
