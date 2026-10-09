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
import { BlurView } from "expo-blur";   // ← Added

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
    loading,
    setLoading,
    reciter,
    reciterAR,
    idReader,
    arabicCH,
    setModalVisible,
    isPlaying,
    languages,
    chapterId,
    pauseAudio,
    track,
  } = useGlobalContext();

  const insets = useSafeAreaInsets();

  const activeIndex = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const direction = languages ? -1 : 1; // RTL support

    return {
      transform: [
        {
          translateX: withSpring(direction * activeIndex.value * TAB_WIDTH, {
            damping: 22,
            stiffness: 170,
          }),
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
    router.replace(href as any);
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
            options={{
              title: languages ? tab.arTitle : tab.title,
            }}
          />
        ))}
      </Tabs>

      {/* ---------------- FLOATING BLURRED TAB BAR ---------------- */}
      {!isKeyboardVisible && (
        <View style={[styles.floatingContainer, { bottom: insets.bottom }]}>
          
          {/* Blur Background - This is the key change */}
          <BlurView
            intensity={50}           // 70-95 looks best for glass effect
            tint="dark"              // or 'light' or 'default'
            experimentalBlurMethod="dimezisBlurView" 
               // Adjust for performance vs. blur quality
                       // 'dark' | 'light' | 'default'
            style={StyleSheet.absoluteFill}   // covers the whole container
          />

          {/* Moving Highlight Background (kept on top of blur) */}
          <Animated.View
            style={[styles.movingBackground, animatedBackgroundStyle]}
          />

          {/* Tabs Content */}
          <View style={styles.tabsRow}>
            {tabConfig.map((tab, index) => {
              const isActive = activeTab === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.tabItem}
                  onPress={() => handleTabPress(index, tab.href)}
                  activeOpacity={0.8}
                >
                  <tab.icon
                    name={tab.iconName as any}
                    size={24}
                    color={isActive ? Colors.blue : Colors.textGray}
                  />

                  <Text
                    style={[
                      styles.label,
                      {
                        color: isActive ? Colors.blue : Colors.textGray,
                        fontWeight: isActive ? "600" : "400",
                      },
                    ]}
                  >
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
    left: 0,
    right: 0,
    height: 72,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderLeftColor:"rgba(255,255,255,0.25)",
    borderTopColor:"rgba(255,255,255,0.25)",
    marginVertical: 10,
    
    overflow: "hidden",
  },

  movingBackground: {
    position: "absolute",
    top: 6,
    left: 6,
    width: TAB_WIDTH - 12,
    height: 60,
    backgroundColor: "#325350",   // or Colors.blue with some opacity
    borderRadius: 50,
    opacity: 0.75,   // slightly transparent so blur shows through
  },

  tabsRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 2,   // important: above blur and moving background
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },

  label: {
    fontSize: 10,
    marginTop: 4,
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