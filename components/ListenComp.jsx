import React, { useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Dropmenu from "./Dropmenu";
import { Image } from "expo-image";
<<<<<<< HEAD
import { getReciterImage } from "../constants/reciterArtwork";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { isTrackSelected } from "../constants/trackSelection";
=======
import { dataArray } from "../constants/RecitersImages";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import LottieView from "lottie-react-native";
import { useGlobalContext } from "../context/GlobalProvider";
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

const ListenComp = React.memo(
  ({
    languages,
    handleReciterSelect,
    id,
    mp3,
    handleReciterDrop,
    arabName,
    reciterName,
    chapterName,
    chapterAr,
    Chapterid,
    index,
<<<<<<< HEAD
    showTrackSelection,
  }) => {
    const { color, color2 } = useGlobalContext();
    const { width } = useWindowDimensions();
    const isSelected = showTrackSelection && isTrackSelected(color, color2, id, Chapterid);
=======
    handleClick,
  }) => {
    const { color, loading } = useGlobalContext();
    const { width } = useWindowDimensions();
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

    // Adjust layout dynamically
    const isLargeScreen = width > 768;

    // Memoize formatted names
    const formattedName = useMemo(() => {
      const name = languages ? arabName : reciterName;
      return name.length > 25 ? `${name.slice(0, 20)}...` : name;
    }, [languages, arabName, reciterName]);

    // Memoize image source
    const imageSource = useMemo(
      () => ({
        uri:
<<<<<<< HEAD
          getReciterImage(id) ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
      }),
      [id]
=======
          dataArray[id]?.image ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
      }),
      [id, color]
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    );

    // Memoize the main content to prevent unnecessary re-renders
    const mainContent = useMemo(
      () => (
<<<<<<< HEAD
        <View style={isSelected ? styles.activeColor : null}>
          <TouchableRipple
            onPress={() => {
=======
        <View style={color === id ? styles.activeColor : null}>
          <TouchableRipple
            onPress={() => {
              handleClick(id);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
              handleReciterSelect(id, index);
            }}
            activeOpacity={0.7}
            rippleColor="rgba(200, 200, 200, 0.1)"
            style={[
              styles.listItem,
              {
                paddingHorizontal: isLargeScreen ? 32 : 16,
              },
            ]}
          >
            <View style={styles.itemContent}>
              <View style={styles.buttonContent}>
                <View style={styles.imageContainer}>
                  <Image
                    contentFit="cover"
                    style={styles.image}
                    source={imageSource || require("../assets/images/noImage.jpg")}
                    cachePolicy="memory-disk"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.reciterName}>{formattedName}</Text>
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
      ),
      [
<<<<<<< HEAD
        isSelected,
=======
        color,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        id,
        imageSource,
        formattedName,
        languages,
        chapterAr,
        chapterName,
<<<<<<< HEAD
        handleReciterSelect,
        index,
=======
        handleClick,
        handleReciterSelect,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        handleReciterDrop,
        arabName,
        reciterName,
        Chapterid,
        mp3,
        isLargeScreen,
      ]
    );

<<<<<<< HEAD
    return <View>{mainContent}</View>;
  }
);

ListenComp.displayName = "ListenComp";

=======
    return (
      <View>
        {loading ? (
          <View
            style={[
              styles.lottie,
              {
                right: isLargeScreen ? 270 : 70,
              },
            ]}
          >
            <LottieView
              source={require("../assets/images/Loading.json")}
              style={{ width: "100%", height: "100%" }}
              autoPlay
              loop
            />
          </View>
        ) : (
          mainContent
        )}
      </View>
    );
  }
);

>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
<<<<<<< HEAD
=======
  lottie: {
    width: "100%",
    height: 50,
  },
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 75,
    justifyContent: "center",
    paddingVertical: 8,
  },
  itemContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  activeColor: {
    backgroundColor: Colors.barbottom,
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
<<<<<<< HEAD
    marginStart: 12,
=======
    marginLeft: 12,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
    marginTop: 10,
  },
};

export default ListenComp;
