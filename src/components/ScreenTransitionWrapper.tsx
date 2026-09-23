import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

export function ScreenTransitionWrapper({ children }: { children: React.ReactNode }) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(1);
  const prevFocused = useRef(false);

  useEffect(() => {
    if (isFocused && prevFocused.current === false) {
      opacity.value = 0.88;
      opacity.value = withTiming(1, { duration: 160 });
    }
    prevFocused.current = isFocused;
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.wrapper, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
});
