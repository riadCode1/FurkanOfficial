import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useRouter, useSegments } from 'expo-router';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 3;   // change if you have more tabs

export default function CustomTabBar({ state, descriptors }) {
  const router = useRouter();
  const segments = useSegments();

  const translateX = useSharedValue(0);

  // Animate the indicator when active tab changes
  React.useEffect(() => {
    const currentIndex = state.index;
    translateX.value = withSpring(currentIndex * TAB_WIDTH);
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'transparent', height: 70, borderWidth: 1, borderTopColor: '#eee' }}>
      {/* Animated Indicator */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            width: TAB_WIDTH,
            height: 3,
            backgroundColor: 'red',
          },
          animatedStyle,
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => router.push(`/(tabs)/${route.name}`)}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Animated.Text
              style={{
                color: isFocused ? '#0066ff' : 'gray',
                fontSize: 12,
                transform: [{ scale: isFocused ? 1.1 : 1 }],
              }}
            >
              {options.title || route.name}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}