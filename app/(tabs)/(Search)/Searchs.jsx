import {
  View,
  Text,
  Platform,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import StyleSheet from "react-native-media-query";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import { router, useLocalSearchParams } from "expo-router";
import { dataArray } from "@/constants/RecitersImages";
import { NewData } from "../../../constants/NewData";
import { Button, TouchableRipple } from "react-native-paper";
import { Colors } from "../../../constants/Colors";
import { StatusBar } from "react-native";
import ChapterFilter from "../../../components/ChapterFilter";
import ReaderFilter from "../../../components/ReaderFilter";
import { useGlobalContext } from "../../../context/GlobalProvider";
import SearchBar from "../../../components/SearchBar";


let { width, height } = Dimensions.get("window");

const Search = () => {
  const { section } = useLocalSearchParams();  // ✅ GET PARAM FROM URL
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setloading] = useState(false);
  const { languages } = useGlobalContext();

  const [activeButton, setActiveButton] = useState("reciters");  // ✅ Default state

  useEffect(() => {
    if (section) {
      setActiveButton(section);  // ✅ SET TAB FROM PARAM
    }
  }, [section]);

  const handleButtonPress = (button) => {
    setActiveButton(button);
  };

  const getBackgroundColor = (button) => {
    return activeButton === button ? Colors.barbottom : "#222333";
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      setloading(true);

      Promise.all([fetchChater(searchQuery), fetchSuwar(searchQuery)])
        .then(([chapterData, suwarData]) => {
          const filteredChapters = chapterData.chapters.filter(
            (item) =>
              item.name_simple
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.name_arabic
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

          const combinedRecitations = [
            ...suwarData.recitations,
            ...NewData.recitations,
          ];

          const filteredRecitations = combinedRecitations.filter(
            (item) =>
              item.reciter_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (item.translated_name.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) &&
                item.id !== 8 &&
                item.status !== "inactive")
          );

          setFilteredData([...filteredChapters, ...filteredRecitations]);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
        .finally(() => {
          setloading(false);
        });
    }
  }, [searchQuery]);

  const handlePress = (item) => {
    if (item.name_simple) {
      router.push({
        pathname: `/ReadersSearch/`,
        params: {
          Chapterid: item.id,
          chapter_arab: item.name_arabic,
          name: item.name_simple,
        },
      });
    } else if (item.reciter_name) {
      router.push({
        pathname: `/ReciterSearch/`,
        params: {
          id: item.id,
          name: item.reciter_name,
          arab_name: item.translated_name.name,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredData={filteredData}
        title={
          languages
            ? "ابحث عن السورة أو القارئ..."
            : " Search Chapter or Reciter..."
        }
      />

      {searchQuery.length > 1 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            Results: {filteredData?.length}
          </Text>

          <FlatList
            contentContainerStyle={styles.flatlistContainer}
            keyExtractor={(item) => item.id.toString()}
            data={filteredData}
            renderItem={({ item }) => (
              <TouchableRipple
                activeOpacity={1}
                rippleColor="rgba(200, 200, 200, 0.1)"
                onPress={() => handlePress(item)}
                style={styles.touchable}
              >
                <View style={{ flexDirection: "row", width: "100%", gap: 20 }}>
                  <View style={styles.imageContainer}>
                    {item.name_simple ? (
                      <Image
                        contentFit="contain"
                        style={styles.image}
                        source={require("../../../assets/images/quranLogo.jpeg")}
                      />
                    ) : (
                      <Image
                        contentFit="contain"
                        style={styles.image}
                        source={{
                          uri: dataArray[item.id]?.image
                            ? dataArray[item.id]?.image
                            : dataArray[11]?.image,
                        }}
                      />
                    )}
                  </View>

                  <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.nameText}>
                      {item.name_simple}
                      {item?.reciter_name?.length > 25
                        ? item.reciter_name.slice(0, 30) + "..."
                        : item.reciter_name}
                    </Text>

                    <Text style={styles.arabicText}>
                      {item.name_arabic || item.translated_name.name}
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <View style={styles.filters}>
            <Button
              mode="contained"
              onPress={() => handleButtonPress("reciters")}  // ✅ Simplified button name
              contentStyle={[
                { backgroundColor: getBackgroundColor("reciters") },
                styles.filter,
              ]}
            >
              <Text
                style={[
                  { color: activeButton === "reciters" ? "white" : "#A3A8C5" },
                ]}
              >
                {languages ? "قراء" : "Reciters"}
              </Text>
            </Button>

            <Button
              mode="contained"
              onPress={() => handleButtonPress("chapters")}  // ✅ Simplified button name
              contentStyle={[
                { backgroundColor: getBackgroundColor("chapters") },
                styles.filter,
              ]}
            >
              <Text
                style={[
                  { color: activeButton === "chapters" ? "white" : "#A3A8C5" },
                ]}
              >
                {languages ? "سور" : "Chapters"}
              </Text>
            </Button>
          </View>

          {activeButton === "reciters" && <ReaderFilter />}
          {activeButton === "chapters" && <ChapterFilter />}
        </View>
      )}
    </SafeAreaView>
  );
};

const { styles } = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: Colors.background,
  },
  resultsContainer: {
    marginTop: 16,
    borderRadius: 8,
  },
  filters: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    "@media (min-width: 768px)": {
      paddingHorizontal: 32,
    },
  },
  filter: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.43,
    borderRadius: 70,
  },
  resultsText: {
    color: "white",
    marginLeft: 16,
  },
  flatlistContainer: {
    paddingBottom: 200,
  },
  touchable: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    paddingHorizontal: 16,
    "@media (min-width: 768px)": {
      paddingHorizontal: 32,
    },
  },
  imageContainer: {
    borderColor: "#00BCE5",
    borderWidth: 1,
    borderRadius: 25,
    width: 50,
    height: 50,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  textContainer: {
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  arabicText: {
    fontSize: 14,
    color: "white",
    textAlign: "left",
  },
});

export default Search;
