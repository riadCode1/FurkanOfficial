import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import React from "react";
import Dropmenu from "./Dropmenu";
import { dataArray } from "@/constants/RecitersImages";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useGlobalContext } from "../context/GlobalProvider";

const SuratReader = ({
  color,
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
  const { loading } = useGlobalContext();

  const isLargeScreen = width >= 768;

  const handlePlay = () => {
    console.log("11", chapteID);
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

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    Color: {
      backgroundColor: Colors.barbottom,
      height: 75,
    },
    lottie: {
      right: isLargeScreen ? 270 : 70,
      width: "100%",
      height: 50,
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
      marginRight: 8,
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
            dynamicStyles.container,
          ]}
        >
          <TouchableRipple
            onPress={handlePlay}
            rippleColor="rgba(200, 200, 200, 0.1)"
            style={dynamicStyles.playButton}
          >
            <View style={dynamicStyles.buttonContent}>
              <View style={{ flexDirection: "row" }}>
                <View style={dynamicStyles.imageContainer}>
                  <Image
                    contentFit="cover"
                    style={dynamicStyles.image}
                    source={{
                      uri: dataArray[id]?.image ? dataArray[id]?.image : "",
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
      )}
    </View>
  );
};

export default SuratReader;
