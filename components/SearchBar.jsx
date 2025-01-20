import {
  View,
  Text,
  TextInput,
  Animated,
  Platform,
  Dimensions,
  StyleSheet,
  I18nManager
} from "react-native";
import React, { useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../context/GlobalProvider";

const Ios = Platform.OS == "ios";
let { width, height } = Dimensions.get("window");


const SearchBar = ({ title, setSearchQuery, searchQuery }) => {

  const [isFocused, setIsFocused] = useState(false);
  const {languages, } = useGlobalContext();
  


   
  return (
    <View style={{paddingTop:2}}>
      <Animated.View  style={[styles.searchBarContainer, { borderColor: isFocused ? "#00D1FF" : "" }, // Dynamic border color
      ]}>
        <TextInput
          placeholder={` ${title}`}
          placeholderTextColor={Colors.textGray}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          onFocus={()=> setIsFocused(true)}
          onBlur={()=>setIsFocused(false)}
          
          
          style={languages? styles.right: styles.textInput}
          
        />
        
        {searchQuery?.length > 1 ? <Entypo  onPress={()=>setSearchQuery("")} name="circle-with-cross" size={24}  color={Colors.textGray} />
        
        : <Feather
          name="search"
          
          size={24}
          strokeWidth={2}
          color={Colors.textGray}
        />}

      
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: width * 0.93,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.rgb,
    height: 48,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },
  textInput: {
    width: width * 0.7,
    color:"white",
  },
  right:{
    width: width * 0.7,
    color:"white",
    textAlign:"right"
  }
});

export default SearchBar;
