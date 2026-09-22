import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Scale,
  Folder,
  Users,
  Calendar,
  Clock,
  ChevronLeft,
  Plus,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  AlertCircle,
} from 'lucide-react-native';
import { OfficeHeader } from '@/components/OfficeHeader';
import { lawyerApi } from '@/client/lawyerApi';
import { Case, HearingSession, OfficeStats } from '@/types/lawyer';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<OfficeStats>({
    activeCases: 8,
    postponedCases: 2,
    completedCases: 4,
    todaySessions: 3,
    totalClients: 8,
    pendingTasks: 4,
  });
  const [todaySessions, setTodaySessions] = useState<HearingSession[]>([]);
  const [recentCases, setRecentCases] = useState<Case[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [sData, sessData, casesData] = await Promise.all([
        lawyerApi.getOfficeStats(),
        lawyerApi.getSessions(),
        lawyerApi.getCases(),
      ]);
      setStats(sData);
      setTodaySessions(sessData.slice(0, 3));
      setRecentCases(casesData.slice(0, 3));
    } catch (err) {
      console.log('Error loading home data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View className="flex-1 bg-[#0b1422]">
      <OfficeHeader
        title="مكتب المستشار أحمد كامل للمحاماة"
        subtitle="الأحد ، 22 سبتمبر 2026"
        onNotificationPress={() => {}}
      />

      <ScrollView
        className="flex-1 px-4 pt-3 pb-8"
        contentContainerStyle={{ paddingBottom: 36 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />
        }
      >
        {/* Welcome banner */}
        <View className="bg-gradient-to-r from-[#142136] to-[#1a2d48] border border-[#1e3557] rounded-2xl p-4.5 mb-4 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <Text className="text-[#10b981] text-xs font-semibold">النظام متصل ونشط</Text>
            </View>
            <Text className="text-[#eab308] text-xs font-bold">لوحة المتابعة اليومية</Text>
          </View>
          <Text className="text-white text-lg font-bold text-right mb-1">
            مرحباً بك في الإدارة القانونية
          </Text>
          <Text className="text-[#94a3b8] text-xs text-right leading-5">
            لديك اليوم 3 جلسات مجدولة أمام محكمة الاستئناف والمحكمة العامة، و8 قضايا منظورة قيد المتابعة.
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row flex-wrap gap-2.5 mb-5 justify-between">
          {/* Active Cases */}
          <Pressable
            className="flex-1 min-w-[47%] bg-[#132238] border border-[#1e3557] p-3.5 rounded-xl active:opacity-85"
            onPress={() => router.push('/(app)/(tabs)/cases')}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 rounded-lg bg-[#059669]/20 items-center justify-center">
                <Folder size={18} color="#10b981" />
              </View>
              <Text className="text-[#10b981] text-xs font-semibold">منظورة</Text>
            </View>
            <Text className="text-white text-2xl font-bold text-right">
              {stats.activeCases}
            </Text>
            <Text className="text-[#94a3b8] text-xs text-right mt-0.5">القضايا النشطة</Text>
          </Pressable>

          {/* Today's Hearings */}
          <Pressable
            className="flex-1 min-w-[47%] bg-[#132238] border border-[#1e3557] p-3.5 rounded-xl active:opacity-85"
            onPress={() => router.push('/(app)/(tabs)/sessions')}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 rounded-lg bg-[#eab308]/20 items-center justify-center">
                <Calendar size={18} color="#eab308" />
              </View>
              <Text className="text-[#eab308] text-xs font-semibold">اليوم</Text>
            </View>
            <Text className="text-white text-2xl font-bold text-right">
              {stats.todaySessions}
            </Text>
            <Text className="text-[#94a3b8] text-xs text-right mt-0.5">جلسات المحاكم</Text>
          </Pressable>

          {/* Total Clients */}
          <Pressable
            className="flex-1 min-w-[47%] bg-[#132238] border border-[#1e3557] p-3.5 rounded-xl active:opacity-85"
            onPress={() => router.push('/(app)/(tabs)/clients')}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 rounded-lg bg-[#3b82f6]/20 items-center justify-center">
                <Users size={18} color="#60a5fa" />
              </View>
              <Text className="text-[#60a5fa] text-xs font-semibold">سجلات</Text>
            </View>
            <Text className="text-white text-2xl font-bold text-right">
              {stats.totalClients}
            </Text>
            <Text className="text-[#94a3b8] text-xs text-right mt-0.5">إجمالي الموكلين</Text>
          </Pressable>

          {/* Postponed / Completed */}
          <Pressable
            className="flex-1 min-w-[47%] bg-[#132238] border border-[#1e3557] p-3.5 rounded-xl active:opacity-85"
            onPress={() => router.push('/(app)/(tabs)/cases')}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-8 h-8 rounded-lg bg-[#d97706]/20 items-center justify-center">
                <Clock size={18} color="#f59e0b" />
              </View>
              <Text className="text-[#f59e0b] text-xs font-semibold">مؤجلة</Text>
            </View>
            <Text className="text-white text-2xl font-bold text-right">
              {stats.postponedCases}
            </Text>
            <Text className="text-[#94a3b8] text-xs text-right mt-0.5">قضايا مؤجلة</Text>
          </Pressable>
        </View>

        {/* Today's Court Sessions Section */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Pressable
              className="flex-row items-center gap-1"
              onPress={() => router.push('/(app)/(tabs)/sessions')}
            >
              <ChevronLeft size={16} color="#eab308" />
              <Text className="text-[#eab308] text-xs font-semibold">عرض الكل</Text>
            </Pressable>
            <Text className="text-white text-base font-bold">جلسات اليوم الهامة</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#eab308" className="py-4" />
          ) : (
            todaySessions.map((session, idx) => (
              <Pressable
                key={session.id || idx}
                className="bg-[#132238] border border-[#1e3557] rounded-xl p-3.5 mb-2.5 active:opacity-80"
                onPress={() => router.push({ pathname: '/(app)/cases/[id]', params: { id: session.case_id } })}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="bg-[#eab308]/15 border border-[#eab308]/40 px-2.5 py-0.5 rounded-full">
                    <Text className="text-[#eab308] text-xs font-semibold">{session.session_time || '10:00 ص'}</Text>
                  </View>
                  <Text className="text-white font-bold text-sm text-right">
                    {session.court_name}
                  </Text>
                </View>

                <Text className="text-[#f8fafc] text-sm text-right mb-1 font-semibold">
                  {session.session_reason || session.case_title}
                </Text>

                <View className="flex-row items-center justify-between text-xs mt-2 pt-2 border-t border-[#1a2f4c]">
                  <Text className="text-[#94a3b8] text-xs">
                    المحامي: {session.attending_lawyer || 'أ. سارة عبدالله'}
                  </Text>
                  <Text className="text-[#cbd5e1] text-xs font-medium">
                    {session.client_name || 'شركة النور التجارية'}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Recent Cases Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Pressable
              className="flex-row items-center gap-1"
              onPress={() => router.push('/(app)/(tabs)/cases')}
            >
              <ChevronLeft size={16} color="#eab308" />
              <Text className="text-[#eab308] text-xs font-semibold">عرض كافة القضايا</Text>
            </Pressable>
            <Text className="text-white text-base font-bold">أحدث القضايا المتابعة</Text>
          </View>

          {recentCases.map((c) => (
            <Pressable
              key={c.id}
              className="bg-[#132238] border border-[#1e3557] rounded-xl p-3.5 mb-2.5 active:opacity-80"
              onPress={() => router.push({ pathname: '/(app)/cases/[id]', params: { id: c.id } })}
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <View
                  className={`px-2.5 py-0.5 rounded-full ${
                    c.status === 'منظورة'
                      ? 'bg-[#059669]/20 border border-[#059669]/40'
                      : c.status === 'مؤجلة'
                      ? 'bg-[#d97706]/20 border border-[#d97706]/40'
                      : 'bg-[#475569]/30 border border-[#475569]/50'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      c.status === 'منظورة'
                        ? 'text-[#10b981]'
                        : c.status === 'مؤجلة'
                        ? 'text-[#f59e0b]'
                        : 'text-[#94a3b8]'
                    }`}
                  >
                    {c.status}
                  </Text>
                </View>
                <Text className="text-white font-bold text-sm text-right">
                  {c.title}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-[#1a2f4c]">
                <Text className="text-[#94a3b8] text-xs">
                  آخر جلسة: {c.last_session_date}
                </Text>
                <Text className="text-[#94a3b8] text-xs">
                  الموكل: <Text className="text-white font-medium">{c.client_name}</Text>
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Quick action buttons */}
        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 bg-[#132238] border border-[#eab308]/40 py-3 rounded-xl flex-row items-center justify-center gap-2 active:opacity-85"
            onPress={() => router.push('/(app)/(tabs)/cases')}
          >
            <Folder size={18} color="#eab308" />
            <Text className="text-white text-xs font-bold">إدارة القضايا</Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-[#132238] border border-[#eab308]/40 py-3 rounded-xl flex-row items-center justify-center gap-2 active:opacity-85"
            onPress={() => router.push('/(app)/(tabs)/clients')}
          >
            <Users size={18} color="#eab308" />
            <Text className="text-white text-xs font-bold">دليل الموكلين</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
