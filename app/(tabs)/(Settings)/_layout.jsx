import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Colors } from "../../../constants/Colors";
import Goback from "../../../components/Goback";

const SettingsLayout = () => {
  const { languages } = useGlobalContext();
  const secondaryHeaderOptions = {
    headerLeft: () => <Goback inline />,
    headerBackVisible: false,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: Colors.background },
    headerTintColor: Colors.text,
    headerTitleStyle: { color: Colors.text, fontWeight: "700" },
  };

  return (
    <>
      <Stack>
        <Stack.Screen
          name="Setting"
          options={{ animationDuration: 250, animation: "fade", headerShown: false }}
        />
        <Stack.Screen
          name="Languagues"
          options={{ animationDuration: 250, animation: "fade", headerShown: false }}
        />
        <Stack.Screen
          name="Privacy"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerTitle: languages ? "الخصوصية والسياسة" : "Privacy & Policy",
            ...secondaryHeaderOptions,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Terms"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerTitle: languages ? "شروط الخدمة" : "Terms & Conditions",
            ...secondaryHeaderOptions,
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor={Colors.background} style="light" />
    </>
  );
};

export default SettingsLayout;
