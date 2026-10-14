import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
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

  const handleNavigate = (arab_name, name, id) => {
    router.push({
      pathname: `/ReciterSearch/`,
      params: { id, arab_name, name },
    });
  };

  const dynamicPadding = isTablet ? 32 : 16;

  return (
    <View style={styles.container}>
      <FlashList
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 400 }}
        data={reader}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={75}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
              <TouchableRipple
                onPress={() =>
                  handleNavigate(
                    item?.translated_name?.name,
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
                          uri: getReciterImage(item.id)
                            ? getReciterImage(item.id)
                            : require("../assets/images/noImage.jpg"),
                        }}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.reciterText}>
                        {item.reciter_name}
                      </Text>
                        <Text style={styles.reciterARText}>
                          {item.translated_name?.name}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: 45, height: 48, paddingLeft: 15 }} />
                </View>
              </TouchableRipple>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  playButton: {
    width: "100%",
    paddingVertical: 11,
    borderRadius: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(169,177,188,0.12)",
  },
  imageContainer: {
    overflow: "hidden",
    borderColor: "#00BCE5",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 15,
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
