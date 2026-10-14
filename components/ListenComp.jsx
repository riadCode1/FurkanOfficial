import React, { useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Dropmenu from "./Dropmenu";
import { Image } from "expo-image";
import { getReciterImage } from "../constants/reciterArtwork";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useGlobalContext } from "../context/GlobalProvider";
import { isTrackSelected } from "../constants/trackSelection";

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
    showTrackSelection,
  }) => {
    const { color, color2 } = useGlobalContext();
    const { width } = useWindowDimensions();
    const isSelected = showTrackSelection && isTrackSelected(color, color2, id, Chapterid);

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
          getReciterImage(id) ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCTMhnLo43ZCkuSoHwfvO8sj3nLMJLU9_EA&s",
      }),
      [id]
    );

    // Memoize the main content to prevent unnecessary re-renders
    const mainContent = useMemo(
      () => (
        <View style={isSelected ? styles.activeColor : null}>
          <TouchableRipple
            onPress={() => {
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
        isSelected,
        id,
        imageSource,
        formattedName,
        languages,
        chapterAr,
        chapterName,
        handleReciterSelect,
        index,
        handleReciterDrop,
        arabName,
        reciterName,
        Chapterid,
        mp3,
        isLargeScreen,
      ]
    );

    return <View>{mainContent}</View>;
  }
);

ListenComp.displayName = "ListenComp";

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
    marginStart: 12,
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
