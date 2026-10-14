import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="Searchs"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReciterSearch"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReadersSearch"
          options={{
            animationDuration: 250,
            animation: "fade",
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#071426" style="light" />
    </>
  );
};

export default _layout;
