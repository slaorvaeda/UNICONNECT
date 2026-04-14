import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminHomeScreen, AdminProfileScreen } from '../screens/admin';
import { AnimatedTabBar } from '../components/AnimatedTabBar';
import { ScreenTransitionWrapper } from '../components/ScreenTransitionWrapper';

const Tab = createBottomTabNavigator();

export function AdminTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#E07C3C',
        tabBarInactiveTintColor: '#FFFFFF',
        lazy: true,
      }}
    >
      <Tab.Screen
        name="AdminHome"
        component={(props) => (
          <ScreenTransitionWrapper>
            <AdminHomeScreen {...props} />
          </ScreenTransitionWrapper>
        )}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={(props) => (
          <ScreenTransitionWrapper>
            <AdminProfileScreen {...props} />
          </ScreenTransitionWrapper>
        )}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="menu-outline" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
