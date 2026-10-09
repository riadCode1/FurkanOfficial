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
          translateX: withSpring(direction * activeIndex.value * TAB_WIDTH+6, {
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

      {/* ---------------- RED BLURRED FLOATING TAB BAR ---------------- */}
      <Animated.View
        style={[
          styles.redOverlay,
          { bottom: insets.bottom },
          animatedContainerStyle,
        ]}
      >
         <LinearGradient
               colors={[
                 "transparent",
                 "rgba(17,18,35,0.5)",
                 "rgba(17,18,35,1)",
                 "rgba(17,18,35,1)",
               ]}
               style={{
                 width: width,
                 height: 150,
                 position: "absolute",
                 zIndex: 1,
                 bottom: -10,
               }}
               start={{ x: 0.5, y: 0 }}
               end={{ x: 0.5, y: 2 }}
             />
        {/* Base Blur */}
        <BlurView
          intensity={92}
          experimentalBlurMethod="dimezisBlurView"
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
          style={[styles.activeBackground, animatedBackgroundStyle]}
        />

        {/* Tab Items */}
        <View style={styles.row}>
          {tabConfig.map((tab, index) => {
            const isActive = activeTab === index;

            return (
              <TouchableOpacity
                key={index}
                style={styles.tab}
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
        <View style={styles.modal}>
          <View style={styles.success}>
            <Text style={styles.text}>
              {languages ? "تم الاتصال بالإنترنت!" : "Connected!"}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={alertVisible2}>
        <View style={styles.modal}>
          <View style={[styles.error, { backgroundColor: "rgb(31,32,31)" }]}>
            <Text style={[styles.text, { color: "gray" }]}>
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
  container: {
    position: "absolute",
    alignSelf: "center",
    height: 70,
    borderRadius: 50,
    overflow: "hidden",
  },

  redOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(220,30,30,0.25)",
  },

  activeBackground: {
    position: "absolute",
    top: 6,
    left: 6,
    height: 58,
    backgroundColor: "#325350",
    borderRadius: 40,
    opacity: 0.8,
  },

  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  label: {
    fontSize: 10,
    marginTop: 3,
  },

  modal: {
    flex: 1,
    justifyContent: "flex-end",
  },

  success: {
    height: 30,
    backgroundColor: "rgb(10,190,34)",
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    height: 30,
    backgroundColor: "rgb(31,32,31)",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 13,
    color: "#fff",
  },
});