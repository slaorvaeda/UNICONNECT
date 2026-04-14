import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
  StudentHomeScreen,
  StudentAttendanceScreen,
  StudentEventsScreen,
  StudentFeesScreen,
  StudentGrievancesScreen,
  StudentNoticesScreen,
  StudentProfileScreen,
} from '../screens/student';
import { AnimatedTabBar } from '../components/AnimatedTabBar';
import { ScreenTransitionWrapper } from '../components/ScreenTransitionWrapper';

const Tab = createBottomTabNavigator();

export function StudentTabs() {
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
        name="StudentHome"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentHomeScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StudentAttendance"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="stats-chart-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentAttendanceScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StudentEvents"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentEventsScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StudentFees"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="card-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentFeesScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StudentGrievances"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="flash-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentGrievancesScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StudentNotices"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="document-text-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentNoticesScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StudentProfile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="menu-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ScreenTransitionWrapper>
            <StudentProfileScreen {...props} />
          </ScreenTransitionWrapper>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
