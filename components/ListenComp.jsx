import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useMemo } from "react";
import Dropmenu from "./Dropmenu";
import { Image } from 'expo-image';
import { dataArray } from "../constants/RecitersImages";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import LottieView from "lottie-react-native";
import { useGlobalContext } from "../context/GlobalProvider";

const { width, height } = Dimensions.get("window");

const ListenComp = React.memo(({
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
  Chapterid,
  handleClick
}) => {
   const {
      color,
    } = useGlobalContext();

  // Memoize formatted names
  const formattedName = useMemo(() => {
    const name = languages ? arabName : reciterName;
    return name.length > 25 ? `${name.slice(0, 25)}...` : name;
  }, [languages, arabName, reciterName]);


  // Memoize image source
  const imageSource = useMemo(() => ({
    uri: dataArray[id]?.image || 
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s"
  }), [id,color]);

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => (
    <View style={color === id ? styles.Color : null}>
      <TouchableRipple
        onPress={() => {
          handleClick(id);
          handleReciterSelect(id);
        }}
        activeOpacity={0.7}
        rippleColor="rgba(200, 200, 200, 0.1)"
        style={styles.listItem}
      >
        <View style={styles.itemContent}>
          <View style={styles.buttonContent}>
            <View style={styles.imageContainer}>
              <Image
                contentFit="cover"
                style={styles.image}
                source={imageSource}
                cachePolicy="memory-disk"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.reciterName}>
                {formattedName}
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
  ), [color, id, imageSource, formattedName, languages, chapterAr, chapterName, 
      handleClick, handleReciterSelect, handleReciterDrop, arabName, reciterName, 
      Chapterid, mp3]);

  return (
    <View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../assets/images/Loading.json")}
            style={styles.lottie}
            autoPlay
            loop
            resizeMode="cover"
          />
        </View>
      ) : mainContent}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 400,
    height: 50,
    transform: [{ translateX: -90 }],
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
  },
  imageContainer: {
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 12,
    flexShrink: 1,
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
});

export default ListenComp;