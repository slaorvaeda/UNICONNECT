import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TeacherHomeScreen, TeacherGrievancesScreen, TeacherProfileScreen } from '../screens/teacher';
import { AnimatedTabBar } from '../components/AnimatedTabBar';
import { ScreenTransitionWrapper } from '../components/ScreenTransitionWrapper';

const Tab = createBottomTabNavigator();

export function TeacherTabs() {
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
        name="TeacherHome"
        component={(props) => (
          <ScreenTransitionWrapper>
            <TeacherHomeScreen {...props} />
          </ScreenTransitionWrapper>
        )}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="TeacherGrievances"
        component={(props) => (
          <ScreenTransitionWrapper>
            <TeacherGrievancesScreen {...props} />
          </ScreenTransitionWrapper>
        )}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="flash-outline" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="TeacherProfile"
        component={(props) => (
          <ScreenTransitionWrapper>
            <TeacherProfileScreen {...props} />
          </ScreenTransitionWrapper>
        )}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="menu-outline" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
