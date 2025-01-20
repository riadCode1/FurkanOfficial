import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";


const ChapterSurah = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className=" border-b-[1px] border-[#99A5FF] mb-4 ml-4  flex-row items-center justify-between"
    >
      <View className="flex-row  ">
        <View className=" h-16 w-16 mb-4 ">
          <Image
            className="w-full h-full "
            resizeMode="contain"
            source={require("../assets/images/surah.png")}
          />
        </View>
        <View className="ml-3 mt-2">
          <Text
            numberOfLines={1}
            className="  text-[#000C61]  text-xs font-bold "
          >
            El-Kahf
          </Text>
          <Text className="text-xs text-gray-400 font-medium">
            Makia-verse: 6-juz:1
          </Text>
        </View>
      </View>

      <View className=" mr-5">
        <Text className="text-2xl text-[#000C61] ">الكهف</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChapterSurah;
