import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../../context/GlobalProvider";

const _layout = () => {
  const { languages } = useGlobalContext();
  return (
    <>
      <Stack>
        <Stack.Screen
          name="Setting"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Languagues"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Privacy"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerTitle: languages ? "الخصوصية و السياسة " : "Privacy & Policy",
          }}
        />
        <Stack.Screen
          name="Terms"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerTitle: languages ? " شروط الخدمة" : "Terms & Conditions  ",
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default _layout;
