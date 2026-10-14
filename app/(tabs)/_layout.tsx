import React, { useEffect, useState } from "react";
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
        <BottomBar
          reciterAR={reciterAR}
          setModalVisible={setModalVisible}
          idReader={idReader}
          chapterId={chapterId}
          arabicCH={arabicCH}
          name={reciter}
          onSheetChange={setPlayerSheetOpen}
        />
      )}
    </View>
  );
}

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
  movingBackground: {
    position: "absolute",
    top: 6,
    left: 6,
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
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 2,
  },
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
