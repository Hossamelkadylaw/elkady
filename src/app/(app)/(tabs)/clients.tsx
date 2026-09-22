import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Search,
  Users,
  Phone,
  Mail,
  ChevronLeft,
  Plus,
  X,
  Building,
  User,
} from 'lucide-react-native';
import { OfficeHeader } from '@/components/OfficeHeader';
import { lawyerApi } from '@/client/lawyerApi';
import { Client } from '@/types/lawyer';

export default function ClientsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Client Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newType, setNewType] = useState<'company' | 'individual'>('company');
  const [newAddress, setNewAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      const data = await lawyerApi.getClients();
      setClients(data);
    } catch (err) {
      console.log('Error loading clients:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [loadClients])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadClients();
  };

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [clients, searchQuery]);

  const handleCreateClient = async () => {
    if (!newName || !newPhone) return;
    setIsSubmitting(true);
    try {
      await lawyerApi.addClient({
        name: newName,
        phone: newPhone,
        email: newEmail || `${newName.replace(/\s+/g, '')}@client.com`,
        client_type: newType,
        status: 'نشط',
        cases_count: 0,
        address: newAddress || 'المملكة العربية السعودية',
        nationality: 'سعودي',
      });
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
      loadClients();
    } catch (err) {
      console.log('Error adding client:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avatar color generator based on index/name
  const getAvatarStyle = (index: number) => {
    const colors = [
      { bg: '#818cf8', text: '#ffffff' }, // Purple
      { bg: '#f472b6', text: '#ffffff' }, // Peach/Pink
      { bg: '#34d399', text: '#0b1422' }, // Mint
      { bg: '#fbbf24', text: '#0b1422' }, // Sand/Gold
      { bg: '#60a5fa', text: '#0b1422' }, // Blue
      { bg: '#a78bfa', text: '#ffffff' }, // Lavender
      { bg: '#4ade80', text: '#0b1422' }, // Green
      { bg: '#f87171', text: '#ffffff' }, // Coral
    ];
    return colors[index % colors.length];
  };

  // Format status badge text
  const getStatusBadge = (status: string, count: number) => {
    if (status === 'نشط' || status === 'active') {
      return {
        label: count === 1 ? 'نشط - قضية واحدة' : count === 2 ? 'نشط - قضيتان' : `نشط - ${count} قضايا`,
        bg: 'bg-[#059669]/20 border border-[#059669]/40',
        text: 'text-[#10b981]',
        dot: 'bg-[#10b981]',
      };
    }
    if (status === 'معلق' || status === 'pending') {
      return {
        label: count === 1 ? 'معلق - قضية واحدة' : count === 2 ? 'معلق - قضيتان' : `معلق - ${count} قضايا`,
        bg: 'bg-[#d97706]/20 border border-[#d97706]/40',
        text: 'text-[#f59e0b]',
        dot: 'bg-[#f59e0b]',
      };
    }
    return {
      label: count === 0 ? 'مغلق - لا توجد قضايا' : `مغلق - ${count} قضايا`,
      bg: 'bg-[#475569]/20 border border-[#475569]/40',
      text: 'text-[#94a3b8]',
      dot: 'bg-[#94a3b8]',
    };
  };

  return (
    <View className="flex-1 bg-[#0b1422]">
      {/* Header matching Images 1 & 2 */}
      <OfficeHeader
        title="مكتب المستشار أحمد كامل للمحاماة"
        subtitle="الأحد ، 22 سبتمبر"
        onNotificationPress={() => {}}
      />

      {/* Search Input matching Images 1 & 2 */}
      <View className="px-4 pt-3 pb-3">
        <View className="h-12 rounded-xl bg-[#132238] border border-[#1e3557] flex-row items-center px-4 gap-2.5">
          <TextInput
            className="flex-1 text-white text-sm text-right pr-1"
            placeholder="ابحث عن عميل"
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Search size={18} color="#64748b" />
        </View>
      </View>

      {/* Clients List matching Images 1 & 2 */}
      <ScrollView
        className="flex-1 px-4 pt-1"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />
        }
      >
        {loading ? (
          <ActivityIndicator color="#eab308" className="py-8" />
        ) : filteredClients.length === 0 ? (
          <View className="bg-[#132238] border border-[#1e3557] rounded-xl p-8 items-center justify-center my-6">
            <Users size={40} color="#64748b" />
            <Text className="text-white font-bold text-base mt-3">لا يوجد موكلون مطابقون</Text>
            <Text className="text-[#94a3b8] text-xs text-center mt-1">
              يمكنك إضافة موكل جديد باستخدام زر الإضافة في الأسفل
            </Text>
          </View>
        ) : (
          filteredClients.map((client, idx) => {
            const avatar = getAvatarStyle(idx);
            const initial = client.name.trim().charAt(0) || 'ع';
            const badge = getStatusBadge(client.status, client.cases_count);

            return (
              <Pressable
                key={client.id || idx}
                className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4 mb-3.5 active:opacity-85 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/clients/[id]',
                    params: { id: client.id },
                  })
                }
              >
                {/* Main Client Row */}
                <View className="flex-row items-center justify-between mb-3">
                  {/* Left: Chevron */}
                  <ChevronLeft size={20} color="#64748b" />

                  {/* Right: Client Name, Status Badge, and Initial Avatar Circle */}
                  <View className="flex-row items-center gap-3.5 flex-1 justify-end ml-3">
                    <View className="items-end flex-1">
                      <Text
                        className="text-white font-bold text-base text-right mb-1"
                        numberOfLines={1}
                      >
                        {client.name}
                      </Text>

                      {/* Status pill with dot */}
                      <View
                        className={`px-3 py-1 rounded-full flex-row items-center gap-1.5 ${badge.bg}`}
                      >
                        <View className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <Text className={`text-xs font-semibold ${badge.text}`}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Colored Initials Avatar Circle matching Screenshots */}
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: avatar.bg }}
                    >
                      <Text
                        className="text-base font-extrabold"
                        style={{ color: avatar.text }}
                      >
                        {initial}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Contact Information (Phone and Email) matching Screenshots */}
                <View className="pt-2.5 border-t border-[#1a2f4c] space-y-1.5">
                  {/* Phone */}
                  <View className="flex-row items-center justify-end gap-2">
                    <Text className="text-[#94a3b8] text-xs font-medium tracking-wide">
                      {client.phone}
                    </Text>
                    <Phone size={13} color="#64748b" />
                  </View>

                  {/* Email */}
                  {client.email ? (
                    <View className="flex-row items-center justify-end gap-2 mt-1">
                      <Text className="text-[#94a3b8] text-xs font-medium" numberOfLines={1}>
                        {client.email}
                      </Text>
                      <Mail size={13} color="#64748b" />
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button (+) matching image bottom right */}
      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#eab308] items-center justify-center shadow-lg shadow-[#eab308]/40 active:opacity-80"
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={28} color="#0b1422" strokeWidth={2.5} />
      </Pressable>

      {/* Add New Client Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#132238] rounded-t-3xl border-t border-[#1e3557] p-5 max-h-[85%]">
            <View className="flex-row items-center justify-between pb-3 border-b border-[#1e3557] mb-4">
              <Pressable
                className="w-8 h-8 rounded-full bg-[#1e2f4a] items-center justify-center"
                onPress={() => setShowAddModal(false)}
              >
                <X size={18} color="#f8fafc" />
              </Pressable>
              <Text className="text-white font-bold text-lg">إضافة موكل جديد</Text>
            </View>

            <ScrollView className="space-y-4 mb-4">
              {/* Client Type Selector */}
              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1.5">نوع الموكل</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    className={`flex-1 py-2.5 rounded-xl border flex-row items-center justify-center gap-2 ${
                      newType === 'company'
                        ? 'bg-[#eab308]/20 border-[#eab308]'
                        : 'bg-[#0b1422] border-[#1e3557]'
                    }`}
                    onPress={() => setNewType('company')}
                  >
                    <Building size={16} color={newType === 'company' ? '#eab308' : '#64748b'} />
                    <Text
                      className={`text-xs font-bold ${
                        newType === 'company' ? 'text-[#eab308]' : 'text-[#94a3b8]'
                      }`}
                    >
                      شركة / مؤسسة
                    </Text>
                  </Pressable>

                  <Pressable
                    className={`flex-1 py-2.5 rounded-xl border flex-row items-center justify-center gap-2 ${
                      newType === 'individual'
                        ? 'bg-[#eab308]/20 border-[#eab308]'
                        : 'bg-[#0b1422] border-[#1e3557]'
                    }`}
                    onPress={() => setNewType('individual')}
                  >
                    <User size={16} color={newType === 'individual' ? '#eab308' : '#64748b'} />
                    <Text
                      className={`text-xs font-bold ${
                        newType === 'individual' ? 'text-[#eab308]' : 'text-[#94a3b8]'
                      }`}
                    >
                      فرد / شخص
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">اسم الموكل أو الشركة *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="مثال: شركة النماء التجارية"
                  placeholderTextColor="#64748b"
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">رقم الهاتف *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="+966 50 000 0000"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={newPhone}
                  onChangeText={setNewPhone}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">البريد الإلكتروني</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="info@example.com"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  value={newEmail}
                  onChangeText={setNewEmail}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">العنوان أو المقر</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="المدينة والحي"
                  placeholderTextColor="#64748b"
                  value={newAddress}
                  onChangeText={setNewAddress}
                />
              </View>
            </ScrollView>

            <Pressable
              className="bg-[#eab308] py-3.5 rounded-xl items-center justify-center active:opacity-85"
              onPress={handleCreateClient}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0b1422" />
              ) : (
                <Text className="text-[#0b1422] font-bold text-base">تسجيل الموكل في النظام</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
