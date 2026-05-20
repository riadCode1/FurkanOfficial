import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Keyboard,
  Text,
  Modal,
  StyleSheet,
} from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import BottomBar from "@/components/BottomBar";
import { useGlobalContext } from "../../context/GlobalProvider";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { Colors } from "../../constants/Colors";

export default function Layout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showConnectedAlert, setShowConnectedAlert] = useState(false);
  const [showNoInternetAlert, setShowNoInternetAlert] = useState(false);

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
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const TAB_BAR_HEIGHT = isTablet ? 70 : 60;

  /* ==================== INTERNET CONNECTION ==================== */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = Boolean(state.isConnected && state.isInternetReachable);
      setIsConnected(connected);
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      const connected = Boolean(state.isConnected && state.isInternetReachable);
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  // Handle connection status changes
  useEffect(() => {
    if (isConnected === null) return;

    if (isConnected) {
      // Connected
      setShowNoInternetAlert(false);
      setShowConnectedAlert(true);
      setLoading(false);

      // Auto hide success alert after 2 seconds
      const timer = setTimeout(() => {
        setShowConnectedAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // No internet
      setShowConnectedAlert(false);
      setShowNoInternetAlert(true);
      setLoading(true);
    }
  }, [isConnected, setLoading]);

  /* ==================== KEYBOARD VISIBILITY ==================== */
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  /* ==================== TAB BAR OPTIONS ==================== */
  const screenOptions = {
    headerShown: false,
    tabBarLabelPosition: "below-icon" as const,
    tabBarActiveTintColor: Colors.blue,
    tabBarInactiveTintColor: Colors.textGray,
    tabBarLabelStyle: {
      fontSize: 12,
    },
    tabBarStyle: {
      display: isKeyboardVisible ? "none" : "flex",
      height: TAB_BAR_HEIGHT + insets.bottom,
      paddingBottom: insets.bottom,
      backgroundColor: Colors.barbottom,
      borderTopWidth: 0,
      position: "absolute" as const,
      elevation: 50,
    },
  };

  const tabTitles = {
    home: languages ? "الرئيسية" : "Home",
    search: languages ? "بحث" : "Search",
    library: languages ? "المكتبة" : "Library",
    settings: languages ? "الإعدادات" : "Settings",
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={screenOptions}>
        {/* Home */}
        <Tabs.Screen
          name="(Home)"
          options={{
            title: tabTitles.home,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />

        {/* Search */}
        <Tabs.Screen
          name="(Search)"
          options={{
            title: tabTitles.search,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="search" size={24} color={color} />
            ),
          }}
        />

        {/* Library */}
        <Tabs.Screen
          name="(Libraries)"
          options={{
            title: tabTitles.library,
            tabBarIcon: ({ color }) => (
              <Feather name="download" size={24} color={color} />
            ),
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="(Settings)"
          options={{
            title: tabTitles.settings,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Bottom Player */}
      {!isKeyboardVisible && track && (
        <BottomBar
          reciterAR={reciterAR}
          languages={languages}
          playing={isPlaying}
          setModalVisible={setModalVisible}
          idReader={idReader}
          pauseAudio={pauseAudio}
          chapterId={chapterId}
          arabicCH={arabicCH}
          name={reciter}
        />
      )}

      {/* Connected Alert */}
      <Modal
        transparent
        animationType="slide"
        visible={showConnectedAlert}
        onRequestClose={() => setShowConnectedAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successAlert}>
            <Text style={styles.alertMessage}>
              {languages ? "تم الاتصال بالإنترنت!" : "Connected!"}
            </Text>
          </View>
        </View>
      </Modal>

      {/* No Internet Alert */}
      <Modal
        transparent
        animationType="slide"
        visible={showNoInternetAlert}
        onRequestClose={() => setShowNoInternetAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.noInternetAlert}>
            <Text style={styles.alertMessage}>
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

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Better positioning for bottom alerts
    alignItems: "center",
  },
  successAlert: {
    width: "100%",
    height: 40,
    backgroundColor: "rgb(10, 190, 34)", // Green
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  noInternetAlert: {
    width: "100%",
    height: 40,
    backgroundColor: "rgb(31, 32, 31)", // Dark
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
});