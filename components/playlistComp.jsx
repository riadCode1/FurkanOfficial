import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";
import { RadioButton } from "react-native-paper";
import { router } from "expo-router";

const PlaylistComp = ({ playlist, checked, handleBanners, handleFirst }) => {
  
  console.log(playlist[0].audios)

  return (
    <View>
      {playlist.length
        ? playlist.map((item) => (
            <View
              key={item?.id?.toString()}
              style={styles.playlistItemContainer}
            >
              <TouchableOpacity
                onPress={() => {
                  handleBanners(item),
                    router.push({
                      pathname: `/PlayLists/`,
                      params: { playlist: item.audios[0] },
                    });
                }}
                style={styles.playlistItem}
              >
                <View style={styles.playlistImageContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.playlistImage}
                    source={require("../assets/images/noImage.png")}
                  />
                </View>
                <View style={styles.playlistTextContainer}>
                  <Text style={styles.playlistName}>{item.title}</Text>
                  <Text style={{ color: Colors.textGray }}>
                    {item?.audios[0]?.name?.length > 0
                      ? `${item?.audios[0]?.name[1].length} audio`
                      : "0 audio"}
                  </Text>
                </View>
              </TouchableOpacity>
              <RadioButton
                value="first"
                status={checked === "first" ? "checked" : "unchecked"}
                onPress={handleFirst}
                uncheckedColor="#00D1FF"
                color="#00D1FF"
                theme={"primary"}
              />
            </View>
          ))
        : ""}
    </View>
  );
};

const styles = StyleSheet.create({
  customRadius: {
    width: "45%",
    height: 48,
    borderRadius: 10,
    borderColor: Colors.tintLight,
    backgroundColor: Colors.tintLight,
  },
  customRadius2: {
    width: "49%",
    borderRadius: 10,
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
  },
  filterText: {
    color: Colors.textGray,
    fontSize: 16,
  },
  playlistItemContainer: {
    flexDirection: "row",
    width: "99%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playlistImageContainer: {
    width: 48,
    height: 48,
  },
  playlistImage: {
    height: "100%",
    width: "100%",
  },
  playlistTextContainer: {
    marginTop: 4,
  },
  playlistName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default PlaylistComp;
