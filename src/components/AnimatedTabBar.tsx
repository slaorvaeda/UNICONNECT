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
const RIGHT_SECTION_WIDTH = 56;

const springConfig = { damping: 22, stiffness: 400 };

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const tabBarWidth = width - 72;
  const innerWidth = tabBarWidth - 16;
  const tabCount = state.routes.length;
  
  // Detect if the navigation bar is the Student navigation with the AI chatbot inline
  const isStudentChat = state.routes[tabCount - 1]?.name === 'StudentChatbot';

  const leftRoutes = isStudentChat ? state.routes.slice(0, tabCount - 1) : state.routes;
  const rightRoute = isStudentChat ? state.routes[tabCount - 1] : null;

  const getTabX = (index: number) => {
    if (isStudentChat) {
      const leftSectionWidth = innerWidth - RIGHT_SECTION_WIDTH;
      if (index < tabCount - 1) {
        const leftTabCount = leftRoutes.length;
        const leftTabWidth = leftSectionWidth / leftTabCount;
        return index * leftTabWidth + (leftTabWidth - PILL_SIZE) / 2;
      } else {
        return leftSectionWidth + (RIGHT_SECTION_WIDTH - PILL_SIZE) / 2;
      }
    } else {
      const tabWidth = innerWidth / tabCount;
      return index * tabWidth + (tabWidth - PILL_SIZE) / 2;
    }
  };

  const translateX = useSharedValue(getTabX(state.index));

  useEffect(() => {
    const targetX = getTabX(state.index);
    translateX.value = withSpring(targetX, springConfig);
  }, [state.index, innerWidth]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.tabBar, { width: tabBarWidth }]}>
      <Animated.View style={[styles.pill, pillAnimatedStyle]} />
      <View style={styles.tabsRow}>
        
        {isStudentChat ? (
          <>
            {/* Student Left Section */}
            <View style={styles.leftSection}>
              {leftRoutes.map((route, index) => {
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

            {/* Visual Divider */}
            <View style={styles.divider} />

            {/* Student Right AI Section */}
            <View style={styles.rightSection}>
              {rightRoute && (() => {
                const index = tabCount - 1;
                const { options } = descriptors[rightRoute.key];
                const focused = state.index === index;
                const icon = options.tabBarIcon?.({
                  focused,
                  color: focused ? ACTIVE_ICON : '#FFFFFF',
                  size: 22,
                });

                return (
                  <Pressable
                    key={rightRoute.key}
                    onPress={() => {
                      const event = navigation.emit({
                        type: 'tabPress',
                        target: rightRoute.key,
                        canPreventDefault: true,
                      });
                      if (!focused && !event.defaultPrevented) {
                        navigation.navigate(rightRoute.name, rightRoute.params);
                      }
                    }}
                    style={styles.tabButtonRight}
                  >
                    <View style={[styles.iconWrap, !focused && styles.iconInactive]}>
                      {icon}
                    </View>
                  </Pressable>
                );
              })()}
            </View>
          </>
        ) : (
          /* Default uniform navigation for Admin & Teacher */
          state.routes.map((route, index) => {
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
          })
        )}

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
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    width: RIGHT_SECTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  tabButtonRight: {
    width: RIGHT_SECTION_WIDTH,
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
