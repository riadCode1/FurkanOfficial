import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MaterialIcons, Feather, Octicons, Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Colors } from "../../constants/Colors";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "@/components/BottomBar";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const NUM_TABS = 4;
const HORIZONTAL_MARGIN = 20;

const tabConfig = [
  { name: "(Home)", title: "Home", arTitle: "الرئيسية", icon: Octicons, iconName: "home", href: "/(tabs)/(Home)" },
  { name: "(Search)", title: "Search", arTitle: "بحث", icon: MaterialIcons, iconName: "search", href: "/(tabs)/(Search)" },
  { name: "(Libraries)", title: "Library", arTitle: "المكتبة", icon: Feather, iconName: "download", href: "/(tabs)/(Libraries)" },
  { name: "(Settings)", title: "Settings", arTitle: "الإعدادات", icon: Ionicons, iconName: "settings-outline", href: "/(tabs)/(Settings)" },
];

export default function Layout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const TAB_BAR_WIDTH = width - HORIZONTAL_MARGIN * 2;
  const TAB_WIDTH = TAB_BAR_WIDTH / NUM_TABS;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);

  const {
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

  const activeIndex = useSharedValue(0);
  const opacity = useSharedValue(1);

  /* ---------------- CURRENT TAB ---------------- */
  const currentTabIndex = useNavigationState((state) => {
    if (!state?.routes?.length) return 0;
    const tabRoute = state.routes[state.index || 0];
    return tabConfig.findIndex((tab) => tab.name === tabRoute?.name);
  });

 useEffect(() => {
  activeIndex.value = currentTabIndex >= 0 ? currentTabIndex : 0;
}, [currentTabIndex]);

  /* ---------------- ANIMATION ---------------- */
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const direction = languages ? -1 : 1;

    return {
      transform: [
        {
          translateX: direction * activeIndex.value * TAB_WIDTH,
        },
      ],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 250 }),
    transform: [
      {
        translateY: withTiming(opacity.value === 0 ? 40 : 0, {
          duration: 250,
        }),
      },
    ],
  }));

  /* ---------------- KEYBOARD ---------------- */
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      opacity.value = 0;
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      opacity.value = 1;
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ---------------- TAB PRESS ---------------- */
  const handleTabPress = (index: number, href: string) => {
    if (index === currentTabIndex) return; // prevent useless re-render
    router.replace(href as any);
  };

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

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
        {tabConfig.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{ title: languages ? tab.arTitle : tab.title }}
          />
        ))}
      </Tabs>

      {/* ---------------- TAB BAR ---------------- */}
      <Animated.View
        style={[
          styles.container,
          { bottom: insets.bottom + 8, width: TAB_BAR_WIDTH },
          animatedContainerStyle,
        ]}
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.redOverlay} />

        <LinearGradient
          colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.4)"]}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          style={[
            styles.activeBackground,
            { width: TAB_WIDTH - 12 },
            animatedBackgroundStyle,
          ]}
        />

        <View style={styles.row}>
          {tabConfig.map((tab, index) => {
            const isActive = currentTabIndex === index;

            return (
              <TouchableOpacity
                key={index}
                style={styles.tab}
                activeOpacity={0.7}
                onPress={() => handleTabPress(index, tab.href)}
              >
                <tab.icon
                  name={tab.iconName as any}
                  size={22}
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

      {/* ---------------- PLAYER ---------------- */}
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
      <Modal transparent visible={alertVisible}>
        <View style={styles.modal}>
          <View style={styles.success}>
            <Text style={styles.text}>
              {languages ? "تم الاتصال بالإنترنت!" : "Connected!"}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={alertVisible2}>
        <View style={styles.modal}>
          <View style={styles.error}>
            <Text style={[styles.text, { color: "gray" }]}>
              {languages ? "لا يوجد إنترنت!" : "No Internet!"}
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