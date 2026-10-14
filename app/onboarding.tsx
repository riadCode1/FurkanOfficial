import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const { languages } = useGlobalContext();

  const goToSignUp = () => router.replace("/(auth)/sign-up");
  const goToSignIn = () => router.replace("/(auth)/sign-in");

  return (
    <View style={styles.background}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoArea}>
          <Image
            source={images.brandLogo}
            contentFit="contain"
            accessibilityLabel={languages ? "شعار الفرقان" : "Furkan logo"}
            style={[styles.logo, { width: Math.min(width * 0.2, 86) }]}
          />
        </View>

        <View style={styles.artworkArea}>
          <Image
            source={images.onboardingArtwork}
            contentFit="contain"
            accessibilityLabel={languages ? "القرآن والمسجد والفانوس وسماعات الرأس" : "Quran, mosque, lantern, and headphones"}
            style={styles.artwork}
          />
        </View>

        <View style={styles.copyArea}>
          <Text style={styles.title}>{languages ? "رحلتك مع القرآن" : "Your Quran Journey"}</Text>
          <Text style={styles.titleAccent}>{languages ? "تبدأ من هنا" : "Starts Here"}</Text>
          {!languages && <Text style={styles.arabicTitle}>ابدأ رحلتك مع القرآن</Text>}
          <Text style={styles.description}>
            {languages ? "اقرأ واستمع وتعلّم وارتقِ مع الفرقان." : <>Read, listen, learn, and grow{"\n"}with Furkan.</>}
          </Text>
        </View>

        <View style={styles.actionsArea}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={languages ? "ابدأ الآن" : "Get started"}
            onPress={goToSignUp}
            style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={["#05E4D8", "#08C9F2"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.continueText}>{languages ? "متابعة" : "Continue"}</Text>
              <Feather name={languages ? "arrow-left" : "arrow-right"} size={24} color="#101A68" />
            </LinearGradient>
          </Pressable>
          <View style={styles.authLinks}>
            <Text style={styles.signInPrompt}>{languages ? "لديك حساب بالفعل؟ " : "Already have an account? "}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={languages ? "تسجيل الدخول" : "Sign in"}
              onPress={goToSignIn}
              hitSlop={12}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.signInLink}>{languages ? "دخول" : "Sign In"}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#071426",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoArea: {
    flex: 0.14,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: "86%",
  },
  artworkArea: {
    flex: 0.34,
    alignItems: "center",
    justifyContent: "center",
  },
  artwork: {
    width: "108%",
    height: "100%",
  },
  copyArea: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#F8F8FF",
    fontSize: 29,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  titleAccent: {
    color: "#06DCE7",
    fontSize: 31,
    fontWeight: "700",
    textAlign: "center",
  },
  arabicTitle: {
    color: "#04DCE5",
    fontSize: 25,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  description: {
    color: "#B6C6FF",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 13,
    textAlign: "center",
  },
  actionsArea: {
    flex: 0.22,
    justifyContent: "center",
    paddingTop: 8,
  },
  continueButton: {
    backgroundColor: "#05E4D8",
    width: "100%",
    height: 64,
    borderRadius: 40,
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  continueText: {
    color: "#101A68",
    fontSize: 18,
    fontWeight: "700",
  },
  authLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
  signInPrompt: {
    color: "#8598F3",
    fontSize: 15,
  },
  signInLink: {
    color: "#06DCE7",
    fontSize: 15,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
  },
});
