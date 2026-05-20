import {
  View, Text, ImageBackground, ScrollView,
  Image, StyleSheet, Linking, I18nManager,
  Modal, Pressable, Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Switch, TouchableRipple } from "react-native-paper";
import * as StoreReview from "expo-store-review";
import Constants from "expo-constants";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { useAuth } from "../../../hooks/useAuth";

// ─── helpers ──────────────────────────────────────────────────────────────────

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

const Row = ({ icon, iconColor = "#5b8dee", iconBg = "#2a3a6e", label, right, onPress }) => (
  <TouchableRipple
    disabled={!onPress}
    onPress={onPress}
    rippleColor="rgba(200,200,200,0.08)"
    style={S.row}
  >
    <View style={S.rowInner}>
      <View style={[S.rowIcon, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={S.rowLabel}>{label}</Text>
      <View style={S.rowRight}>
        {right !== undefined ? right : (
          <MaterialIcons name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={22} color="#5b7ab5" />
        )}
      </View>
    </View>
  </TouchableRipple>
);

const Section = ({ label, children }) => (
  <>
    <Text style={S.sectionLabel}>{label}</Text>
    <View style={S.section}>{children}</View>
  </>
);

const Divider = () => <View style={S.divider} />;

const ConfirmModal = ({ visible, icon, title, message, confirmLabel, confirmColor, onConfirm, onCancel }) => (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel} statusBarTranslucent>
    <Pressable style={S.backdrop} onPress={onCancel}>
      <Pressable style={S.modalBox}>
        <View style={[S.modalIcon, { backgroundColor: confirmColor + "22" }]}>
          <MaterialIcons name={icon} size={28} color={confirmColor} />
        </View>
        <Text style={S.modalTitle}>{title}</Text>
        <Text style={S.modalMsg}>{message}</Text>
        <View style={S.modalBtns}>
          <TouchableRipple style={S.cancelBtn} onPress={onCancel} rippleColor="rgba(255,255,255,0.1)">
            <Text style={S.cancelTxt}>Cancel</Text>
          </TouchableRipple>
          <TouchableRipple style={[S.confirmBtn, { backgroundColor: confirmColor }]} onPress={onConfirm} rippleColor="rgba(255,255,255,0.2)">
            <Text style={S.confirmTxt}>{confirmLabel}</Text>
          </TouchableRipple>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

// ─── guest screen ─────────────────────────────────────────────────────────────

const GuestScreen = ({ onLogin, t }) => (
  <SafeAreaView style={S.container}>
    <StatusBar style="light" backgroundColor="#191845" />
    <View style={S.guestWrap}>
      <View style={S.guestIcon}>
        <MaterialIcons name="person-outline" size={48} color={Colors.blue} />
      </View>
      <Text style={S.guestTitle}>{t("أنت غير مسجّل الدخول", "You're not logged in")}</Text>
      <Text style={S.guestSub}>{t("سجّل دخولك للوصول إلى إعداداتك", "Sign in to access your settings")}</Text>
      <TouchableRipple style={S.loginBtn} onPress={onLogin} rippleColor="rgba(255,255,255,0.2)">
        <View style={S.loginBtnInner}>
          <MaterialIcons name="login" size={20} color="white" />
          <Text style={S.loginBtnTxt}>{t("تسجيل الدخول", "Log In")}</Text>
        </View>
      </TouchableRipple>
    </View>
  </SafeAreaView>
);

// ─── main screen ──────────────────────────────────────────────────────────────

export default function Setting() {
  const { languages } = useGlobalContext();
  const { session, profile, logout, login, isLoading } = useAuth();
  const [notifOn, setNotifOn] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const t = (ar, en) => (languages ? ar : en);
  const initial = profile?.username?.[0]?.toUpperCase() || "G";
  const username = profile?.username || t("ضيف", "Guest");
  const email = session?.userProfile?.email || "";

  const handleLogout = async () => { setShowLogout(false); await logout(); };
  const handleDelete = async () => { setShowDelete(false); await logout(); };
  const handleRate = async () => {
    if (await StoreReview.hasAction()) StoreReview.requestReview();
    else Linking.openURL(Platform.OS === "ios"
      ? "https://apps.apple.com/app/idYOUR_APP_ID"
      : "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME"
    );
  };

  if (!isLoading && !session) return <GuestScreen onLogin={login} t={t} />;

  return (
    <SafeAreaView style={S.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      <ConfirmModal
        visible={showLogout} icon="logout"
        title={t("تسجيل الخروج", "Log Out")}
        message={t("هل أنت متأكد؟", "Are you sure you want to log out?")}
        confirmLabel={t("خروج", "Log Out")} confirmColor="#e85d5d"
        onConfirm={handleLogout} onCancel={() => setShowLogout(false)}
      />

      <ConfirmModal
        visible={showDelete} icon="delete-forever"
        title={t("حذف الحساب", "Delete Account")}
        message={t("سيتم حذف حسابك نهائيًا.", "This will permanently delete your account.")}
        confirmLabel={t("حذف", "Delete")} confirmColor="#c0392b"
        onConfirm={handleDelete} onCancel={() => setShowDelete(false)}
      />

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>

        {/* header */}
        <View style={S.header}>
          <Text style={S.headerTxt}>{t("الإعدادات", "Settings")}</Text>
        </View>

        {/* profile */}
        <View style={S.profileCard}>
          <TouchableRipple style={S.profileLeft} rippleColor="rgba(200,200,200,0.06)" onPress={() => router.push("/EditProfile/")}>
            <View style={S.profileLeftInner}>
              <View style={S.avatar}><Text style={S.avatarTxt}>{initial}</Text></View>
              <View>
                <Text style={S.profileName}>{username}</Text>
                {!!email && <Text style={S.profileEmail}>{email}</Text>}
                <Text style={S.profileHint}>{t("تعديل الملف", "Edit profile →")}</Text>
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple style={S.logoutIcon} rippleColor="rgba(232,93,93,0.15)" onPress={() => setShowLogout(true)}>
            <View style={S.logoutIconInner}>
              <MaterialIcons name="logout" size={20} color="#e85d5d" />
            </View>
          </TouchableRipple>
        </View>

        {/* donate */}
        <View style={S.donateCard}>
          <ImageBackground resizeMode="cover" source={require("../../../assets/images/SplashIndex.png")} style={S.donateBg}>
            <View style={S.donateOverlay} />
            <View style={S.donateContent}>
              <Image resizeMode="contain" style={S.donateLogo} source={require("../../../assets/images/Logo.png")} />
              <Text style={S.donateTitle}>{t("ادعمنا", "Support Us")}</Text>
              <Text style={S.donateDesc}>
                {t("تطبيق الفرقان مجاني تمامًا بلا إعلانات. ادعمنا بالتبرع.", "Furqan App is free with zero ads. Support us through a donation.")}
              </Text>
              <TouchableRipple style={S.donateBtn} onPress={() => Linking.openURL("https://www.paypal.com/ncp/payment/4GFTTGH38F4EC")} rippleColor="rgba(255,255,255,0.2)">
                <Text style={S.donateBtnTxt}>{t("تبرع الآن", "Donate Now")}</Text>
              </TouchableRipple>
            </View>
          </ImageBackground>
        </View>

        {/* preferences */}
        <Section label={t("التفضيلات", "Preferences")}>
          <Row icon="public" label={t("اللغات", "Languages")} onPress={() => router.push("/Languagues/")} />
          <Divider />
          <Row icon="notifications-active" label={t("الإشعارات", "Notifications")}
            right={<Switch color={Colors.blue} value={notifOn} onValueChange={() => setNotifOn(v => !v)} />}
          />
        </Section>

        {/* about */}
        <Section label={t("حول التطبيق", "About & Support")}>
          <Row icon="star-rate" iconColor="#f4c430" iconBg="#2e2408" label={t("قيّم التطبيق", "Rate the App")} onPress={handleRate} />
          <Divider />
          <Row icon="mail-outline" iconColor="#4ec9b0" iconBg="#0c2622" label={t("تواصل معنا", "Contact Us")} onPress={() => Linking.openURL("mailto:support@furqanapp.com?subject=Feedback")} />
          <Divider />
          <Row icon="privacy-tip" label={t("سياسة الخصوصية", "Privacy & Policy")} onPress={() => router.push("/Privacy/")} />
          <Divider />
          <Row icon="fact-check" label={t("شروط الخدمة", "Terms & Conditions")} onPress={() => router.push("/Terms/")} />
          <Divider />
          <Row icon="info-outline" label={t("إصدار التطبيق", "App Version")} right={<Text style={S.version}>v{APP_VERSION}</Text>} />
        </Section>

        {/* account */}
        <Section label={t("الحساب", "Account")}>
          <Row icon="logout" iconColor="#e85d5d" iconBg="#2e0f0f" label={t("تسجيل الخروج", "Log Out")} onPress={() => setShowLogout(true)} right={null} />
        </Section>

        {/* delete */}
        <TouchableRipple style={S.deleteBtn} onPress={() => setShowDelete(true)} rippleColor="rgba(192,57,43,0.12)">
          <View style={S.deleteBtnInner}>
            <MaterialIcons name="delete-forever" size={20} color="#c0392b" />
            <Text style={S.deleteTxt}>{t("حذف الحساب", "Delete Account")}</Text>
          </View>
        </TouchableRipple>

        <Text style={S.footer}>{t("تطبيق الفرقان", "Furqan App")} · v{APP_VERSION}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  scroll:         { paddingBottom: 800 },

  // header
  header:         { marginTop: 8, paddingVertical: 16, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  headerTxt:      { color: "white", fontSize: 18, fontWeight: "700" },

  // guest
  guestWrap:      { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  guestIcon:      { width: 96, height: 96, borderRadius: 48, backgroundColor: "rgba(91,141,238,0.12)", borderWidth: 1, borderColor: "rgba(91,141,238,0.25)", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  guestTitle:     { color: "white", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  guestSub:       { color: "rgba(255,255,255,0.45)", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 32 },
  loginBtn:       { borderRadius: 16, overflow: "hidden", backgroundColor: Colors.blue, width: "100%" },
  loginBtnInner:  { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52 },
  loginBtnTxt:    { color: "white", fontSize: 16, fontWeight: "700" },

  // profile
  profileCard:    { marginHorizontal: 16, marginTop: 16, borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", flexDirection: "row", alignItems: "center" },
  profileLeft:    { flex: 1 },
  profileLeftInner: { flexDirection: "row", alignItems: "center", padding: 10, gap: 10 },
  avatar:         { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.blue, justifyContent: "center", alignItems: "center" },
  avatarTxt:      { color: "white", fontSize: 15, fontWeight: "700" },
  profileName:    { color: "white", fontSize: 14, fontWeight: "600" },
  profileEmail:   { color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 1 },
  profileHint:    { color: Colors.blue, fontSize: 11, marginTop: 3 },
  ogoutIcon:     { paddingHorizontal: 14, height: "100%", justifyContent: "center" },
  logoutIconInner:{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(232,93,93,0.12)", borderWidth: 1, borderColor: "rgba(232,93,93,0.25)", justifyContent: "center", alignItems: "center" },

  // donate
  donateCard:     { marginHorizontal: 16, marginTop: 16, borderRadius: 14, overflow: "hidden", minHeight: 200 },
  donateBg:       { width: "100%", minHeight: 200 },
  donateOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15,18,55,0.55)" },
  donateContent:  { alignItems: "center", paddingVertical: 20, paddingHorizontal: 20 },
  donateLogo:     { width: 44, height: 44, marginBottom: 6 },
  donateTitle:    { color: "white", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  donateDesc:     { color: "rgba(255,255,255,0.75)", textAlign: "center", fontSize: 12, lineHeight: 18, marginBottom: 16 },
  donateBtn:      { paddingHorizontal: 32, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: Colors.blue, borderRadius: 20, overflow: "hidden" },
  donateBtnTxt:   { color: "white", fontSize: 14, fontWeight: "700" },

  // section
  sectionLabel:   { color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginHorizontal: 20, marginTop: 24, marginBottom: 8 },
  section:        { marginHorizontal: 16, borderRadius: 14, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },

  // row
  row:            { height: 56, justifyContent: "center" },
  rowInner:       { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 12 },
  rowIcon:        { width: 34, height: 34, borderRadius: 9, justifyContent: "center", alignItems: "center" },
  rowLabel:       { flex: 1, fontSize: 15, color: "white", fontWeight: "500" },
  rowRight:       { alignItems: "flex-end" },
  divider:        { height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginLeft: 60 },
  version:        { color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: "600" },

  // delete
  deleteBtn:      { marginHorizontal: 16, marginTop: 16, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "rgba(192,57,43,0.3)", backgroundColor: "rgba(192,57,43,0.07)" },
  deleteBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 50 },
  deleteTxt:      { color: "#c0392b", fontSize: 15, fontWeight: "600" },

  footer:         { textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 12, marginTop: 28 },

  // modal
  backdrop:       { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "center", alignItems: "center" },
  modalBox:       { width: "82%", backgroundColor: "#1e2356", borderRadius: 20, padding: 24, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  modalIcon:      { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  modalTitle:     { color: "white", fontSize: 18, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  modalMsg:       { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 22, textAlign: "center", marginBottom: 24 },
  modalBtns:      { flexDirection: "row", gap: 12, width: "100%" },
  cancelBtn:      { flex: 1, height: 46, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", overflow: "hidden" },
  cancelTxt:      { color: "rgba(255,255,255,0.7)", fontWeight: "600", fontSize: 15 },
  confirmBtn:     { flex: 1, height: 46, borderRadius: 12, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  confirmTxt:     { color: "white", fontWeight: "700", fontSize: 15 },
});