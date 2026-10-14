import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollToTop } from "../../context/ScrollToTopProvider";
import { useGlobalContext } from "../../context/GlobalProvider";

type AuthMode = "sign-up" | "sign-in";

export default function AuthScreen({ mode }: { mode: AuthMode }) {
  const scrollRef = useRef<ScrollView>(null);
  const handleScroll = useScrollToTop(scrollRef);
  const { languages } = useGlobalContext();
  const isSignUp = mode === "sign-up";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [code, setCode] = useState("");
  const codeInput = useRef<TextInput>(null);

  useEffect(() => {
    if (verificationOpen) {
      const timer = setTimeout(() => codeInput.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [verificationOpen]);

  const openVerification = () => {
    Keyboard.dismiss();
    setCode("");
    setVerificationOpen(true);
  };

  const updateCode = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6) {
      Keyboard.dismiss();
      setVerificationOpen(false);
      router.replace("/");
    }
  };

  return (
    <View className="flex-1 bg-[#071426]">
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <View className="w-[92%] rounded-[28px] border border-[#0879ff] bg-[#06113a] px-6 pb-6 pt-6">
            <Text className="text-[28px] font-bold text-[#f6f8ff]">
              {languages ? (isSignUp ? "إنشاء حساب" : "مرحبًا بعودتك") : (isSignUp ? "Create Account" : "Welcome Back")}
            </Text>
            <Text className="mt-2 text-base leading-6 text-[#7e9eff]">
              {languages
                ? (isSignUp ? "ابدأ رحلتك مع القرآن مع الفرقان." : "سجّل الدخول لمتابعة رحلتك مع الفرقان.")
                : (isSignUp ? "Begin your Quran journey with Furkan." : "Sign in to continue your journey with Furkan.")}
            </Text>

            <View className="mt-5 h-[68px] flex-row items-center rounded-[17px] border border-[#0879ff] px-4">
              <Feather name="mail" size={26} color="#08c8f4" />
              <View className="ml-4 flex-1">
                <Text className="text-sm text-[#91adff]">{languages ? "البريد الإلكتروني" : "Email address"}</Text>
                <TextInput
                  accessibilityLabel={languages ? "البريد الإلكتروني" : "Email address"}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#6382d4"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="done"
                  style={styles.emailInput}
                />
              </View>
            </View>

            <View className="mt-4 h-[68px] flex-row items-center rounded-[17px] border border-[#0879ff] px-4">
              <Feather name="lock" size={25} color="#08c8f4" />
              <View className="ml-4 flex-1">
                <Text className="text-sm text-[#91adff]">{languages ? "كلمة المرور" : "Password"}</Text>
                <TextInput
                  accessibilityLabel={languages ? "كلمة المرور" : "Password"}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={languages ? "أدخل كلمة المرور" : "Enter your password"}
                  placeholderTextColor="#6382d4"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete={isSignUp ? "new-password" : "password"}
                  returnKeyType="done"
                  style={styles.emailInput}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={languages ? (showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور") : (showPassword ? "Hide password" : "Show password")}
                onPress={() => setShowPassword((visible) => !visible)}
                hitSlop={10}
              >
                <Feather name={showPassword ? "eye-off" : "eye"} size={22} color="#7e9eff" />
              </Pressable>
            </View>

            <Pressable accessibilityRole="button" onPress={openVerification} style={({ pressed }) => [styles.mainButton, pressed && styles.pressed]}>
              <LinearGradient colors={["#05dce9", "#08c5f4"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradient}>
                <Text className="text-[19px] font-bold text-[#071c59]">{languages ? (isSignUp ? "إنشاء حساب" : "تسجيل الدخول") : (isSignUp ? "Sign Up" : "Sign In")}</Text>
                <Feather name={languages ? "arrow-left" : "arrow-right"} size={23} color="#071c59" />
              </LinearGradient>
            </Pressable>

            <View className="my-4 flex-row items-center">
              <View className="h-px flex-1 bg-[#0879ff]" />
              <Text className="mx-4 text-base text-[#7e9eff]">{languages ? "أو" : "or"}</Text>
              <View className="h-px flex-1 bg-[#0879ff]" />
            </View>

            <Pressable accessibilityRole="button" accessibilityLabel={languages ? "المتابعة باستخدام Google" : "Continue with Google"} style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}>
              <FontAwesome name="google" size={22} color="#4285f4" style={styles.googleIcon} />
              <Text className="text-base font-semibold text-[#172554]">{languages ? "المتابعة باستخدام Google" : "Continue with Google"}</Text>
            </Pressable>

            <View className="mt-5 flex-row justify-center">
              <Text className="text-base text-[#7e9eff]">
                {languages
                  ? (isSignUp ? "لديك حساب بالفعل؟ " : "ليس لديك حساب؟ ")
                  : (isSignUp ? "Already have an account? " : "Don’t have an account? ")}
              </Text>
              <Pressable onPress={() => router.replace(isSignUp ? "/(auth)/sign-in" : "/(auth)/sign-up")}>
                <Text className="text-base font-bold text-[#04dce9]">{languages ? (isSignUp ? "دخول" : "إنشاء حساب") : (isSignUp ? "Sign In" : "Sign Up")}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={verificationOpen} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setVerificationOpen(false)}>
        <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Pressable style={styles.scrim} onPress={() => setVerificationOpen(false)} />
          <View className="w-[88%] rounded-[26px] border border-[#0879ff] bg-[#071541] px-6 py-7">
            <View className="mb-4 h-14 w-14 items-center justify-center self-center rounded-full bg-[#063b77]">
              <Feather name="mail" size={27} color="#08d3ed" />
            </View>
            <Text className="text-center text-[23px] font-bold text-white">{languages ? "تحقق من بريدك الإلكتروني" : "Check your email"}</Text>
            <Text className="mt-2 text-center text-[15px] leading-6 text-[#9bb4f9]">
              {languages ? "أرسلنا إليك رسالة تحقق. أدخل الرمز المكوّن من 6 أرقام للمتابعة." : "We’ve sent a verification email. Enter the 6-digit code to continue."}
            </Text>
            <Pressable onPress={() => codeInput.current?.focus()} className="mt-6 flex-row justify-center gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <View key={index} className={`h-12 w-10 items-center justify-center rounded-xl border ${index === code.length ? "border-[#08d4ef]" : "border-[#2168c5]"}`}>
                  <Text className="text-xl font-semibold text-white">{code[index] ?? ""}</Text>
                </View>
              ))}
            </Pressable>
            <TextInput
              ref={codeInput}
              value={code}
              onChangeText={updateCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={6}
              caretHidden
              accessibilityLabel={languages ? "رمز التحقق المكوّن من 6 أرقام" : "6-digit verification code"}
              style={styles.codeInput}
            />
            <Pressable onPress={() => setVerificationOpen(false)} className="mt-5 self-center py-2">
              <Text className="text-sm font-semibold text-[#08d3ed]">{languages ? "إلغاء" : "Cancel"}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  googleIcon: { marginEnd: 12 },
  safeArea: { flex: 1 },
  emailInput: { minHeight: 24, marginTop: 4, padding: 0, color: "#ffffff", fontSize: 16 },
  mainButton: { height: 62, marginTop: 23, overflow: "hidden", borderRadius: 32 },
  gradient: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  socialButton: { height: 60, backgroundColor: "#ffffff", borderRadius: 30, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.78 },
  modalRoot: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 5, 24, 0.78)" },
  codeInput: { position: "absolute", width: 1, height: 1, opacity: 0.02, bottom: 20 },
});
