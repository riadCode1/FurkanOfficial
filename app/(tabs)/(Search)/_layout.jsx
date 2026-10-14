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

<<<<<<< HEAD
      <StatusBar backgroundColor="#071426" style="light" />
=======
      <StatusBar backgroundColor="#161622" style="light" />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </>
  );
};

export default _layout;
