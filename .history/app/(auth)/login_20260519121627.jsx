import { useAuth } from "@/hooks/useAuth";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LoginScreen() {
  const { login, isLoading, error,session } = useAuth();
  if(session){
    router.push("Index");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative geometric top bar */}

       <ImageBackground
      contentFit="cover"
      
      source={require("../../assets/images/SplashIndex.png")}
      style={styles.imageBackground}
    >
      

      <View style={styles.content}>
        {/* Logo / brand area */}
       <Image source={require("../../assets/images/Logo.png")} style={{ width: 100, height: 100,alignSelf: 'center' ,marginBottom: 10 }} />

        {/* Error message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Login button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={login}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>
              Register to App
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.privacyNote}>
          By continuing you agree to Quran Foundation's terms. Your account
          data is managed by Quran.com — no separate registration needed.
        </Text>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const GREEN = "#1A7F5A";
const DARK = "#0D1B1E";
const GOLD = "#C9973F";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },

  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAccent: {
    height: 4,
    backgroundColor: GOLD,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  arabicBismillah: {
    fontSize: 32,
    color: GOLD,
    fontWeight: "300",
    letterSpacing: 2,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 12,
    color: "#8FA3A8",
    marginTop: 6,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  features: {
    marginBottom: 40,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: "#B0C4C8",
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "#3D1515",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#E55",
  },
  errorText: {
    color: "#FFAAAA",
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  privacyNote: {
    fontSize: 11,
    color: "#506068",
    textAlign: "center",
    lineHeight: 16,
  },
});