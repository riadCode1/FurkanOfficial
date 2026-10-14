import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../../context/GlobalProvider";
<<<<<<< HEAD
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

=======

const _layout = () => {
  const { languages } = useGlobalContext();
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
  return (
    <>
      <Stack>
        <Stack.Screen
          name="Setting"
<<<<<<< HEAD
          options={{ animationDuration: 250, animation: "fade", headerShown: false }}
        />
        <Stack.Screen
          name="Languagues"
          options={{ animationDuration: 250, animation: "fade", headerShown: false }}
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        />
        <Stack.Screen
          name="Privacy"
          options={{
            animationDuration: 250,
            animation: "fade",
<<<<<<< HEAD
            headerTitle: languages ? "الخصوصية والسياسة" : "Privacy & Policy",
            ...secondaryHeaderOptions,
            headerShown: false,
=======
            headerTitle: languages ? "الخصوصية و السياسة " : "Privacy & Policy",
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
          }}
        />
        <Stack.Screen
          name="Terms"
          options={{
            animationDuration: 250,
            animation: "fade",
<<<<<<< HEAD
            headerTitle: languages ? "شروط الخدمة" : "Terms & Conditions",
            ...secondaryHeaderOptions,
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor={Colors.background} style="light" />
=======
            headerTitle: languages ? " شروط الخدمة" : "Terms & Conditions  ",
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    </>
  );
};

<<<<<<< HEAD
export default SettingsLayout;
=======
export default _layout;
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
