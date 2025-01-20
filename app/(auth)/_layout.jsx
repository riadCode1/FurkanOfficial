import React from 'react'
import { Stack,  } from 'expo-router'
import { StatusBar } from "expo-status-bar"

const _layout = () => {
  return (
    
   

    <>
 
      <Stack>
      
       
     
     
      <Stack.Screen name="PlaylistScreen" options={{animation:"slide_from_left", headerShown: false }} />

      </Stack>

      <StatusBar backgroundColor='#161622' style='light' />
      </>
    
  )
}

export default _layout   