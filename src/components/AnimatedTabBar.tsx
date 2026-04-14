import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_BG = '#1A1A1A';
const ACTIVE_BG = '#FFFFFF';
const ACTIVE_ICON = '#E07C3C';
const PILL_SIZE = 40;

const springConfig = { damping: 22, stiffness: 400 };

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const tabBarWidth = width - 72;
  const innerWidth = tabBarWidth - 16;
  const tabCount = state.routes.length;
  const tabWidth = innerWidth / tabCount;
  const pillOffset = (tabWidth - PILL_SIZE) / 2;

  const translateX = useSharedValue(state.index * tabWidth + pillOffset);

  useEffect(() => {
    const targetX = state.index * tabWidth + pillOffset;
    translateX.value = withSpring(targetX, springConfig);
  }, [state.index, tabWidth, pillOffset]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.tabBar, { width: tabBarWidth }]}>
      <Animated.View style={[styles.pill, pillAnimatedStyle]} />
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const icon = options.tabBarIcon?.({
            focused,
            color: focused ? ACTIVE_ICON : '#FFFFFF',
            size: 22,
          });

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              style={styles.tabButton}
            >
              <View style={[styles.iconWrap, !focused && styles.iconInactive]}>
                {icon}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 36,
    right: 36,
    bottom: 12,
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 28,
    backgroundColor: TAB_BG,
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
    backgroundColor: ACTIVE_BG,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  iconWrap: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInactive: {
    backgroundColor: 'transparent',
  },
});
