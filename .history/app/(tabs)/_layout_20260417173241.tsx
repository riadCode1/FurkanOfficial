import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { MaterialIcons, Feather, Octicons, Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Colors } from "../../constants/Colors";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const NUM_TABS = 4;
const TAB_WIDTH = width / NUM_TABS;

const tabConfig = [
  { name: "(Home)", title: "Home", arTitle: "الرئيسية", icon: Octicons, iconName: "home", href: "/(tabs)/(Home)" },
  { name: "(Search)", title: "Search", arTitle: "بحث", icon: MaterialIcons, iconName: "search", href: "/(tabs)/(Search)" },
  { name: "(Libraries)", title: "Library", arTitle: "المكتبة", icon: Feather, iconName: "download", href: "/(tabs)/(Libraries)" },
  { name: "(Settings)", title: "Settings", arTitle: "الإعدادات", icon: Ionicons, iconName: "settings-outline", href: "/(tabs)/(Settings)" },
];

export default function Layout() {
  const router = useRouter();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    loading, setLoading, reciter, reciterAR, idReader, arabicCH,
    setModalVisible, isPlaying, languages, chapterId, pauseAudio, track,
  } = useGlobalContext();

  const insets = useSafeAreaInsets();

  // Reanimated
  const activeIndex = useSharedValue(0);

  const isRTL = languages === true; // assuming 'languages' true = Arabic/RTL

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const direction = isRTL ? -1 : 1;
    return {
      transform: [
        {
          translateX: withSpring(
            direction * activeIndex.value * TAB_WIDTH,
            { damping: 25, stiffness: 180 }
          ),
        },
      ],
    };
  });

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

  /* -------------------- TAB PRESS -------------------- */
  const handleTabPress = (index: number, href: string) => {
    activeIndex.value = index;
    setActiveTab(index);
    router.replace(href);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        {tabConfig.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{ title: languages ? tab.arTitle : tab.title }}
          />
        ))}
      </Tabs>

      {/* ---------------- FLOATING TAB BAR ---------------- */}
      {!isKeyboardVisible && (
        <View style={[styles.floatingContainer, { bottom: insets.bottom + 8 }]}>
          {/* Moving Highlight Background (only for active tab) */}
          <Animated.View style={[styles.movingBackground, animatedBackgroundStyle]} />

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {tabConfig.map((tab, index) => {
              const isActive = activeTab === index;
              const IconComponent = tab.icon;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.tabItem}
                  onPress={() => handleTabPress(index, tab.href)}
                  activeOpacity={0.7}
                >
                  <IconComponent
                    name={tab.iconName as any}
                    size={isActive ? 28 : 24}
                    color={isActive ? Colors.blue : Colors.textGray}
                  />
                  {isActive && (
                    <Text
                      style={[
                        styles.label,
                        { color: Colors.blue, fontWeight: "600" },
                      ]}
                    >
                      {languages ? tab.arTitle : tab.title}
                    </Text>
                  )}
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
          chapterId={chapterId}
          arabicCH={arabicCH}
          name={reciter}
        />
      )}

      {/* ---------------- ALERTS ---------------- */}
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
    height: 72,
    backgroundColor: "rgba(56,52,68,0.95)", // Slightly more opaque
    borderRadius: 999, // Fully rounded pill shape
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  movingBackground: {
    position: "absolute",
    top: 6,
    left: 6,
    width: TAB_WIDTH - 12,
    height: 60,
    backgroundColor: "#325350", // Teal/green-ish like your screenshot
    borderRadius: 999,
  },

  tabsRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 2,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  label: {
    fontSize: 10.5,
    marginTop: 3,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  alertBox: {
    width: "100%",
    height: 34,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgb(10,190,34)",
    alignItems: "center",
    justifyContent: "center",
  },

  alertMessage: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
});