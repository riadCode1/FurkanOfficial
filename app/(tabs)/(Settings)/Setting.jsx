import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Setting = () => {
  const { languages } = useGlobalContext();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {languages ? "إعدادات" : "Settings"}
          </Text>
        </View>

        <View style={styles.card}>
          <ImageBackground
            resizeMode="cover"
            source={require("../../../assets/images/SplashFK.png")}
            style={styles.imageBackground}
          >
            <View style={styles.imageContent}>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={require("../../../assets/images/Logo.png")}
              />
              <Text style={styles.supportText}>
                {languages ? "ادعمنا" : "Support Us"}
              </Text>
              <View style={styles.textContainer}>
                <Text style={styles.descriptionText}>
                  {languages
                    ? "تم إنشاء تطبيق الفرقان ليتم استخدامه بالكامل مجانًا خالية تماما من الإعلانات، يمكنك دعم عملنا من خلال التبرعات"
                    : "Furqan App is created to be used completely for free with absolutely zero ads, you can support our work through donation"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.donateButton}>
              <Text style={styles.donateButtonText}>
                {languages ? "تبرع" : "Donate"}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/*section 2 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/Languagues/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Ionicons name="earth" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? "اللغات" : "Languages"}
              </Text>
            </View>
            <AntDesign name="right" size={20} color="white" />
          </View>
        </TouchableRipple>

        {/*section 3 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/PlaylistScreen/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons
                name="notifications-active"
                size={24}
                color="white"
              />
              <Text style={styles.optionText}>
                {languages ? "إشعارات" : "Notifications"}
              </Text>
            </View>
            <AntDesign name="right" size={20} color="white" />
          </View>
        </TouchableRipple>

        {/*section 4 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/Privacy/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons name="privacy-tip" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? "سياسة الخصوصية" : "Privacy & policy"}
              </Text>
            </View>
            <AntDesign name="right" size={20} color="white" />
          </View>
        </TouchableRipple>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    paddingBottom: 200,
  },
  header: {
    marginTop: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 36,
    marginBottom: 34,
    height: 228,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  imageContent: {
    alignItems: "center",
  },
  logo: {
    width: 56,
    height: 56,
  },
  supportText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  textContainer: {
    paddingHorizontal: 16,
    marginTop: 16,

    height: 60,
  },
  descriptionText: {
    color: Colors.textGray,
    textAlign: "center",
  },
  donateButton: {
    width: 310,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCE5",
    borderRadius: 24,
    marginTop: 20,
    alignSelf: "center",
  },
  donateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  touchable: {
    flexDirection: "row",
    width: "100%",
    height: 56,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },
  optionTextContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: "white",
  },
});

export default Setting;
