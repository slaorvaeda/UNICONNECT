import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { StudentStack } from './StudentStack';
import { TeacherTabs } from './TeacherTabs';
import { AdminTabs } from './AdminTabs';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

function MainByRole() {
  const { role } = useAuth();
  if (role === 'student') return <StudentStack />;
  if (role === 'teacher') return <TeacherTabs />;
  if (role === 'admin') return <AdminTabs />;
  return null;
}

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF9F7' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Main" component={MainByRole} />
    </Stack.Navigator>
  );
}
