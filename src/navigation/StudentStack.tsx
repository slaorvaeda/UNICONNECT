import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudentTabs } from './StudentTabs';
import {
  StudentDocumentsScreen,
  StudentAcademicRecordsScreen,
  StudentExamSchedulesScreen,
} from '../screens/student';

const Stack = createNativeStackNavigator();

export function StudentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF9F7' },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen name="StudentDocuments" component={StudentDocumentsScreen} />
      <Stack.Screen name="StudentAcademicRecords" component={StudentAcademicRecordsScreen} />
      <Stack.Screen name="StudentExamSchedules" component={StudentExamSchedulesScreen} />
    </Stack.Navigator>
  );
}
