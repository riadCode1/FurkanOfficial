import { View, Text, ScrollView, useWindowDimensions, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/Colors";
import { fetChapterID } from "../app/API/QuranApi";

const Details = ({ id, languages }) => {
  const [text, setText] = useState(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    getChapter(id);
  }, [id]);

  const getChapter = async (chapterId) => {
    try {
      const data = await fetChapterID(chapterId);
      setText(data.chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
    }
  };

  const containerPadding = width > 700 ? 32 : 16;

  return (
    <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
      <Text style={styles.title}>
        {languages ? "معلومات عن السورة" : "Chapter info"}
      </Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: height * 0.2 }]}
      >
        <View style={{ gap: 5 }}>
          {languages ? (
            <>
              <Text style={[styles.title, { fontSize: 16 }]}>
                الاسم: <Text style={styles.text}>{text?.name_arabic}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                عدد الآيات: <Text style={styles.text}>{text?.verses_count}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                عدد الصفحات:{" "}
                <Text style={styles.text}>
                  {text?.pages?.[0]} - {text?.pages?.[1]}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                الترتيب الزمني للسورة:{" "}
                <Text style={styles.text}>{text?.revelation_order}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                مكان الوحي:{" "}
                <Text style={styles.text}>
                  {text?.revelation_place === "makkah"
                    ? "مكة المكرمة"
                    : "المدينة المنورة"}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                قم بزيارة هذا الرابط لمزيد من التفاصيل عن السورة{" "}
                <Text
                  style={{
                    color: Colors.blue,
                    textDecorationLine: "underline",
                    textDecorationStyle: "dotted",
                  }}
                  onPress={() =>
                    Linking.openURL(`https://quran.com/surah/${id}/info`)
                  }
                >
                  website
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Name: <Text style={styles.text}>{text?.name_simple}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Number of Ayahs: <Text style={styles.text}>{text?.verses_count}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Number of pages:{" "}
                <Text style={styles.text}>
                  {text?.pages?.[0]} - {text?.pages?.[1]}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                The chronological order of surah:{" "}
                <Text style={styles.text}>{text?.revelation_order}</Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Revelation place:{" "}
                <Text style={styles.text}>
                  {text?.revelation_place === "Meccan" ? "Mecca" : "Medina"}
                </Text>
              </Text>
              <Text style={[styles.title, { fontSize: 16 }]}>
                Visit this link for more details about the Surah{" "}
                <Text
                  style={{
                    color: Colors.blue,
                    textDecorationLine: "underline",
                    textDecorationStyle: "dotted",
                  }}
                  onPress={() =>
                    Linking.openURL(`https://quran.com/surah/${id}/info`)
                  }
                >
                  website
                </Text>
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    zIndex: 99,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    paddingBottom: 50,
    marginTop: 20,
  },
  scrollContent: {},
  text: {
    color: "#D1D1D1",
    fontSize: 14,
    fontWeight: "500",
  },
};

export default Details;
