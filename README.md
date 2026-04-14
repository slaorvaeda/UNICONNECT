# UNICONNECT – Mobile App (Frontend)

React Native (Expo) mobile app with **dummy data** and role-based UI. Backend to be connected later.

## Run

```bash
cd mobile
npm start
# Then press i (iOS) or a (Android) in Expo
```

## Demo login (no backend)

| Role    | Email                    | Password |
|---------|--------------------------|----------|
| Student | student@uniconnect.edu   | 123456   |
| Teacher | teacher@uniconnect.edu   | 123456   |
| Admin   | admin@uniconnect.edu     | 123456   |

## Structure

```
src/
  components/     # Reusable UI (GlassCard, GlassButton, Input, Avatar, etc.)
  screens/        # auth, student, teacher, admin
  navigation/      # RootNavigator, StudentTabs, TeacherTabs, AdminTabs
  context/        # AuthContext (dummy login)
  theme/          # colors, spacing
  data/           # dummy.ts (users, attendance, events, grievances, notices)
  types/          # Shared TypeScript types
```

## Design

- **Glassmorphic**, rounded cards and buttons
- **Animated** (Reanimated) on key screens
- **Role-based**: different tabs/screens for Student, Teacher, Admin

## Next steps

- Connect to FastAPI backend (auth, APIs)
- Replace dummy data with API calls
