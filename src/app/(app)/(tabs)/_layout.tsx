import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Folder, Users, Calendar } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#eab308',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#09101d',
          borderTopColor: '#162740',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-full ${
                focused ? 'bg-[#eab308]/15' : ''
              }`}
            >
              <Home size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'القضايا',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-full ${
                focused ? 'bg-[#eab308]/15' : ''
              }`}
            >
              <Folder size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'العملاء',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-full ${
                focused ? 'bg-[#eab308]/15' : ''
              }`}
            >
              <Users size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'الجلسات',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-full ${
                focused ? 'bg-[#eab308]/15' : ''
              }`}
            >
              <Calendar size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
