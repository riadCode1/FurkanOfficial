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
import { BlurView } from "expo-blur";           // ← Added
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
    setModalVisible, languages, chapterId, track,
  } = useGlobalContext();

  const insets = useSafeAreaInsets();

  const activeIndex = useSharedValue(0);
  const isRTL = languages === true;

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

  /* -------------------- INTERNET & KEYBOARD (unchanged) -------------------- */
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

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

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

      {/* ---------------- FLOATING BLURRED TAB BAR ---------------- */}
      {!isKeyboardVisible && (
        <View style={[styles.floatingContainer, { bottom: insets.bottom + 8 }]}>
          
          {/* Blur Background */}
          <BlurView
            intensity={80}           // 60–90 gives nice glass effect
            tint="dark"              // "dark", "light", or "default"
            style={StyleSheet.absoluteFill}
          />

          {/* Moving Highlight */}
          <Animated.View style={[styles.movingBackground, animatedBackgroundStyle]} />

          {/* Tabs Content */}
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

      {/* Bottom Player & Alerts (unchanged) */}
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

      {/* Your existing alert modals */}
      {/* ... (keep them as they are) */}
    </View>
  );
}

/* ---------------- UPDATED STYLES ---------------- */
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 999,           // perfect pill shape
    overflow: "hidden",          // important for blur
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  // BlurView covers the whole container
  // No backgroundColor needed here anymore

  movingBackground: {
    position: "absolute",
    top: 6,
    left: 6,
    width: TAB_WIDTH - 12,
    height: 60,
    backgroundColor: "rgba(50, 83, 80, 0.85)", // slightly transparent teal
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

  // Your modal styles remain the same...
  modalOverlay: { /* ... */ },
  alertBox: { /* ... */ },
  alertMessage: { /* ... */ },
});