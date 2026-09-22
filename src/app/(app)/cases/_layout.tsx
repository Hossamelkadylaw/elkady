import { Stack } from 'expo-router';

export default function CasesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0b1422' },
      }}
    />
  );
}
