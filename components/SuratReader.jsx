import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import React, { memo, useMemo } from "react";
import Dropmenu from "./Dropmenu";
import { getReciterImage } from "../constants/reciterArtwork";
import { Colors } from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { isTrackSelected } from "../constants/trackSelection";
import { useGlobalContext } from "../context/GlobalProvider";

const SuratReader = memo(({
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
  const { color: activeReciterId, color2: activeChapterId } = useGlobalContext();

  const isLargeScreen = width >= 768;
  const isCurrentTrack = isTrackSelected(activeReciterId, activeChapterId, id, chapteID);

  const handlePlay = () => {
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

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    selectedPlayButton: {
      backgroundColor: Colors.barbottom,
      borderLeftWidth: 3,
      borderLeftColor: Colors.blue,
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
      marginEnd: 8,
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
  }), [isLargeScreen]);

  return (
    <View>
        <View
          style={[
            dynamicStyles.container,
          ]}
        >
          <TouchableRipple
            accessibilityRole="button"
            accessibilityLabel={`Play ${chapterName} recitation by ${reciterName}`}
            onPress={handlePlay}
            rippleColor="rgba(200, 200, 200, 0.1)"
            style={[
              dynamicStyles.playButton,
              isCurrentTrack && dynamicStyles.selectedPlayButton,
            ]}
          >
            <View style={dynamicStyles.buttonContent}>
              <View style={{ flexDirection: "row" }}>
                <View style={dynamicStyles.imageContainer}>
                  <Image
                    contentFit="cover"
                    style={dynamicStyles.image}
                    source={{
                      uri: getReciterImage(id) || "",
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
    </View>
  );
});

SuratReader.displayName = "SuratReader";

export default SuratReader;
