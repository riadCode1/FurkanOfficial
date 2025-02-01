import {
  View,
  Text,
 
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import Dropmenu from "./Dropmenu";
import { Image } from 'expo-image';
import { dataArray } from "../constants/RecitersImages";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";

import LottieView from "lottie-react-native";


let { width, height } = Dimensions.get("window");
const ListenComp = React.memo(
  ({
    languages,
    loading,
    handleReciterSelect,
    id,
    mp3,
    handleReciterDrop,
    arabName,
    reciterName,
    chapterName,
    chapterAr,
    color2,
    
    Chapterid,
    handleClick
  }) => {
    

   
    return (
      <View>
        {loading ? (
          <View>
            <LottieView
              source={require("../assets/images/Loading.json")}
              style={{ right: 90, width: 400, height: 50 }}
              autoPlay
              loop
            />
          </View>
        ) : (
          <View style={[color2 === id ? styles.Color : null]}>
            <TouchableRipple
              onPress={() => {
                handleClick(id);
                handleReciterSelect();
              }}
              activeOpacity={0.7}
              rippleColor="rgba(200, 200, 200, 0.1)"
              style={[styles.listItem]}
            >
              <View style={[styles.itemContent]}>
                <View style={styles.buttonContent}>
                  <View style={styles.imageContainer}>
                    <Image
                      contentFit="cover"
                      style={styles.image}
                      source={{
                        uri: dataArray[id]?.image
                          ? dataArray[id]?.image
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
                      }}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text className="text-red-500" style={styles.reciterName}>
                      {languages
                        ? arabName.length > 25
                          ? arabName.slice(0, 25) + "..."
                          : arabName
                        : reciterName.length > 25
                        ? reciterName.slice(0, 25) + "..."
                        : reciterName}
                    </Text>
                    <Text numberOfLines={1} style={styles.chapterName}>
                      {languages ? chapterAr : chapterName}
                    </Text>
                  </View>
                </View>

                <View style={styles.menuContainer}>
                  <Dropmenu
                    handleReciterDrop={handleReciterDrop}
                    chapter={chapterName}
                    reciterName={reciterName}
                    reciterID={id}
                    arabName={arabName}
                    chapterAr={chapterAr}
                    chapteID={Chapterid}
                    mp3={mp3}
                  />
                </View>
              </View>
            </TouchableRipple>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
 
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingVertical: 8,
  },
  itemContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  Color: {
    backgroundColor: Colors.tint,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    position: "absolute",
    bottom: height * 0.25,
    right: 20,
    backgroundColor: Colors.tint,
    borderRadius: 25,
    padding: 15,
    elevation: 5,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 12,
    
  },
  reciterName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  chapterName: {
    color: Colors.textGray,
    fontSize: 12,
  },
  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  centeredView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.background,
  },
});
export default ListenComp;
