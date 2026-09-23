import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudentTabs } from './StudentTabs';
import {
  StudentDocumentsScreen,
  StudentAcademicRecordsScreen,
  StudentExamSchedulesScreen,
  StudentChatbotScreen,
  StudentFeesScreen,
  StudentTimetableScreen,
  StudentLibraryScreen,
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
      <Stack.Screen name="StudentChatbot" component={StudentChatbotScreen} />
      <Stack.Screen name="StudentFees" component={StudentFeesScreen} />
      <Stack.Screen name="StudentTimetable" component={StudentTimetableScreen} />
      <Stack.Screen name="StudentLibrary" component={StudentLibraryScreen} />
    </Stack.Navigator>
  );
}

