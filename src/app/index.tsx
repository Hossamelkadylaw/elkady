import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Scale, ArrowLeft, ShieldCheck, FileText, Users, Calendar } from 'lucide-react-native';

export default function IndexLandingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Quick seamless transition to home tab after brief splash display
    const timer = setTimeout(() => {
      router.replace('/(app)/(tabs)/home');
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-[#0b1422] items-center justify-between p-8 pt-20 pb-12">
      {/* Top Header Glow */}
      <View className="items-center">
        <View className="w-24 h-24 rounded-full bg-[#14233c] border-2 border-[#eab308]/40 items-center justify-center mb-6 shadow-lg shadow-[#eab308]/10">
          <Scale size={46} color="#eab308" />
        </View>
        <Text className="text-2xl font-bold text-white text-center mb-2 tracking-wide">
          مكتب المستشار أحمد كامل للمحاماة
        </Text>
        <Text className="text-sm text-[#94a3b8] text-center max-w-[280px]">
          نظام الإدارة القانونية الرقمي المعتمد لمتابعة القضايا والجلسات والموكلين
        </Text>
      </View>

      {/* Feature Highlights */}
      <View className="w-full max-w-sm gap-3 my-6">
        <View className="flex-row items-center justify-end bg-[#142136] border border-[#1e3352] p-3.5 rounded-xl gap-3">
          <View className="flex-1 items-end">
            <Text className="text-white font-semibold text-sm">متابعة دقيقة للقضايا</Text>
            <Text className="text-[#94a3b8] text-xs">أرشفة رقمية ومتابعة وقائع الدعاوى</Text>
          </View>
          <View className="w-10 h-10 rounded-lg bg-[#1e2f4a] items-center justify-center">
            <FileText size={20} color="#eab308" />
          </View>
        </View>

        <View className="flex-row items-center justify-end bg-[#142136] border border-[#1e3352] p-3.5 rounded-xl gap-3">
          <View className="flex-1 items-end">
            <Text className="text-white font-semibold text-sm">جدول جلسات المحاكم</Text>
            <Text className="text-[#94a3b8] text-xs">تنبيهات بمواعيد الجلسات ورول الرول اليومي</Text>
          </View>
          <View className="w-10 h-10 rounded-lg bg-[#1e2f4a] items-center justify-center">
            <Calendar size={20} color="#eab308" />
          </View>
        </View>

        <View className="flex-row items-center justify-end bg-[#142136] border border-[#1e3352] p-3.5 rounded-xl gap-3">
          <View className="flex-1 items-end">
            <Text className="text-white font-semibold text-sm">إدارة شؤون الموكلين</Text>
            <Text className="text-[#94a3b8] text-xs">سجلات اتصال وربط مباشر مع ملفات القضايا</Text>
          </View>
          <View className="w-10 h-10 rounded-lg bg-[#1e2f4a] items-center justify-center">
            <Users size={20} color="#eab308" />
          </View>
        </View>
      </View>

      {/* Enter App Action Button */}
      <View className="w-full max-w-sm gap-4 items-center">
        <Pressable
          className="w-full bg-[#eab308] active:opacity-85 py-4 px-6 rounded-2xl flex-row items-center justify-center gap-3 shadow-md shadow-[#eab308]/20"
          onPress={() => router.replace('/(app)/(tabs)/home')}
        >
          <ArrowLeft size={20} color="#0b1422" />
          <Text className="text-[#0b1422] font-bold text-base">دخول النظام الآن</Text>
        </Pressable>

        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-[#64748b]">إصدار رقمي آمن 1.0 • أندرويد معتمد</Text>
          <ShieldCheck size={14} color="#64748b" />
        </View>
      </View>
    </View>
  );
}
