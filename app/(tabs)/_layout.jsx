import {
  View,
  Keyboard,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import BottomBar from "@/components/BottomBar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { Colors } from "../../constants/Colors";
import NetInfo from "@react-native-community/netinfo";
import { TouchableRipple } from "react-native-paper";


export default function Layout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const { loading, setloading } = useGlobalContext();

  

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Check both connection status and internet reachability
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
    if (isConnected) {
      setloading(false);
      setAlertVisible2(false);
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    } else {
      setAlertVisible2(true);
      setloading(true);
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isConnected]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const {
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

  console.log(track);
  return (
    <View style={{ flex: 1 }}>
      {/* Tabs Component */}
      <Tabs
        screenOptions={{
          tabBarLabelPosition: "below-icon",
          tabBarActiveTintColor: Colors.blue,
          tabBarInactiveTintColor: Colors.textTab,
          tabBarLabelStyle: {
            fontSize: 12,
            // Use your custom font
          },
          headerShown: false,

          tabBarStyle: {
            display: isKeyboardVisible ? "none" : "flex",
            height: 74,
            position: "absolute",
            alignItems: "center",
            borderTopWidth: 0,
            elevation: 50,

            flex: 1,
            backgroundColor: Colors.barbottom,
          },
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="(Home)"
          options={{
            title: languages ? "الرئيسية" : "Home",
            tabBarButton: (props) => {
              const focused = props.accessibilityState?.selected;
              return (
                <TouchableRipple
                  {...props}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    props.onPress();
                  }}
                  rippleColor={Colors.ripple} // Custom ripple color
                >
                  <>
                    <MaterialIcons
                      name="home"
                      size={24}
                      color={focused ? Colors.blue : Colors.textTab}
                    />
                    <Text
                      style={{
                        color: focused ? Colors.blue : Colors.textTab,
                        fontSize: 12,
                      }}
                    >
                      {languages ? "الرئيسية" : "Home"}
                    </Text>
                  </>
                </TouchableRipple>
              );
            },
          }}
        />

        {/* Search Tab */}
        <Tabs.Screen
          name="(Search)"
          options={{
            title: languages ? "بحث" : "Search",
            tabBarButton: (props) => {
              const focused = props.accessibilityState?.selected;
              return (
                <TouchableRipple
                  {...props}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    props.onPress();
                  }}
                  rippleColor={Colors.ripple} // Custom ripple color
                >
                  <>
                    <MaterialIcons
                      name="search"
                      size={24}
                      color={focused ? Colors.blue : Colors.textTab}
                    />
                    <Text
                      style={{
                        color: focused ? Colors.blue : Colors.textTab,
                        fontSize: 12,
                      }}
                    >
                      {languages ? "بحث" : "Search"}
                    </Text>
                  </>
                </TouchableRipple>
              );
            },
          }}
        />

        {/* Library Tab */}
        <Tabs.Screen
          name="(Libraries)"
          options={{
            title: languages ? "المكتبة" : "Library",
            tabBarButton: (props) => {
              const focused = props.accessibilityState?.selected;
              return (
                <TouchableRipple
                  {...props}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    props.onPress();
                  }}
                  rippleColor={Colors.ripple} // Custom ripple color
                >
                  <>
                    <Feather
                      name="download"
                      size={24}
                      color={focused ? Colors.blue : Colors.textTab}
                    />
                    <Text
                      style={{
                        color: focused ? Colors.blue : Colors.textTab,
                        fontSize: 12,
                      }}
                    >
                      {languages ? "المكتبة" : "Library"}
                    </Text>
                  </>
                </TouchableRipple>
              );
            },
          }}
        />

        {/* Settings Tab */}
        <Tabs.Screen
          name="(Settings)"
          options={{
            title: languages ? "الإعدادات" : "Settings",
            tabBarButton: (props) => {
              const focused = props.accessibilityState?.selected;
              return (
                <TouchableRipple
                  {...props}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    props.onPress();
                  }}
                  rippleColor={Colors.ripple} // Custom ripple color
                >
                  <>
                    <MaterialIcons
                      name="settings"
                      size={24}
                      color={focused ? Colors.blue : Colors.textTab}
                    />
                    <Text
                      style={{
                        color: focused ? Colors.blue : Colors.textTab,
                        fontSize: 12,
                      }}
                    >
                      {languages ? "الإعدادات" : "Settings"}
                    </Text>
                  </>
                </TouchableRipple>
              );
            },
          }}
        />
      </Tabs>

      {/* Component on top of Tabs */}

      {isKeyboardVisible ? (
        ""
      ) : (
        <>
          {track ? (
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
          ) : (
            ""
          )}

          {/*Alert modal */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={alertVisible}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.alertBox}>
                <Text style={styles.alertMessage}>Connected !</Text>
              </View>
            </View>
          </Modal>

          {/*Alert modal2 */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={alertVisible2}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.alertBox,
                  { backgroundColor: "rgb(31, 32, 31)" },
                ]}
              >
                <Text style={[styles.alertMessage, { color: "gray" }]}>
                  No Internet Connection !
                </Text>
              </View>
            </View>
          </Modal>

        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  alertBox: {
    width: "100%",
    backgroundColor: "rgb(10, 190, 34)",
    height: 30,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  alertMessage: {
    fontSize: 16,
    color: "white",

    textAlign: "center",
  },
  closeButton: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

 
});
