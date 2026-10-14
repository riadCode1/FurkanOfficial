import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
<<<<<<< HEAD
import React, { memo, useMemo } from "react";
import Dropmenu from "./Dropmenu";
import { getReciterImage } from "../constants/reciterArtwork";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { isTrackSelected } from "../constants/trackSelection";
import { useGlobalContext } from "../context/GlobalProvider";

const SuratReader = memo(({
=======
import React from "react";
import Dropmenu from "./Dropmenu";
import { dataArray } from "@/constants/RecitersImages";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useGlobalContext } from "../context/GlobalProvider";

const SuratReader = ({
  color,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  languages,
  chapterName,
  chapterAr,
  reciterName,
  arab_name,
  index,
  dataAudio,
  chapteID,
  id,
  playAudio,
  data,
}) => {
  const { width } = useWindowDimensions();
<<<<<<< HEAD
  const { color: activeReciterId, color2: activeChapterId } = useGlobalContext();

  const isLargeScreen = width >= 768;
  const isCurrentTrack = isTrackSelected(activeReciterId, activeChapterId, id, chapteID);

  const handlePlay = () => {
=======
  const { loading } = useGlobalContext();

  const isLargeScreen = width >= 768;

  const handlePlay = () => {
    console.log("11", chapteID);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    playAudio(
      dataAudio[chapteID - 1]?.audio_url,
      chapteID,
      chapterName,
      reciterName,
      arab_name,
      id,
      chapterAr,
      index
    );
  };

<<<<<<< HEAD
  const dynamicStyles = useMemo(() => StyleSheet.create({
=======
  const dynamicStyles = StyleSheet.create({
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
<<<<<<< HEAD
    selectedPlayButton: {
      backgroundColor: Colors.barbottom,
      borderLeftWidth: 3,
      borderLeftColor: Colors.blue,
=======
    Color: {
      backgroundColor: Colors.barbottom,
      height: 75,
    },
    lottie: {
      right: isLargeScreen ? 270 : 70,
      width: "100%",
      height: 50,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    },
    playButton: {
      width: "100%",
      height: 75,
      overflow: "hidden",
      alignContent: "center",
      justifyContent: "center",
      paddingHorizontal: isLargeScreen ? 32 : 16,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    imageContainer: {
      overflow: "hidden",
      borderColor: "#00BCE5",
      borderWidth: 1,
<<<<<<< HEAD
      marginEnd: 8,
=======
      marginRight: 8,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    image: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    textContainer: {
      alignItems: "flex-start",
    },
    chapterText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    reciterText: {
      color: Colors.textGray,
      fontSize: 12,
    },
    menuContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
<<<<<<< HEAD
  }), [isLargeScreen]);

  return (
    <View>
        <View
          style={[
=======
  });

  return (
    <View>
      {loading ? (
        <View style={dynamicStyles.lottie}>
          <LottieView
            source={require("../assets/images/Loading.json")}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
          />
        </View>
      ) : (
        <View
          style={[
            color === chapteID && dynamicStyles.Color,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
            dynamicStyles.container,
          ]}
        >
          <TouchableRipple
<<<<<<< HEAD
            accessibilityRole="button"
            accessibilityLabel={`Play ${chapterName} recitation by ${reciterName}`}
            onPress={handlePlay}
            rippleColor="rgba(200, 200, 200, 0.1)"
            style={[
              dynamicStyles.playButton,
              isCurrentTrack && dynamicStyles.selectedPlayButton,
            ]}
=======
            onPress={handlePlay}
            rippleColor="rgba(200, 200, 200, 0.1)"
            style={dynamicStyles.playButton}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          >
            <View style={dynamicStyles.buttonContent}>
              <View style={{ flexDirection: "row" }}>
                <View style={dynamicStyles.imageContainer}>
                  <Image
                    contentFit="cover"
                    style={dynamicStyles.image}
                    source={{
<<<<<<< HEAD
                      uri: getReciterImage(id) || "",
=======
                      uri: dataArray[id]?.image ? dataArray[id]?.image : "",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
                    }}
                  />
                </View>

                <View style={dynamicStyles.textContainer}>
                  <Text style={dynamicStyles.chapterText}>
                    {languages ? chapterAr : chapterName}
                  </Text>

                  <Text style={dynamicStyles.reciterText}>
                    {languages ? arab_name : reciterName}
                  </Text>
                </View>
              </View>

              <Dropmenu
                chapter={chapterName}
                reciterName={reciterName}
                reciterID={id}
                arabName={arab_name}
                chapterAr={chapterAr}
                data={data}
                chapteID={chapteID}
                handlePlay={handlePlay}
                mp3={dataAudio[chapteID - 1]?.audio_url}
              />
            </View>
          </TouchableRipple>
        </View>
<<<<<<< HEAD
    </View>
  );
});

SuratReader.displayName = "SuratReader";
=======
      )}
    </View>
  );
};
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

export default SuratReader;
