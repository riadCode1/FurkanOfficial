import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../../../constants/Colors";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Button } from "react-native-paper";

const PlayLists = () => {
  const params = useLocalSearchParams();
  const { playlist } = params;
 

  const { pauseAudio, isPlaying } = useGlobalContext();

  return (
    <View style={styles.safeAreaView}>
      <StatusBar backgroundColor="transparent" />
      <ImageBackground
        resizeMode="cover"
        source={require("../../../assets/images/Frameplaylist.png")}
        style={styles.TopButtons}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.navigate("Index")}
            style={styles.TopButton}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.navigate("Index")}
            style={styles.TopButton}
          >
            <Entypo name="plus" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.navigate("Index")}
            style={styles.TopButton}
          >
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <View>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>
              {playlist}
            </Text>
            <Text style={{ color: Colors.text }}>0 tacks</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="shuffle" size={24} color="#00D1FF" />
            </TouchableOpacity>

            {isPlaying ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={pauseAudio}
                style={styles.TopButton}
              >
                <FontAwesome5 name="pause" size={20} color="#00D1FF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={"playAuto"}
                style={styles.TopButton}
              >
                <Entypo name="controller-play" size={24} color="#00D1FF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>

      {playlist ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={playlist}
          estimatedItemSize={50}
          renderItem={({ item }) => (
            <View>
              <Text style={{ color: Colors.text }}>{item.name}</Text>
            </View>
          )}
        />
      ) : (
        <View style={{ width: "99.99%", marginTop: 70 }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text style={{ color: "white", fontSize: 20, marginBottom: 8 }}>
              This Playlist is empty
            </Text>
            <Text
              style={{
                width: "70%",
                textAlign: "center",
                color: Colors.textGray,
                fontSize: 16,
              }}
            >
              add to it your favourite chapters and start listening
            </Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Button
              mode="outlined"
              textColor="white"
              onPress={""}
              style={styles.customRadius}
            >
              Add chapters
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    paddingBottom: 100,
  },

  headerImage: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  TopButtons: {
    height: 264,

    paddingHorizontal: 16,
    paddingVertical: "15%",
  },
  TopButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    backgroundColor: Colors.tint,
  },
  bottomButtons: {
    top: 113,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  customRadius: {
    width: "90%",
    height: 48,
    marginBottom: 16,
    borderRadius: 50,
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
  },
});

export default PlayLists;
