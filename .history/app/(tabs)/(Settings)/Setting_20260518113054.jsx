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

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Switch, TouchableRipple } from "react-native-paper";
import { Colors } from "../../../constants/Colors";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { useAuth } from "../../../hooks/useAuth";

const Setting = () => {
  const { languages } = useGlobalContext();
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const { session, profile } = useAuth();

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const initial = profile?.username?.[0]?.toUpperCase() || "G";
  const username = profile?.username || (languages ? "ضيف" : "Guest");
  const email = session?.user?.email || "";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#191845" />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {languages ? "الإعدادات" : "Settings"}
          </Text>
        </View>

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{username}</Text>
            {!!email && <Text style={styles.profileEmail}>{email}</Text>}
          </View>
        </View>

        {/* ── Support / Donate Card ── */}
        <View style={styles.card}>
          <ImageBackground
            resizeMode="cover"
            source={require("../../../assets/images/SplashIndex.png")}
            style={styles.imageBackground}
          >
            {/* subtle dark overlay for readability */}
            <View style={styles.cardOverlay} />

            <View style={styles.imageContent}>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={require("../../../assets/images/Logo.png")}
              />
              <Text style={styles.supportText}>
                {languages ? "ادعمنا" : "Support Us"}
              </Text>
              <Text style={styles.descriptionText}>
                {languages
                  ? "تم إنشاء تطبيق الفرقان ليتم استخدامه بالكامل مجانًا خالية تماما من الإعلانات، يمكنك دعم عملنا من خلال التبرعات"
                  : "Furqan App is completely free with zero ads. Support our work through a donation."}
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
                  {languages ? "تبرع الآن" : "Donate Now"}
                </Text>
              </TouchableRipple>
            </View>
          </ImageBackground>
        </View>

        {/* ── Menu Section ── */}
        <View style={styles.menuSection}>
          {/* Languages */}
          <TouchableRipple
            rippleColor="rgba(200, 200, 200, 0.08)"
            style={styles.menuItem}
            onPress={() => router.push({ pathname: `/Languagues/` })}
          >
            <View style={styles.menuInner}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: "#2a3a6e" }]}>
                  <MaterialIcons name="public" size={20} color="#5b8dee" />
                </View>
                <Text style={styles.menuText}>
                  {languages ? "اللغات" : "Languages"}
                </Text>
              </View>
              <MaterialIcons
                size={22}
                name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
                color="#5b7ab5"
              />
            </View>
          </TouchableRipple>

          <View style={styles.divider} />

          {/* Notifications */}
          <View style={styles.menuItem}>
            <View style={styles.menuInner}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: "#2a3a6e" }]}>
                  <MaterialIcons
                    name="notifications-active"
                    size={20}
                    color="#5b8dee"
                  />
                </View>
                <Text style={styles.menuText}>
                  {languages ? "الإشعارات" : "Notifications"}
                </Text>
              </View>
              <Switch
                color={Colors.blue}
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Privacy */}
          <TouchableRipple
            rippleColor="rgba(200, 200, 200, 0.08)"
            style={styles.menuItem}
            onPress={() => router.push({ pathname: `/Privacy/` })}
          >
            <View style={styles.menuInner}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: "#2a3a6e" }]}>
                  <MaterialIcons name="privacy-tip" size={20} color="#5b8dee" />
                </View>
                <Text style={styles.menuText}>
                  {languages ? "سياسة الخصوصية" : "Privacy & Policy"}
                </Text>
              </View>
              <MaterialIcons
                size={22}
                name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
                color="#5b7ab5"
              />
            </View>
          </TouchableRipple>

          <View style={styles.divider} />

          {/* Terms */}
          <TouchableRipple
            rippleColor="rgba(200, 200, 200, 0.08)"
            style={styles.menuItem}
            onPress={() => router.push({ pathname: `/Terms/` })}
          >
            <View style={styles.menuInner}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: "#2a3a6e" }]}>
                  <MaterialIcons name="fact-check" size={20} color="#5b8dee" />
                </View>
                <Text style={styles.menuText}>
                  {languages ? "شروط الخدمة" : "Terms & Conditions"}
                </Text>
              </View>
              <MaterialIcons
                size={22}
                name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
                color="#5b7ab5"
              />
            </View>
          </TouchableRipple>
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
  scrollView: {
    paddingBottom: 48,
  },

  /* ── Header ── */
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

  /* ── Profile Card ── */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 4,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  profileEmail: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    marginTop: 2,
  },

  /* ── Donate Card ── */
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 220,
  },
  imageBackground: {
    width: "100%",
    minHeight: 220,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 18, 55, 0.55)",
  },
  imageContent: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  logo: {
    width: 52,
    height: 52,
    marginBottom: 8,
  },
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

  /* ── Menu Section ── */
  menuSection: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  menuItem: {
    height: 60,
    justifyContent: "center",
  },
  menuInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginLeft: 66,
  },
});

export default Setting;