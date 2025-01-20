import { View, Text } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'

const Blur = () => {
  return (
    <View style={{ flex: 1 }}>
    <View
      style={{
        width: '100%',
        height: "100%",
        
        borderTopColor: 'white',
        borderBottomColor: 'white',
        overflow: 'hidden',
      }}
    >
      <BlurView
        intensity={20}
        
        style={{ flex: 1, backgroundColor: ' rgba(25, 24, 69, 0.75)' }}
      />
    </View>
  </View>
  )
}

export default Blur