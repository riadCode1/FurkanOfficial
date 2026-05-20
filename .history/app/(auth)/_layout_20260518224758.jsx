import { View, Text } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { useAuth } from '../../hooks/useAuth';



const _layout = () => {
  const { login, isLoading, error,session } = useAuth();

  if(session)router.push("Index");
  else router.push("login");
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout