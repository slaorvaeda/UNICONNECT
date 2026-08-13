import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeacherTabs } from './TeacherTabs';
import { TeacherTimetableScreen } from '../screens/teacher';

const Stack = createNativeStackNavigator();

export function TeacherStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF9F7' },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
      <Stack.Screen name="TeacherTimetable" component={TeacherTimetableScreen} />
    </Stack.Navigator>
  );
}
