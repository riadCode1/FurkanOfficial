import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
<<<<<<< HEAD
import React, { useRef } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { FlashList } from "@shopify/flash-list";
import { getReciterImage } from "../constants/reciterArtwork";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../constants/Colors";
import { useScrollToTop } from "../context/ScrollToTopProvider";

const ReaderFilter = ({ reader = [] }) => {
  const { languages } = useGlobalContext();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const listRef = useRef(null);
  const handleScroll = useScrollToTop(listRef);
=======
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

const ReaderFilter = () => {
  const [reader, setReader] = useState([]);
  const [loading, setLoading] = useState(false);
  const { languages } = useGlobalContext();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

  const handleNavigate = (arab_name, name, id) => {
    router.push({
      pathname: `/ReciterSearch/`,
      params: { id, arab_name, name },
    });
  };

<<<<<<< HEAD
=======
  useEffect(() => {
    getReciter();
  }, [languages]);

  const getReciter = async () => {
    setLoading(true);
    const data = await fetchSuwar();
    if (data && data.recitations) {
      const idSet = new Set();
      const uniqueFetchedData = data.recitations.filter((reciter) => {
        if (idSet.has(reciter.id)) return false;
        idSet.add(reciter.id);
        return true;
      });
      const uniqueNewData = NewData.recitations.filter((reciter) => {
        if (idSet.has(reciter.id)) return false;
        idSet.add(reciter.id);
        return true;
      });
      const combinedData = [...uniqueFetchedData, ...uniqueNewData];
      setReader(combinedData.splice(1));
    }
    setLoading(false);
  };

>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  const dynamicPadding = isTablet ? 32 : 16;

  return (
    <View style={styles.container}>
      <FlashList
<<<<<<< HEAD
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 400 }}
=======
        contentContainerStyle={{ paddingBottom: 320 }}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        data={reader}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={75}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
<<<<<<< HEAD
              <TouchableRipple
                onPress={() =>
                  handleNavigate(
                    item?.translated_name?.name,
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
                    item?.reciter_name,
                    item?.id
                  )
                }
                rippleColor="rgba(200, 200, 200, 0.1)"
                style={[styles.playButton, { paddingHorizontal: dynamicPadding }]}
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
                        contentFit="cover"
                        style={styles.image}
                        source={{
<<<<<<< HEAD
                          uri: getReciterImage(item.id)
                            ? getReciterImage(item.id)
=======
                          uri: dataArray[item.id]?.image
                            ? dataArray[item.id]?.image
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
                            : require("../assets/images/noImage.jpg"),
                        }}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.reciterText}>
                        {item.reciter_name}
                      </Text>
<<<<<<< HEAD
                        <Text style={styles.reciterARText}>
                          {item.translated_name?.name}
=======
                      <Text style={styles.reciterARText}>
                        {item.translated_name.name}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: 45, height: 48, paddingLeft: 15 }} />
                </View>
              </TouchableRipple>
<<<<<<< HEAD
=======
            )}
          </View>
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 1,
=======
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    paddingVertical: 8,
  },
  playButton: {
    width: "100%",
<<<<<<< HEAD
    paddingVertical: 11,
    borderRadius: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169,177,188,0.12)",
=======
    paddingVertical: 12,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
<<<<<<< HEAD
    borderRadius: 15,
=======
    borderRadius: 25,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
});

export default ReaderFilter;
