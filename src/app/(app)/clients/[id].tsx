import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Folder,
  ChevronRight,
  ChevronLeft,
  Building,
  User,
  Plus,
} from 'lucide-react-native';
import { lawyerApi } from '@/client/lawyerApi';
import { Client, Case } from '@/types/lawyer';

export default function ClientDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const clientId = typeof params.id === 'string' ? params.id : 'c-1';

  const [client, setClient] = useState<Client | null>(null);
  const [clientCases, setClientCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClientDetails = useCallback(async () => {
    try {
      const [c, allCases] = await Promise.all([
        lawyerApi.getClientById(clientId),
        lawyerApi.getCases(),
      ]);
      setClient(c);
      const filtered = allCases.filter(
        (cs) => cs.client_id === clientId || cs.client_name === c?.name
      );
      setClientCases(filtered.length > 0 ? filtered : allCases.slice(0, 1));
    } catch (err) {
      console.log('Error loading client:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useFocusEffect(
    useCallback(() => {
      loadClientDetails();
    }, [loadClientDetails])
  );

  const handleCall = () => {
    if (client?.phone) {
      Linking.openURL(`tel:${client.phone}`);
    }
  };

  const handleEmail = () => {
    if (client?.email) {
      Linking.openURL(`mailto:${client.email}`);
    }
  };

  if (loading && !client) {
    return (
      <View className="flex-1 bg-[#0b1422] items-center justify-center">
        <ActivityIndicator color="#eab308" size="large" />
      </View>
    );
  }

  const currentClient = client || {
    id: 'c-1',
    name: 'شركة النور التجارية',
    client_type: 'company' as const,
    phone: '+966 11 234 5678',
    email: 'info@alnoor.com',
    status: 'نشط' as const,
    cases_count: 3,
    address: 'الرياض - طريق الملك فهد',
    nationality: 'سعودي',
  };

  const initial = currentClient.name.trim().charAt(0) || 'ع';

  return (
    <View className="flex-1 bg-[#0b1422]">
      {/* Top Header */}
      <View className="bg-[#0b1422] px-4 pt-12 pb-3 border-b border-[#162740] flex-row items-center justify-between">
        <View className="w-10 h-10" />
        <Text className="text-white text-lg font-bold text-center">ملف الموكل</Text>
        <Pressable
          className="w-10 h-10 rounded-full bg-[#132238] border border-[#1e3557] items-center justify-center active:opacity-75"
          onPress={() => router.back()}
        >
          <ChevronRight size={22} color="#f8fafc" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Profile Card */}
        <View className="bg-[#132238] border border-[#1e3557] rounded-2xl p-5 mb-4 items-center">
          <View className="w-20 h-20 rounded-full bg-[#818cf8] items-center justify-center mb-3 shadow-md">
            <Text className="text-white text-3xl font-extrabold">{initial}</Text>
          </View>

          <Text className="text-white text-xl font-bold text-center mb-1">
            {currentClient.name}
          </Text>

          <View className="flex-row items-center gap-2 mb-3">
            <View className="px-3 py-1 rounded-full bg-[#059669]/20 border border-[#059669]/40">
              <Text className="text-[#10b981] text-xs font-semibold">
                {currentClient.status}
              </Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-[#1e2f4a] border border-[#1e3557]">
              <Text className="text-[#cbd5e1] text-xs">
                {currentClient.client_type === 'company' ? 'شركة / مؤسسة' : 'فرد'}
              </Text>
            </View>
          </View>

          {/* Direct Communication Buttons */}
          <View className="flex-row gap-3 w-full mt-2">
            <Pressable
              className="flex-1 bg-[#0b1422] border border-[#1e3557] py-2.5 rounded-xl flex-row items-center justify-center gap-2 active:opacity-85"
              onPress={handleCall}
            >
              <Phone size={16} color="#eab308" />
              <Text className="text-white text-xs font-bold">اتصال هاتفي</Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-[#0b1422] border border-[#1e3557] py-2.5 rounded-xl flex-row items-center justify-center gap-2 active:opacity-85"
              onPress={handleEmail}
            >
              <Mail size={16} color="#eab308" />
              <Text className="text-white text-xs font-bold">مراسلة بريدية</Text>
            </Pressable>
          </View>
        </View>

        {/* Client Info Card */}
        <View className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4.5 mb-4">
          <Text className="text-white font-bold text-base text-right mb-3 pb-2 border-b border-[#1a2f4c]">
            البيانات المسجلة
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-white text-sm">{currentClient.phone}</Text>
              <Text className="text-[#94a3b8] text-sm">رقم الهاتف:</Text>
            </View>

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-white text-sm">{currentClient.email || 'غير مسجل'}</Text>
              <Text className="text-[#94a3b8] text-sm">البريد الإلكتروني:</Text>
            </View>

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-white text-sm">{currentClient.address || 'الرياض'}</Text>
              <Text className="text-[#94a3b8] text-sm">العنوان:</Text>
            </View>

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-white text-sm">{currentClient.nationality || 'سعودي'}</Text>
              <Text className="text-[#94a3b8] text-sm">الجنسية:</Text>
            </View>
          </View>
        </View>

        {/* Client Cases Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#eab308] text-xs font-semibold">
              {clientCases.length} قضايا مسجلة
            </Text>
            <Text className="text-white font-bold text-base">قضايا الموكل</Text>
          </View>

          {clientCases.map((c) => (
            <Pressable
              key={c.id}
              className="bg-[#132238] border border-[#1e3557] rounded-xl p-4 mb-3 active:opacity-80"
              onPress={() =>
                router.push({
                  pathname: '/(app)/cases/[id]',
                  params: { id: c.id },
                })
              }
            >
              <View className="flex-row items-center justify-between mb-2">
                <View
                  className={`px-2.5 py-0.5 rounded-full ${
                    c.status === 'منظورة'
                      ? 'bg-[#059669]/20 border border-[#059669]/40'
                      : 'bg-[#d97706]/20 border border-[#d97706]/40'
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      c.status === 'منظورة' ? 'text-[#10b981]' : 'text-[#f59e0b]'
                    }`}
                  >
                    {c.status}
                  </Text>
                </View>
                <Text className="text-white font-bold text-sm text-right">{c.title}</Text>
              </View>

              <View className="flex-row items-center justify-between pt-2 border-t border-[#1a2f4c]">
                <ChevronLeft size={16} color="#64748b" />
                <Text className="text-[#94a3b8] text-xs">
                  المحكمة: <Text className="text-white">{c.court_name}</Text>
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
