import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { Image } from 'expo-image';
import React, { useEffect, useState } from "react";
import { fetchSuwar } from "../app/API/QuranApi";
import { useGlobalContext } from "../context/GlobalProvider";
import { FlashList } from "@shopify/flash-list";
import { NewData } from "../constants/NewData";
import { dataArray } from "../constants/RecitersImages";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import LottieView from "lottie-react-native";
import { Colors } from "../constants/Colors";

let { width, height } = Dimensions.get("window");
const ReaderFilter = () => {
  const [reader, setReader] = useState([]);
  const [loading, setLoading] = useState(true);

  const { languages } = useGlobalContext();

  const handleNavigate = (arab_name, name, id) => {
    router.push({ pathname: `/ReciterSearch/`, params: {id , arab_name, name, } });
  };

  useEffect(() => {
    getReciter();
  }, [languages]);

  const getReciter = async () => {
    setLoading(true);
    const data = await fetchSuwar();

    // Example of hardcoded data (NewData)

    if (data && data.recitations) {
      const idSet = new Set();

      const uniqueFetchedData = data.recitations.filter((reciter) => {
        if (idSet.has(reciter.id)) {
          return false;
        }
        idSet.add(reciter.id);
        return true;
      });

      const uniqueNewData = NewData.recitations.filter((reciter) => {
        if (idSet.has(reciter.id)) {
          return false;
        }
        idSet.add(reciter.id);
        setLoading(false);
        return true;
      });

      const combinedData = [...uniqueFetchedData, ...uniqueNewData];
      setReader(combinedData.splice(1));
      
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        contentContainerStyle={{ paddingBottom: 450 }}
        data={reader}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={75}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            {loading ? (
              <View>
                <LottieView
                  source={require("../assets/images/Loading.json")}
                  style={{ right: 70, width: 400, height: 50 }}
                  autoPlay
                  loop
                />
              </View>
            ) : (
              <TouchableRipple
                onPress={() =>
                  handleNavigate(
                    item?.translated_name.name,
                    item?.reciter_name,
                    item?.id
                  )
                }
                rippleColor="rgba(200, 200, 200, 0.1)"
                style={styles.playButton}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={styles.imageContainer}>
                      <Image
                        contentFit="contain"
                        style={styles.image}
                        source={{
                          uri: dataArray[item.id]?.image
                            ? dataArray[item.id]?.image
                            : dataArray[11]?.image,
                        }}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.reciterText}>
                        {item.reciter_name}
                      </Text>
                      <Text style={styles.reciterARText}>
                        {item.translated_name.name}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: 45, height: 48, paddingLeft: 15 }}>
                    {/* <Dropmenu /> */}
                  </View>
                </View>
              </TouchableRipple>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  playButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    overflow: "hidden",
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  reciterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  reciterARText: {
    color: Colors.textGray,
    fontWeight: "bold",
    fontSize: 16,
  },


  menuContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuIconContainer: {},
});

export default ReaderFilter;
