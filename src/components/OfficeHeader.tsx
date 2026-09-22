import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Scale, Bell } from 'lucide-react-native';

interface OfficeHeaderProps {
  title?: string;
  subtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

export function OfficeHeader({
  title = 'مكتب المستشار أحمد كامل للمحاماة',
  subtitle,
  showNotification = true,
  onNotificationPress,
}: OfficeHeaderProps) {
  return (
    <View className="bg-[#0b1422] px-4 pt-12 pb-3 border-b border-[#162740]">
      <View className="flex-row items-center justify-between">
        {/* Left icon: Notification Bell with dot */}
        {showNotification ? (
          <Pressable
            className="w-10 h-10 rounded-full bg-[#132238] border border-[#1e3557] items-center justify-center relative active:opacity-75"
            onPress={onNotificationPress}
          >
            <Bell size={20} color="#f8fafc" />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ef4444] border-2 border-[#132238]" />
          </Pressable>
        ) : (
          <View className="w-10 h-10" />
        )}

        {/* Center: Title & Subtitle */}
        <View className="flex-1 items-center px-2">
          <Text
            className="text-white text-base font-bold text-center tracking-wide"
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-[#94a3b8] text-xs mt-0.5 text-center" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right: Golden Scales Emblem */}
        <View className="w-10 h-10 rounded-full bg-[#132238] border border-[#eab308]/30 items-center justify-center">
          <Scale size={20} color="#eab308" />
        </View>
      </View>
    </View>
  );
}
