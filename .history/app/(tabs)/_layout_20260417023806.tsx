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
import { Tabs, useRouter } from "expo-router";   // ← Added useRouter
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
  { name: "(Home)", title: "Home", arTitle: "الرئيسية", icon: Octicons, iconName: "home", href: "/(tabs)/(Home)" },
  { name: "(Search)", title: "Search", arTitle: "بحث", icon: MaterialIcons, iconName: "search", href: "/(tabs)/(Search)" },
  { name: "(Libraries)", title: "Library", arTitle: "المكتبة", icon: Feather, iconName: "download", href: "/(tabs)/(Libraries)" },
  { name: "(Settings)", title: "Settings", arTitle: "الإعدادات", icon: Ionicons, iconName: "settings-outline", href: "/(tabs)/(Settings)" },
];

export default function Layout() {
  const router = useRouter();   // ← This is the key to fix navigation

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
    languages,
  } = useGlobalContext();

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // Reanimated moving background
  const activeIndex = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(activeIndex.value * TAB_WIDTH, { damping: 22, stiffness: 170 }) }],
  }));

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
    activeIndex.value = index;           // Move the background
    router.replace(href);                // ← This actually changes the tab screen
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
              tabBarIcon: ({ color }) => {
                const IconComponent = tab.icon;
                return <IconComponent name={tab.iconName as any} size={24} color={color} />;
              },
            }}
          />
        ))}
      </Tabs>

      {/* CUSTOM FLOATING TAB BAR WITH MOVING BACKGROUND */}
      {!isKeyboardVisible && (
        <View style={[styles.floatingContainer, { bottom: insets.bottom + 12 }]}>
          <Animated.View style={[styles.movingBackground, animatedBackgroundStyle]} />

          <View style={styles.tabsRow}>
            {tabConfig.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tabItem}
                onPress={() => handleTabPress(index, tab.href)}
                activeOpacity={0.8}
              >
                <tab.icon
                  name={tab.iconName as any}
                  size={26}
                  color={Colors.textGray}
                />
                <Text style={styles.label}>
                  {languages ? tab.arTitle : tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* BOTTOM PLAYER */}
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

      {/* ALERT MODALS (unchanged) */}
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

/* STYLES */
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 1,
    right: 1,
    height: 72,
    backgroundColor: Colors.barbottom,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 25,
    elevation: 20,
    overflow: "hidden",
  },
  movingBackground: {
    position: "absolute",
    top: 0,
    left: 6,
    width: TAB_WIDTH - 12,
    height: 60,
    backgroundColor: Colors.blue,
    borderRadius: 999,
  },
  tabsRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  label: {
    fontSize: 10,
    
    color: Colors.textGray,
  },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  alertBox: {
    width: "100%",
    height: 30,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgb(10,190,34)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertMessage: { fontSize: 14, color: "white" },
});