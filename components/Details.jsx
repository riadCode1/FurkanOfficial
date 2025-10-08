import { View, Text, ScrollView, Dimensions, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import StyleSheet from "react-native-media-query";
import { useGlobalContext } from "../context/GlobalProvider";
import RenderHTML from "react-native-render-html";
import { Colors } from "../constants/Colors";
import { fetChapterID } from "../app/API/QuranApi";
let { width, height } = Dimensions.get("window");

const Details = ({ id,languages }) => {
 
  const [text, setText] = useState(null);
  

  useEffect(() => {
  getChapter(id)
  }, []);

   const getChapter = async (id) => {
      // setLoading(true);
      try {
        const data = await fetChapterID(id);
       
          setText(data.chapter);
        
       
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        // setLoading(false);
      }
    };

 
 

  return (
    <View style={styles.container}>
      {languages ? (
        <Text style={styles.title}>معلومات عن السورة</Text>
      ) : (
        <Text style={styles.title}>Chapter info</Text>
      )}

    {languages ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
         
            <View style={{gap:5}}>
              <Text style={[styles.title,{fontSize:16}]}>الاسم: <Text style={styles.text} >{text?.name_arabic}</Text> </Text>
              <Text style={[styles.title,{fontSize:16}]}> عدد الآيات: <Text style={styles.text} > {text?.verses_count}</Text> </Text>
              <Text style={[styles.title,{fontSize:16}]}>عدد الصفحات :<Text style={styles.text}>{text?.pages?.[0]} - {text?.pages?.[1]}</Text></Text>
              <Text style={[styles.title,{fontSize:16}]}>الترتيب الزمني للسورة: <Text style={styles.text} > {text?.revelation_order}</Text> </Text>
              <Text style={[styles.title,{fontSize:16}]}>مكان الوحي:  <Text style={styles.text} >{text?.revelation_place === "makkah"
                  ? languages? "مكة المكرمة" :"Makkah"
                  : languages? "المدينة المنورة" :"Madinah"}</Text>
              </Text>

              <Text style={[styles.title,{fontSize:16}]}>
               قم بزيارة هذا الرابط لمزيد من التفاصيل عن السورة
                <Text
                  style={{ color: Colors.blue,textDecorationLine:"underline",textDecorationStyle:"dotted" }}
                  onPress={() =>
                    Linking.openURL(
                      `https://quran.com/surah/${id}/info`
                    )
                  }
                > website  </Text>
                  
              
              </Text>
            </View>
          
        </ScrollView>
      ) : (
        <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
       
          <View style={{gap:5}}>
            <Text style={[styles.title,{fontSize:16}]}>Name: <Text style={styles.text}>{text?.name_simple}</Text></Text>
            <Text style={[styles.title,{fontSize:16}]}>Number of Ayahs: <Text style={styles.text}>{text?.verses_count}</Text></Text>
            <Text style={[styles.title,{fontSize:16}]}>Number of pages :<Text style={styles.text}>{text?.pages?.[0]} - {text?.pages?.[1]}</Text></Text>
            <Text style={[styles.title,{fontSize:16}]}>The chronological order of surah: <Text style={styles.text} > {text?.revelation_order}</Text> </Text>
            <Text style={[styles.title,{fontSize:16}]}>Revelation place: <Text style={styles.text}>
              {text?.revelation_place === "Meccan"
                ? "Mecca"
                : "Medina"}
            </Text>
            </Text>
      
            <Text style={[styles.title,{fontSize:16}]}>
              Visit this link for more details about the Surah
              <Text
                style={{ color: Colors.blue, textDecorationLine: "underline", textDecorationStyle: "dotted" }}
                onPress={() =>
                  Linking.openURL(
                    `https://quran.com/surah/${id}/info`
                  )
                }
              > website </Text>
            </Text>
          </View>
      
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
    paddingBottom: 50,
    marginTop:20 // Adjust the height as needed
  },
  scrollContent: {
    paddingBottom: height * 0.2,
  },
  text: {
    color: "#D1D1D1", // Gray color for the text
    fontSize: 14,
    fontWeight:500
  },
});

export default Details;
