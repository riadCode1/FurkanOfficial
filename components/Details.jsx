import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import StyleSheet from "react-native-media-query";
import { useGlobalContext } from "../context/GlobalProvider";
import RenderHTML from "react-native-render-html";
let { width, height } = Dimensions.get("window");

const Details = ({ info, id }) => {
  const [surahs, setSurahs] = useState([]);
  const { languages } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const API_URL = `http://api.quran-tafseer.com/tafseer/4/${id}/1/`; // Removed extra space

    const getSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setSurahs(data);
      } catch (error) {
        console.error("Error fetching Quran data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSurahs();
  }, [id]);

  return (
    <View style={styles.container}>
      {languages ? (
        <Text style={styles.title}>تفاصيل السورة</Text>
      ) : (
        <Text style={styles.title}>About Chapter</Text>
      )}

      {languages ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.text}>{surahs.text}</Text>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <RenderHTML
            tagsStyles={{
              h2: {
                color: "#fff", // Orange color
                fontSize: 18, // Larger font size
                fontWeight: "bold", // Bold text
                marginBottom: 10, // Add margin below the heading
              },
              h3: {
                color: "#fff", // Orange color
                fontSize: 18, // Larger font size
                fontWeight: "bold", // Bold text
                marginBottom: 10, // Add margin below the heading
              },
              ol: {
                color: "#fff", // Orange color
                fontSize: 14, // Font size
                lineHeight: 24,
              },
              p: {
                color: "#fff", // Dark gray color
                fontSize: 14, // Font size
                lineHeight: 24, // Line height for better readability
              },
              a: {
                color: "#fff", // Dark gray color
                fontSize: 14, // Font size
                lineHeight: 24, // Line height for better readability
              },
            }}
            contentWidth={300} // Width of the content area
            source={{ html: info }}
          />
        </ScrollView>
      )}
    </View>
  );
};

const { styles } = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    zIndex: 99,
    "@media (min-width: 700px)": {
      paddingHorizontal: 32,
    },
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    paddingBottom: 200, // Adjust the height as needed
  },
  scrollContent: {
    paddingBottom: height * 0.2,
  },
  text: {
    color: "#D1D1D1", // Gray color for the text
    fontSize: 14,
  },
});

export default Details;
