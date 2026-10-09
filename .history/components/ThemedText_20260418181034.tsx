import React from 'react';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: lightColor || '#000' },
        type === 'default' && { fontSize: 16 },
        type === 'title' && { fontSize: 32, fontWeight: 'bold' },
        type === 'defaultSemiBold' && { fontSize: 16, fontWeight: '600' },
        type === 'subtitle' && { fontSize: 20, fontWeight: 'bold' },
        type === 'link' && { fontSize: 16, color: '#2e78b7' },
        style,
      ]}
      {...rest}
    />
  );
}