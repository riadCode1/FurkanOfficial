import {
  View,
  Keyboard,
  Text,
  Modal,
  StyleSheet,
} from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons, Feather, Octicons, Ionicons } from "@expo/vector-icons";
import BottomBar from "@/components/BottomBar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import React from "react";

export default function Layout() {
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

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabelPosition: "below-icon",
          tabBarActiveTintColor: Colors.blue,
          tabBarInactiveTintColor: Colors.textGray,
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarStyle: {
            display: isKeyboardVisible ? "none" : "flex",
            height: TAB_BAR_HEIGHT + insets.bottom,
            paddingVertical: 10,
            backgroundColor: Colors.barbottom,
            
            position: "absolute",
            elevation: 50,
          },
        }}
      >
        {/* ---------------- HOME ---------------- */}
        <Tabs.Screen
          name="(Home)"
          
          options={{
            
            title: languages ? "الرئيسية" : "Home",
            tabBarIcon: ({ color }) => (
              
              <Octicons name="home" size={24} color={color} />
            ),
          }}
        />

        {/* ---------------- SEARCH ---------------- */}
        <Tabs.Screen
          name="(Search)"
          
          options={{
            title: languages ? "بحث" : "Search",
            
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="search" size={24} color={color} />
            ),
          }}
        />

        {/* ---------------- LIBRARY ---------------- */}
        <Tabs.Screen
          name="(Libraries)"
          options={{
            title: languages ? "المكتبة" : "Library",
            tabBarIcon: ({ color }) => (
              <Feather name="download" size={24} color={color} />
            ),
          }}
        />

        {/* ---------------- SETTINGS ---------------- */}
        <Tabs.Screen
          name="(Settings)"
          options={{
            title: languages ? "الإعدادات" : "Settings",
            tabBarIcon: ({ color }) => (
              

              <Ionicons name="settings-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

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

      {/* ---------------- CONNECTED ALERT ---------------- */}
      <Modal transparent animationType="slide" visible={alertVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertMessage}>
              {languages ? "تم الاتصال بالإنترنت!" : "Connected!"}
            </Text>
          </View>
        </View>
      </Modal>

      {/* ---------------- NO INTERNET ALERT ---------------- */}
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
    elevation: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});
