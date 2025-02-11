import {
  View,
  Text,
  Platform,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Image } from 'expo-image';
import React, { useEffect, useState } from "react";


import { fetchChater, fetchSuwar } from "../../API/QuranApi";

import { router } from "expo-router";
import { dataArray } from "@/constants/RecitersImages";
import { NewData } from "../../../constants/NewData";
import { Button, TouchableRipple } from "react-native-paper";
import { Colors } from "../../../constants/Colors";
import { StatusBar } from "react-native";
import ChapterFilter from "../../../components/ChapterFilter";
import ReaderFilter from "../../../components/ReaderFilter";
import { useGlobalContext } from "../../../context/GlobalProvider";
import SearchBar from "../../../components/SearchBar";

const Ios = Platform.OS == "ios";
let { width, height } = Dimensions.get("window");

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setloading] = useState(false);
  const [activeButton, setActiveButton] = useState("button1");

  const { languages } = useGlobalContext();

  const handleButtonPress = (button) => {
    setActiveButton(button);
  };
  const getBackgroundColor = (button) => {
    return activeButton === button ? Colors.tint : Colors.rgb;
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      setloading(true);

      // Fetch both chapters and recitations at the same time
      Promise.all([fetchChater(searchQuery), fetchSuwar(searchQuery)])
        .then(([chapterData, suwarData]) => {
          // Filter chapters
          const filteredChapters = chapterData.chapters.filter(
            (item) =>
              item.name_simple
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.name_arabic
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

          // Filter recitations
          const combinedRecitations = [
            ...suwarData.recitations,
            ...NewData.recitations,
          ]; // Combine API data with hardcoded data

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

          // Combine results from both into filteredData
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
        pathname: `/Readers/`,
        params: {
          Chapterid: item.id,
          chapter_arab: item.name_arabic,
          name: item.name_simple,
        },
      });
      console.log("Moratilii", item);
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
        title={languages?"ابحث عن السورة أو القارئ...":" Search Chapter or Reciter..."}
      />

      {/* results */}
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
                rippleColor="rgba(53, 53, 151, 0.5)"
                onPress={() => handlePress(item)}
                style={styles.touchable}
              >
                <View style={{ flexDirection: "row", width: "100%", gap: 20 }}>
                  <View style={styles.imageContainer}>
                    {item.name_simple ? (
                      <Image
                        contentFit="contain"
                        style={styles.image}
                        source={require("../../../assets/images/quranLogo.png")}
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
        <View style={{width:"100%"}}>
          <View style={styles.filters}>
            <Button
              mode="contained" // Use "outlined" or "text" for other styles
              onPress={() => handleButtonPress("button1")}
              contentStyle={[
                
                { backgroundColor: getBackgroundColor("button1") },
                styles.filter,
                
              ]}
            >
              <Text  style={[  { color: activeButton=== "button1"? "white":"#A3A8C5" }]}>{languages ? "قراء" : "Readers"}</Text>
              
            </Button>

            <Button
              mode="contained" // Use "outlined" or "text" for other styles
              onPress={() => handleButtonPress("button2")}
              contentStyle={[
                { backgroundColor: getBackgroundColor("button2") },
                styles.filter,
              ]}
            >
              <Text  style={[  { color: activeButton=== "button2"? "white":"#A3A8C5" }]}>
                {languages ? "سور" : "Chapters"}
              </Text>
              
            </Button>
          </View>

          {activeButton === "button1" && <ReaderFilter />}
          {activeButton === "button2" && <ChapterFilter />}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  filter: {
    alignItems: "center",
    justifyContent: "center",

    width: width * 0.43,

    borderRadius: 70,
  },
  filterText: {
    color: Colors.textGray,
    fontSize: 16,
  },
  resultsText: {
    color: "white",
    marginLeft: 16,
  },
  flatlistContainer: {
    paddingBottom: 200,
  },
  resultItemContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  touchable: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    height: 65,
    width: 400,
    paddingHorizontal: 16,
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
    justifyContent: "flex-start",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  arabicText: {
    fontSize: 14,
    color: "white",
  },
  dropmenuContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  card: {
    width: width * 0.45,
    height: 104,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  linearGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 8,
  },
  cardText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
  },
});

export default Search;
