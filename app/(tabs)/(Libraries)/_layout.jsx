import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="Library"
          options={{
            animationDuration: 250,
            animation: "ios_from_right",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[playlistId]"
          options={{
            animationDuration: 250,
            animation: "ios_from_right",
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#071426" style="light" />
    </>
  );
};

export default _layout;
