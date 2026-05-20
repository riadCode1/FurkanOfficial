import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  StyleSheet,
  Linking,
  I18nManager,
  Modal,
  Pressable,
  Platform,
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

// ─── reusable menu row ────────────────────────────────────────────────────────
const MenuRow = ({
  iconName,
  iconColor = "#5b8dee",
  iconBg = "#2a3a6e",
  label,
  right,
  onPress,
}) => {
  const inner = (
    <View style={styles.menuInner}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIconBg, { backgroundColor: iconBg }]}>
          <MaterialIcons name={iconName} size={20} color={iconColor} />
        </View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {right !== undefined ? (
        right
      ) : (
        <MaterialIcons
          size={22}
          name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
          color="#5b7ab5"
        />
      )}
    </View>
  );

  if (!onPress) return <View style={styles.menuItem}>{inner}</View>;

  return (
    <TouchableRipple
      rippleColor="rgba(200,200,200,0.08)"
      style={styles.menuItem}
      onPress={onPress}
    >
      {inner}
    </TouchableRipple>
  );
};

// ─── section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <Text style={styles.sectionLabel}>{text}</Text>
);

// ─── confirm modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({
  visible,
  iconName,
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onCancel}
    statusBarTranslucent
  >
    <Pressable style={styles.modalBackdrop} onPress={onCancel}>
      <Pressable style={styles.modalBox} onPress={() => {}}>
        <View
          style={[
            styles.modalIconCircle,
            { backgroundColor: confirmColor + "22" },
          ]}
        >
          <MaterialIcons name={iconName} size={28} color={confirmColor} />
        </View>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalActions}>
          <TouchableRipple
            style={styles.modalCancelBtn}
            onPress={onCancel}
            rippleColor="rgba(255,255,255,0.1)"
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableRipple>
          <TouchableRipple
            style={[
              styles.modalConfirmBtn,
              { backgroundColor: confirmColor },
            ]}
            onPress={onConfirm}
            rippleColor="rgba(255,255,255,0.2)"
          >
            <Text style={styles.modalConfirmText}>{confirmLabel}</Text>
          </TouchableRipple>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

// ─── main screen ──────────────────────────────────────────────────────────────
const Setting = () => {
  const { languages } = useGlobalContext();
  const [notifOn, setNotifOn] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const { session, profile, logout,login } = useAuth();

  const initial = profile?.username?.[0]?.toUpperCase() || "G";
  const username = profile?.username || (languages ? "ضيف" : "Guest");
  const email = session?.user?.email || "";
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const t = (ar, en) => (languages ? ar : en);

  const handleLogout = async () => {
    setLogoutVisible(false);
    await logout?.();
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    setDeleteVisible(false);
    // TODO: call your delete-account API here
    await logout?.();
    router.replace("/");
  };

  const handleRate = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    } else {
      const url =
        Platform.OS === "ios"
          ? "https://apps.apple.com/app/idYOUR_APP_ID"
          : "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME";
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      {/* logout modal */}
      <ConfirmModal
        visible={logoutVisible}
        iconName="logout"
        title={t("تسجيل الخروج", "Log Out")}
        message={t(
          "هل أنت متأكد أنك تريد تسجيل الخروج؟",
          "Are you sure you want to log out of your account?"
        )}
        confirmLabel={t("خروج", "Log Out")}
        confirmColor="#e85d5d"
        onConfirm={handleLogout}
        onCancel={() => setLogoutVisible(false)}
      />

      {/* delete modal */}
      <ConfirmModal
        visible={deleteVisible}
        iconName="delete-forever"
        title={t("حذف الحساب", "Delete Account")}
        message={t(
          "سيؤدي هذا إلى حذف حسابك وجميع بياناتك بشكل دائم. لا يمكن التراجع عن هذا الإجراء.",
          "This will permanently delete your account and all data. This action cannot be undone."
        )}
        confirmLabel={t("حذف", "Delete")}
        confirmColor="#c0392b"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteVisible(false)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{t("الإعدادات", "Settings")}</Text>
        </View>

        {/* ── Profile Card ── */}
        <TouchableRipple
          rippleColor="rgba(200,200,200,0.06)"
          style={styles.profileCard}
          
        >
          <View style={styles.profileCardInner}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{username}</Text>
              {!!email && (
                <Text style={styles.profileEmail}>{email}</Text>
              )}
             
            </View>
            <MaterialIcons
              size={20}
              name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
              color="#5b7ab5"
            />
          </View>
        </TouchableRipple>

        {/* ── Donate Card ── */}
        <View style={styles.card}>
          <ImageBackground
            resizeMode="cover"
            source={require("../../../assets/images/SplashIndex.png")}
            style={styles.imageBackground}
          >
            <View style={styles.cardOverlay} />
            <View style={styles.imageContent}>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={require("../../../assets/images/Logo.png")}
              />
              <Text style={styles.supportText}>
                {t("ادعمنا", "Support Us")}
              </Text>
              <Text style={styles.descriptionText}>
                {t(
                  "تم إنشاء تطبيق الفرقان ليتم استخدامه بالكامل مجانًا خالية تماما من الإعلانات، يمكنك دعم عملنا من خلال التبرعات",
                  "Furqan App is completely free with zero ads. Support our work through a donation."
                )}
              </Text>
              <TouchableRipple
                rippleColor="rgba(255,255,255,0.2)"
                onPress={() =>
                  Linking.openURL(
                    "https://www.paypal.com/ncp/payment/4GFTTGH38F4EC"
                  )
                }
                style={styles.donateButton}
              >
                <Text style={styles.donateButtonText}>
                  {t("تبرع الآن", "Donate Now")}
                </Text>
              </TouchableRipple>
            </View>
          </ImageBackground>
        </View>

        {/* ── Preferences ── */}
        <SectionLabel text={t("التفضيلات", "Preferences")} />
        <View style={styles.menuSection}>
          <MenuRow
            iconName="public"
            label={t("اللغات", "Languages")}
            onPress={() => router.push({ pathname: "/Languagues/" })}
          />
          <View style={styles.divider} />
          <MenuRow
            iconName="notifications-active"
            label={t("الإشعارات", "Notifications")}
            right={
              <Switch
                color={Colors.blue}
                value={notifOn}
                onValueChange={() => setNotifOn((v) => !v)}
              />
            }
          />
        </View>

        {/* ── About & Support ── */}
        <SectionLabel text={t("حول التطبيق والدعم", "About & Support")} />
        <View style={styles.menuSection}>
          <MenuRow
            iconName="star-rate"
            iconColor="#f4c430"
            iconBg="#2e2408"
            label={t("قيّم التطبيق", "Rate the App")}
            onPress={handleRate}
          />
          <View style={styles.divider} />
          <MenuRow
            iconName="mail-outline"
            iconColor="#4ec9b0"
            iconBg="#0c2622"
            label={t("تواصل معنا", "Contact Us")}
            onPress={() =>
              Linking.openURL("mailto:support@furqanapp.com?subject=Feedback")
            }
          />
          <View style={styles.divider} />
          <MenuRow
            iconName="privacy-tip"
            label={t("سياسة الخصوصية", "Privacy & Policy")}
            onPress={() => router.push({ pathname: "/Privacy/" })}
          />
          <View style={styles.divider} />
          <MenuRow
            iconName="fact-check"
            label={t("شروط الخدمة", "Terms & Conditions")}
            onPress={() => router.push({ pathname: "/Terms/" })}
          />
          <View style={styles.divider} />
          <MenuRow
            iconName="info-outline"
            label={t("إصدار التطبيق", "App Version")}
            right={
              <Text style={styles.versionBadge}>v{appVersion}</Text>
            }
          />
        </View>

        {/* ── Account ── */}
        <SectionLabel text={t("الحساب", "Account")} />
        <View style={styles.menuSection}>
          <MenuRow
            iconName="logout"
            iconColor="#e85d5d"
            iconBg="#2e0f0f"
            label={t("تسجيل الخروج", "Log Out")}
            onPress={() => setLogoutVisible(true)}
            right={null}
          />
        </View>

        {/* ── Danger Zone ── */}
        <View style={styles.dangerSection}>
          <TouchableRipple
            rippleColor="rgba(192,57,43,0.12)"
            style={styles.deleteBtn}
            onPress={() => setDeleteVisible(true)}
          >
            <View style={styles.deleteBtnInner}>
              <MaterialIcons name="delete-forever" size={20} color="#c0392b" />
              <Text style={styles.deleteBtnText}>
                {t("حذف الحساب", "Delete Account")}
              </Text>
            </View>
          </TouchableRipple>
        </View>

        {/* ── Footer ── */}
        <Text style={styles.footerText}>
          {t("تطبيق الفرقان", "Furqan App")} · v{appVersion}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { paddingBottom: 56 },

  /* header */
  header: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  /* profile */
  profileCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  profileCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 22, fontWeight: "700" },
  profileInfo: { flex: 1 },
  profileName: { color: "white", fontSize: 17, fontWeight: "600" },
  profileEmail: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    marginTop: 2,
  },
  profileEditHint: { color: Colors.blue, fontSize: 12, marginTop: 5 },

  /* donate card */
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 220,
  },
  imageBackground: { width: "100%", minHeight: 220 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,18,55,0.55)",
  },
  imageContent: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  logo: { width: 52, height: 52, marginBottom: 8 },
  supportText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  descriptionText: {
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  donateButton: {
    paddingHorizontal: 36,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
    borderRadius: 22,
    overflow: "hidden",
  },
  donateButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* section labels */
  sectionLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 8,
  },

  /* menu */
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  menuItem: { height: 60, justifyContent: "center" },
  menuInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: { fontSize: 16, color: "white", fontWeight: "500" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginLeft: 66,
  },
  versionBadge: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    fontWeight: "600",
  },

  /* danger zone */
  dangerSection: { marginHorizontal: 16, marginTop: 28 },
  deleteBtn: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.3)",
    backgroundColor: "rgba(192,57,43,0.07)",
  },
  deleteBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
  },
  deleteBtnText: { color: "#c0392b", fontSize: 15, fontWeight: "600" },

  /* footer */
  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.18)",
    fontSize: 12,
    marginTop: 32,
  },

  /* modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "82%",
    backgroundColor: "#1e2356",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  modalActions: { flexDirection: "row", gap: 12, width: "100%" },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  modalCancelText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    fontSize: 15,
  },
  modalConfirmBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  modalConfirmText: { color: "white", fontWeight: "700", fontSize: 15 },
});

export default Setting;