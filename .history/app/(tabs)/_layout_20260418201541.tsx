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
import { useNavigationState } from "@react-navigation/native";   // ← Best for tabs
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";
import { MaterialIcons, Feather, Octicons, Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Colors } from "../../constants/Colors";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "@/components/BottomBar";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

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
  const insets = useSafeAreaInsets();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);

  const {
    loading, setLoading, reciter, reciterAR, idReader,
    arabicCH, setModalVisible, languages, chapterId, track,
  } = useGlobalContext();

  // Animation values
  const activeIndex = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Get current tab index from React Navigation state (most reliable)
  const currentTabIndex = useNavigationState((state) => {
    if (!state?.routes?.length) return 0;
    // Find the index of the currently focused tab route
    const tabRoute = state.routes[state.index || 0];
    const tabName = tabRoute?.name || "";
    
    return tabConfig.findIndex(tab => tab.name === tabName);
  });

  // Sync active tab whenever navigation state changes
  useEffect(() => {
    const index = currentTabIndex >= 0 ? currentTabIndex : 0;
    activeIndex.value = index;
    // No need for separate activeTab state anymore
  }, [currentTabIndex]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(
          (languages ? -1 : 1) * activeIndex.value * TAB_WIDTH,
          { damping: 22, stiffness: 170 }
        ),
      },
    ],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 400 }),
  }));

  useAnimatedReaction(
    () => !isKeyboardVisible,
    (shouldShow) => { opacity.value = shouldShow ? 1 : 0; },
    [isKeyboardVisible]
  );

  /* -------------------- KEYBOARD -------------------- */
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  /* -------------------- TAB PRESS -------------------- */
  const handleTabPress = (index: number, href: string) => {
    activeIndex.value = index;
    router.replace(href as any);
  };

  /* -------------------- INTERNET + OTHER EFFECTS (unchanged) -------------------- */
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

      {/* ---------------- RED BLURRED TAB BAR ---------------- */}
      <Animated.View
        style={[
          styles.floatingContainer,
          { bottom: insets.bottom },
          animatedContainerStyle,
        ]}
      >
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(220, 30, 30, 0.32)" }]} />

        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.25)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        <Animated.View style={[styles.movingBackground, animatedBackgroundStyle]} />

        <View style={styles.tabsRow}>
          {tabConfig.map((tab, index) => {
            const isActive = currentTabIndex === index;

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
                    { color: isActive ? Colors.blue : Colors.textGray, fontWeight: isActive ? "600" : "400" },
                  ]}
                >
                  {languages ? tab.arTitle : tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Player + Alerts (unchanged) */}
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

      {/* Your alert modals here... */}
      {/* ... (keep the same Modal code as before) */}
    </View>
  );
}

/* ---------------- STYLES (same as before) ---------------- */
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 72,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginVertical: 10,
    overflow: "hidden",
  },
  movingBackground: {
    position: "absolute",
    top: 6,
    left: 6,
    width: TAB_WIDTH - 12,
    height: 60,
    backgroundColor: "#325350",
    borderRadius: 50,
    opacity: 0.75,
  },
  tabsRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 2,
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
  // modalOverlay, alertBox, alertMessage styles...
});