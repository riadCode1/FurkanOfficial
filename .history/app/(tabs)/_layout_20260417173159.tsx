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
import BottomBar from "@/components/BottomBar";

const { width } = Dimensions.get("window");
const NUM_TABS = 4;
const TAB_WIDTH = (width - 40) / NUM_TABS; // margin applied

const tabConfig = [
  { name: "(Home)", title: "Home", arTitle: "الرئيسية", icon: Octicons, iconName: "home", href: "/(tabs)/(Home)" },
  { name: "(Search)", title: "Search", arTitle: "بحث", icon: MaterialIcons, iconName: "search", href: "/(tabs)/(Search)" },
  { name: "(Libraries)", title: "Library", arTitle: "المكتبة", icon: Feather, iconName: "download", href: "/(tabs)/(Libraries)" },
  { name: "(Settings)", title: "Settings", arTitle: "الإعدادات", icon: Ionicons, iconName: "settings-outline", href: "/(tabs)/(Settings)" },
];

export default function Layout() {
  const router = useRouter();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    loading,
    setLoading,
    reciter,
    reciterAR,
    idReader,
    arabicCH,
    setModalVisible,
    languages,
    chapterId,
    track,
  } = useGlobalContext();

  const insets = useSafeAreaInsets();

  // 🎯 Animation value
  const activeIndex = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const direction = languages ? -1 : 1;

    return {
      width: withSpring(TAB_WIDTH * 1.6),
      transform: [
        {
          translateX: withSpring(direction * activeIndex.value * TAB_WIDTH, {
            damping: 20,
            stiffness: 180,
          }),
        },
      ],
    };
  });

  /* ---------------- INTERNET ---------------- */
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

  /* ---------------- KEYBOARD ---------------- */
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ---------------- TAB PRESS ---------------- */
  const handleTabPress = (index, href) => {
    activeIndex.value = index;
    setActiveTab(index);
    router.replace(href);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ---------------- SCREENS ---------------- */}
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
            options={{
              title: languages ? tab.arTitle : tab.title,
            }}
          />
        ))}
      </Tabs>

      {/* ---------------- FLOATING TAB BAR ---------------- */}
      {!isKeyboardVisible && (
        <View style={[styles.floatingContainer, { bottom: insets.bottom + 10 }]}>
          {/* Animated pill */}
          <Animated.View
            style={[styles.movingBackground, animatedBackgroundStyle]}
          />

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {tabConfig.map((tab, index) => {
              const isActive = activeTab === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tabItem,
                    isActive && styles.activeTabItem,
                  ]}
                  onPress={() => handleTabPress(index, tab.href)}
                  activeOpacity={0.8}
                >
                  <tab.icon
                    name={tab.iconName}
                    size={22}
                    color={isActive ? Colors.blue : Colors.textGray}
                  />

                  {isActive && (
                    <Text style={styles.activeLabel}>
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
          <View
            style={[styles.alertBox, { backgroundColor: "rgb(31,32,31)" }]}
          >
            <Text style={[styles.alertMessage, { color: "gray" }]}>
              {languages
                ? "لا يتوفر اتصال بالإنترنت!"
                : "No Internet Connection!"}
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
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "rgba(56,52,68,0.9)",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  movingBackground: {
    position: "absolute",
    top: 5,
    left: 5,
    height: 60,
    backgroundColor: "#325350",
    borderRadius: 30,
  },

  tabsRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  activeLabel: {
    fontSize: 13,
    color: Colors.blue,
    fontWeight: "600",
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
  },

  alertMessage: {
    fontSize: 14,
    color: "white",
  },
});