import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import ReaderCard from "../../../components/ReaderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ReadingSurah from "../../../components/ReadingSurah";
import { fetchChater, fetchSuwar } from "../../API/QuranApi";
import { NewData } from "../../../constants/NewData";
import { useGlobalContext } from "@/context/GlobalProvider";
import ModalAudio from "../../../components/ModalAudio";
import { Colors } from "../../../constants/Colors";
import { TouchableRipple } from "react-native-paper";

const Index = () => {
  const [quranData, setQuranData] = useState([]);
  const [chapter, setChapter] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setLanguages, languages, modalVisible, } =
    useGlobalContext();

  useEffect(() => {
    getReciter();
    getChapter();
  }, []);

  const getReciter = async () => {
    setLoading(true);
    try {
      const data = await fetchSuwar();
      if (data && data.recitations) {
        const combinedData = [...data.recitations, ...NewData.recitations];
        setQuranData(combinedData);
      }
    } catch (error) {
      console.error("Error fetching recitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChapter = async () => {
    setLoading(true);
    try {
      const data = await fetchChater();
      if (data && data.chapters) {
        setChapter(data.chapters);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../../../assets/images/Logo.png")}
            />
            <Text style={styles.logoText}>Furqan</Text>

            <Image
              style={styles.logo}
              resizeMode="contain"
              source={require("../../../assets/images/الفرقان.png")}
            />
          </View>

          <TouchableRipple
            rippleColor="rgba(53, 53, 151,1)"
            borderRadius={20}
            borderless
            style={styles.iconButton}
          >
            <Feather name="cast" size={24} color="white" />
          </TouchableRipple>
        </View>

        {/* Listen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {languages ? "استمع للقرآن الكريم من " : "Listen to Quran by"}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quranData?.slice(2, 8).map((item) => (
              <ReaderCard
                key={item.index}
                item={item}
                loading={loading}
                languages={languages}
                setLanguages={setLanguages}
                name={item.reciter_name}
                arab_name={item.translated_name.name}
                id={item.id}
              />
            ))}
          </ScrollView>
        </View>

        {/* Chapters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {languages ? "أفضل سور القرآن الكريم" : "Best Quran Chapters"}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {chapter?.slice(2, 8).map((item) => (
              <ReadingSurah
                key={item.index}
                item={item}
                languages={languages}
                name={item.name_simple}
                arab_name={item.translated_name.name}
                chapter_arab={item.name_arabic}
                Chapterid={item.id}
                verses={item.verses_count}
              />
            ))}
          </ScrollView>
          {/* Modal */}

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <StatusBar backgroundColor="#181A3C" />
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ModalAudio />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 48,
    height: 48,
  },
  logoText: {
    color: "#01F4FF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },

  iconButton: {
    justifyContent: "center",
    alignItems: "center",

    // To make it fully circular
    backgroundColor: Colors.tint,
    padding: 8,
  },
  section: {
    marginTop: 40,
    marginLeft: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    paddingRight: 16,
    fontFamily: 'lucida grande'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.background,
  },
});

export default Index;
