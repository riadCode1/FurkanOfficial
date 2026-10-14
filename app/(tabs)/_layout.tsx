import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Tabs, useRouter, useSegments } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Feather, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Colors } from "../../constants/Colors";
import BottomBar from "@/components/BottomBar";

const TAB_HEIGHT = 72;
const TABS = [
  { name: "(Home)", title: "Home", arTitle: "الرئيسية", icon: Octicons, iconName: "home", href: "/(tabs)/(Home)/Index" },
  { name: "(Search)", title: "Search", arTitle: "بحث", icon: MaterialIcons, iconName: "search", href: "/(tabs)/(Search)/Searchs" },
  { name: "(Libraries)", title: "Library", arTitle: "المكتبة", icon: Feather, iconName: "bar-chart-2", href: "/(tabs)/(Libraries)/Library" },
  { name: "(Settings)", title: "Settings", arTitle: "الإعدادات", icon: Ionicons, iconName: "settings-outline", href: "/(tabs)/(Settings)/Setting" },
];

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { languages, track, reciterAR, reciter, idReader, chapterId, arabicCH, setModalVisible } = useGlobalContext();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [playerSheetOpen, setPlayerSheetOpen] = useState(false);
  const [barWidth, setBarWidth] = useState(Dimensions.get("window").width);
  const tabWidth = barWidth / TABS.length;
  const activeIndex = useSharedValue(0);

  const currentTab = TABS.find((tab) => (segments as string[]).includes(tab.name)) || TABS[0];
  const visualTabs = languages ? [...TABS].reverse() : TABS;
  const selectedIndex = visualTabs.findIndex((tab) => tab.name === currentTab.name);

  useEffect(() => {
    // Tab positions are fixed LTR in both languages; retarget on language
    // changes so the indicator never keeps an RTL-era position.
    activeIndex.value = withSpring(selectedIndex, { damping: 22, stiffness: 170 });
  }, [activeIndex, selectedIndex, languages]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const movingBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeIndex.value * tabWidth }],
  }), [tabWidth]);

  return (
    <View style={styles.root}>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
        {TABS.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} options={{ title: languages ? tab.arTitle : tab.title }} />
        ))}
        <Tabs.Screen name="Tasbeeh" options={{ href: null, title: languages ? "\u062a\u0633\u0628\u064a\u062d" : "Tasbeeh" }} />
        <Tabs.Screen name="Adhkar" options={{ href: null, title: languages ? "\u0627\u0644\u0623\u0630\u0643\u0627\u0631" : "Adhkar" }} />
      </Tabs>

      <LinearGradient
        pointerEvents="none"
        colors={["transparent", "rgba(0,0,0,0.72)", "rgba(0,0,0,0.96)"]}
        style={styles.bottomGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {!keyboardVisible && !playerSheetOpen && (
        <Animated.View
          onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
          style={[styles.tabBar, { bottom: insets.bottom }]}
        >
          <BlurView  intensity={92}  tint="dark" style={[StyleSheet.absoluteFill,styles.blurView]} />
          <View pointerEvents="none" style={styles.blurTint} />
          <Animated.View
            pointerEvents="none"
            style={[styles.movingBackground, { width: tabWidth - 12 }, movingBackgroundStyle]}
          />
          <View style={styles.tabsRow}>
            {visualTabs.map((tab, index) => {
              const isActive = selectedIndex === index;
              const Icon = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.name}
                  accessibilityRole="tab"
                  accessibilityLabel={languages ? tab.arTitle : tab.title}
                  accessibilityState={{ selected: isActive }}
                  activeOpacity={0.8}
                  style={styles.tabItem}
                  onPress={() => router.navigate(tab.href as never)}
                >
                  <Icon name={tab.iconName as never} size={24} color={isActive ? Colors.blue : Colors.textGray} />
                  <Text style={[styles.label, languages && styles.arabicLabel, isActive && styles.activeLabel]}>
                    {languages ? tab.arTitle : tab.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      {!keyboardVisible && track && (
=======
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

  // Animation values
  const activeIndex = useSharedValue(0);
  const opacity = useSharedValue(0); // for fade in

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const direction = languages ? -1 : 1;
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

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 400 }),
  }));

  // Fade in/out when keyboard shows/hides
  useAnimatedReaction(
    () => !isKeyboardVisible,
    (shouldShow) => {
      opacity.value = shouldShow ? 1 : 0;
    },
    [isKeyboardVisible]
  );

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

  /* -------------------- TAB PRESS -------------------- */
  const handleTabPress = (index: number, href: string) => {
    activeIndex.value = index;
    setActiveTab(index);
    router.replace(href as any);
  };

  return (
    <View style={{ flex: 1,position:"relative" }}>
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
        <LinearGradient
               colors={[
                 "transparent",
                 "rgba(0,0,0,1)",
                 "rgba(0,0,0,1)",
                 "rgba(0,0,0,1)",
               ]}
               style={{
                 width: width,
                 height: 100,
                 position: "absolute",
                 zIndex: 0,
                 bottom: -50,
               }}
               start={{ x: 0.5, y: 0 }}
               end={{ x: 0.5, y: 2 }}
             />
        

      {/* ---------------- RED BLURRED FLOATING TAB BAR ---------------- */}
      <Animated.View
        style={[
          styles.floatingContainer,
          { bottom: insets.bottom },
          animatedContainerStyle,
        ]}
      >
       
        {/* Base Blur */}
        <BlurView
          intensity={92}

          

          

          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        {/* Red Tint Overlay (this gives the red color to the blur) */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(71, 77, 88, 0.24)" } // ← Change this value to adjust red strength
          ]}
        />

        {/* Moving Selection Background */}
        <Animated.View
          style={[styles.movingBackground, animatedBackgroundStyle]}
        />

        {/* Tab Items */}
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
      </Animated.View>

      {/* ---------------- BOTTOM PLAYER ---------------- */}
      {!isKeyboardVisible && track && (
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        <BottomBar
          reciterAR={reciterAR}
          setModalVisible={setModalVisible}
          idReader={idReader}
          chapterId={chapterId}
          arabicCH={arabicCH}
          name={reciter}
<<<<<<< HEAD
          onSheetChange={setPlayerSheetOpen}
        />
      )}
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </View>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({
  root: { flex: 1 },
  bottomGradient: { position: "absolute", bottom: -30, left: 0, right: 0, height: 130 },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TAB_HEIGHT,
    marginVertical: 10,
    overflow: "hidden",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  blurTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(7, 20, 38, 0.5)" },
=======
/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 72,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginVertical: 10,
    overflow: "hidden",
  },

>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  movingBackground: {
    position: "absolute",
    top: 6,
    left: 6,
<<<<<<< HEAD
    height: 60,
    borderRadius: 50,
    backgroundColor: "#325350",
    opacity: 0.78,
  },
  blurView: { backgroundColor: "rgba(7, 20, 38, 0.5)", borderRadius: 50, overflow: "hidden" },
  tabsRow: {
    flex: 1,
    direction: "ltr",
    flexDirection: "row",
=======
    width: TAB_WIDTH - 12,
    height: 60,
    backgroundColor: "#325350",
    borderRadius: 50,
    opacity: 0.78,
  },

  tabsRow: {
    flexDirection: "row",
    flex: 1,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 2,
  },
<<<<<<< HEAD
  tabItem: { flex: 1, height: "100%", alignItems: "center", justifyContent: "center", paddingVertical: 8 },
  label: {
    color: Colors.textGray,
    fontSize: 10,
    fontWeight: "400",
    marginTop: 4,
    textAlign: "center",
  },
  activeLabel: { color: Colors.blue, fontWeight: "600" },
  arabicLabel: { writingDirection: "rtl" },
});
=======

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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
