import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Tabs } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { MaterialIcons, Feather, Octicons, Ionicons } from "@expo/vector-icons";
import BottomBar from "@/components/BottomBar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Colors } from "../../constants/Colors";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

const { width } = Dimensions.get("window");
const NUM_TABS = 4;
const TAB_WIDTH = width / NUM_TABS;

const tabConfig = [
  { name: "(Home)", title: "Home", arTitle: "الرئيسية", icon: Octicons, iconName: "home" },
  { name: "(Search)", title: "Search", arTitle: "بحث", icon: MaterialIcons, iconName: "search" },
  { name: "(Libraries)", title: "Library", arTitle: "المكتبة", icon: Feather, iconName: "download" },
  { name: "(Settings)", title: "Settings", arTitle: "الإعدادات", icon: Ionicons, iconName: "settings-outline" },
];

export default function Layout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);

  const {
    loading,
    setLoading,
    reciter,
    reciterAR,
    idReader,
    arabicCH,
    setModalVisible,
    track,
    languages, // assuming this toggles Arabic/English
  } = useGlobalContext();

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const isTablet = screenWidth >= 768;
  const TAB_BAR_HEIGHT = isTablet ? 75 : 65;

  // Reanimated: Moving Indicator
  const indicatorPosition = useSharedValue(0);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(indicatorPosition.value, { damping: 25, stiffness: 180 }) }],
  }));

  /* -------------------- INTERNET STATUS -------------------- */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected && state.isInternetReachable));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected === null) return;
    if (isConnected) {
      setLoading(false);
      setAlertVisible2(false);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 2000);
    } else {
      setAlertVisible2(true);
      setLoading(true);
    }
  }, [isConnected]);

  /* -------------------- KEYBOARD -------------------- */
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // Hide default tab bar
        }}
      >
        {tabConfig.map((tab, index) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: languages ? tab.arTitle : tab.title,
              tabBarIcon: ({ color }) => {
                const IconComponent = tab.icon;
                return <IconComponent name={tab.iconName} size={24} color={color} />;
              },
            }}
          />
        ))}
      </Tabs>

      {/* ==================== CUSTOM FLOATING ANIMATED TAB BAR ==================== */}
      {!isKeyboardVisible && (
        <View style={[styles.floatingContainer, { bottom: insets.bottom + 12 }]}>
          {/* Moving Indicator (Pill) */}
          <Animated.View
            style={[
              styles.indicator,
              animatedIndicatorStyle,
              { width: TAB_WIDTH * 0.65 }, // pill width
            ]}
          />

          {/* Tab Items */}
          <View style={styles.tabsRow}>
            {tabConfig.map((tab, index) => {
              const isActive = /* Expo Router doesn't expose state easily here, so we use a simple trick or better use expo-router/ui for full control */
              // For now we use a basic version. See note below for better approach.
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.tabItem}
                  onPress={() => {
                    indicatorPosition.value = index * TAB_WIDTH;
                    // Navigate using Expo Router (recommended way)
                    // You can use router.push or Link, but for tabs better to use a ref or expo-router/ui
                  }}
                  activeOpacity={0.7}
                >
                  <tab.icon
                    name={tab.iconName}
                    size={26}
                    color={/* isActive ? Colors.blue : Colors.textGray */ Colors.textGray}
                  />
                  <Text style={[styles.label, /* isActive && styles.labelActive */]}>
                    {languages ? tab.arTitle : tab.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ---------------- BOTTOM PLAYER ---------------- */}
      {!isKeyboardVisible && track && (
        <BottomBar
          reciterAR={reciterAR}
          setModalVisible={setModalVisible}
          idReader={idReader}
          chapterId={arabicCH} // fixed typo in original?
          arabicCH={arabicCH}
          name={reciter}
        />
      )}

      {/* ---------------- ALERT MODALS ---------------- */}
      <Modal transparent animationType="slide" visible={alertVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertMessage}>
              {languages ? "تم الاتصال بالإنترنت!" : "Connected!"}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={alertVisible2}>
        <View style={styles.modalOverlay}>
          <View style={[styles.alertBox, { backgroundColor: "rgb(31,32,31)" }]}>
            <Text style={[styles.alertMessage, { color: "gray" }]}>
              {languages ? "لا يتوفر اتصال بالإنترنت!" : "No Internet Connection!"}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 68,
    backgroundColor: Colors.barbottom,
    borderRadius: 999, // fully rounded floating look
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    paddingHorizontal: 8,
  },
  tabsRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 6,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    color: Colors.textGray,
  },
  indicator: {
    position: "absolute",
    bottom: 8,
    height: 5,
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "100%",
    height: 30,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgb(10,190,34)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});