import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  
  StyleSheet,
  
  Linking,
  I18nManager,
} from "react-native";

import  { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {  MaterialIcons } from "@expo/vector-icons";

import { router } from "expo-router";
import {  Switch, TouchableRipple } from "react-native-paper";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";

const Setting = () => {
  const { languages } = useGlobalContext();
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

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
            source={require("../../../assets/images/SplashIndex.png")}
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

            {/*section 2 */}
            <TouchableRipple
              rippleColor="rgb(200, 200, 200,0.8)"
              onPress={() =>
                Linking.openURL(
                  "https://www.paypal.com/ncp/payment/4GFTTGH38F4EC"
                )
              }
              style={styles.donateButton}
            >
              <Text style={styles.donateButtonText}>
                {languages ? "تبرع" : "Donate"}
              </Text>
            </TouchableRipple>
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
              <MaterialIcons name="public" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? "اللغات" : "Languages"}
              </Text>
            </View>
            <MaterialIcons
              size={30}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color={"white"}
            />
          </View>
        </TouchableRipple>

        {/*section 3 */}
        <View style={styles.touchable}>
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
            <Switch
              color={Colors.blue}
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>
        </View>

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
            <MaterialIcons
              size={30}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color={"white"}
            />
          </View>
        </TouchableRipple>

        {/*section 5 */}
        <TouchableRipple
          rippleColor="rgba(200, 200, 200, 0.1)"
          style={styles.touchable}
          onPress={() => {
            router.push({ pathname: `/Terms/` });
          }}
        >
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <MaterialIcons name="fact-check" size={24} color="white" />
              <Text style={styles.optionText}>
                {languages ? " شروط الخدمة" : "Terms & Conditions  "}
              </Text>
            </View>
            <MaterialIcons
              size={30}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color={"white"}
            />
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
    width: "50%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    alignSelf: "center",
  },
  donateButtonText: {
    color: Colors.background,
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
    paddingHorizontal: 16,
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

  modalContainer: {
    justifyContent: "center",
    alignItems: "center",

    height: "100%",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonD: {
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCE5",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    width: 150,
    alignSelf: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Setting;
