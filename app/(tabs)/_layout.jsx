import { View, StyleSheet, Keyboard, Text, } from "react-native";
import { Tabs } from "expo-router";
import { Octicons, AntDesign } from "@expo/vector-icons";
import BottomBar from "@/components/BottomBar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import Blur from "../../components/Blur";


export default function Layout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  

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
  } = useGlobalContext();
  return (
    <View style={{ flex: 1 }}>
      {/* Tabs Component */}
      <Tabs
      
        screenOptions={{
          
          headerShown: false,
          tabBarStyle: {
            display: isKeyboardVisible ? "none" : "flex",
            height: 74,
            position: "absolute",
            alignItems:"center",
            borderTopWidth: 1,
            borderTopColor: "#00D1FF",
            elevation: 0,
            paddingTop:10,
            flex:1,
            backgroundColor:"rgba(0,0,0,0.8)",
      
           
            
            
          },
          tabBarBackground: () => (
     <Blur/>
    ),
          
             
         }}
      >
        <Tabs.Screen
          name="(Home)"
          options={{
            title: languages?"الرئيسية":"Home",
            tabBarIcon: ({ color, focused }) => (
              <Octicons
                name="home"
                size={24}
                color={focused ? "#00D1FF" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            title: languages?" بحث":"Search",
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                size={24}
                name="search1"
                color={focused ? "#00D1FF" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(Libraries)"
          options={{
            title: languages?"المكتبة":"Library",
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                size={24}
                name="download"
                color={focused ? "#00D1FF" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(Settings)"
          options={{
            title: languages?"الإعدادات":"Seattings",
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                size={24}
                name="setting"
                color={focused ? "#00D1FF" : "gray"}
              />
            ),
          }}
        />
      </Tabs>

      {/* Component on top of Tabs */}

      {isKeyboardVisible ? (
        ""
      ) : (
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

    </View>
  );
}