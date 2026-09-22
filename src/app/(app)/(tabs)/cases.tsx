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
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Search,
  SlidersHorizontal,
  Folder,
  Briefcase,
  Users,
  Home,
  FileText,
  Calendar,
  ChevronLeft,
  Plus,
  X,
  Check,
} from 'lucide-react-native';
import { OfficeHeader } from '@/components/OfficeHeader';
import { lawyerApi } from '@/client/lawyerApi';
import { Case } from '@/types/lawyer';

type CaseFilter = 'الكل' | 'منظورة' | 'مؤجلة' | 'منتهية';

export default function CasesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CaseFilter>('الكل');

  // New Case Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newOpponentName, setNewOpponentName] = useState('');
  const [newCourtName, setNewCourtName] = useState('محكمة الاستئناف');
  const [newCaseType, setNewCaseType] = useState('نزاع تجاري');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCases = useCallback(async () => {
    try {
      const data = await lawyerApi.getCases();
      setCases(data);
    } catch (err) {
      console.log('Error loading cases:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCases();
    }, [loadCases])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadCases();
  };

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesFilter =
        activeFilter === 'الكل' ? true : c.status === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.case_number.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.client_name.toLowerCase().includes(q) ||
        c.court_name.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [cases, activeFilter, searchQuery]);

  const handleCreateCase = async () => {
    if (!newCaseNumber || !newClientName) return;
    setIsSubmitting(true);
    try {
      await lawyerApi.addCase({
        case_number: newCaseNumber,
        case_year: '2026',
        title: newTitle || `قضية ${newCaseNumber} - ${newCaseType}`,
        client_name: newClientName,
        opponent_name: newOpponentName || 'الخصم المحدد',
        assigned_lawyer: 'أ. أحمد كامل',
        case_type: newCaseType,
        court_name: newCourtName,
        court_circle: 'الدائرة الأولى',
        status: 'منظورة',
        last_session_date: '2026/09/22',
        case_subject: 'دعوى قانونية جديدة مسجلة عبر تطبيق الجوال',
      });
      setShowAddModal(false);
      setNewCaseNumber('');
      setNewTitle('');
      setNewClientName('');
      setNewOpponentName('');
      loadCases();
    } catch (err) {
      console.log('Error adding case:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCaseIcon = (type: string, index: number) => {
    if (type.includes('نزاع') || index === 0) return <Briefcase size={20} color="#eab308" />;
    if (type.includes('ميراث') || type.includes('أسرة') || index === 1) return <Users size={20} color="#eab308" />;
    if (type.includes('عقار') || index === 2) return <Home size={20} color="#eab308" />;
    return <FileText size={20} color="#eab308" />;
  };

  return (
    <View className="flex-1 bg-[#0b1422]">
      {/* Header matching Image 4 */}
      <OfficeHeader
        title="مكتب المستشار أحمد كامل للمحاماة"
        subtitle="القضايا"
        onNotificationPress={() => {}}
      />

      {/* Search and Filter Row */}
      <View className="px-4 pt-3 pb-2 flex-row items-center gap-2.5">
        {/* Filter Button on left */}
        <Pressable
          className="w-12 h-12 rounded-xl bg-[#132238] border border-[#1e3557] items-center justify-center active:opacity-75"
          onPress={() => {
            const next: CaseFilter[] = ['الكل', 'منظورة', 'مؤجلة', 'منتهية'];
            const curIdx = next.indexOf(activeFilter);
            setActiveFilter(next[(curIdx + 1) % next.length]);
          }}
        >
          <SlidersHorizontal size={20} color="#eab308" />
        </Pressable>

        {/* Search input with search icon on right */}
        <View className="flex-1 h-12 rounded-xl bg-[#132238] border border-[#1e3557] flex-row items-center px-3.5 gap-2.5">
          <TextInput
            className="flex-1 text-white text-sm text-right pr-1"
            placeholder="ابحث برقم القضية أو اسم الموكل"
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Search size={18} color="#64748b" />
        </View>
      </View>

      {/* Status Filter Tabs (الكل / منظورة / مؤجلة / منتهية) */}
      <View className="px-4 py-2 flex-row justify-end gap-2">
        {(['الكل', 'منظورة', 'مؤجلة', 'منتهية'] as CaseFilter[]).map((tab) => {
          const isSelected = activeFilter === tab;
          return (
            <Pressable
              key={tab}
              className={`px-4 py-1.5 rounded-full border ${
                isSelected
                  ? 'border-[#eab308] bg-[#eab308]/15'
                  : 'border-[#1e3557] bg-[#132238]'
              } active:opacity-80`}
              onPress={() => setActiveFilter(tab)}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? 'text-[#eab308]' : 'text-[#94a3b8]'
                }`}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Cases List */}
      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />
        }
      >
        {loading ? (
          <ActivityIndicator color="#eab308" className="py-8" />
        ) : filteredCases.length === 0 ? (
          <View className="bg-[#132238] border border-[#1e3557] rounded-xl p-8 items-center justify-center my-6">
            <Folder size={40} color="#64748b" />
            <Text className="text-white font-bold text-base mt-3">لا توجد قضايا مطابقة</Text>
            <Text className="text-[#94a3b8] text-xs text-center mt-1">
              يمكنك تغيير معايير البحث أو إضافة قضية جديدة
            </Text>
          </View>
        ) : (
          filteredCases.map((c, idx) => (
            <Pressable
              key={c.id || idx}
              className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4 mb-3.5 active:opacity-85 shadow-sm"
              onPress={() =>
                router.push({
                  pathname: '/(app)/cases/[id]',
                  params: { id: c.id },
                })
              }
            >
              {/* Top Row: Status badge and Case Title with Type icon */}
              <View className="flex-row items-center justify-between mb-3">
                {/* Status pill on the left */}
                <View
                  className={`px-3 py-1 rounded-full ${
                    c.status === 'منظورة'
                      ? 'bg-[#059669]/20 border border-[#059669]/40'
                      : c.status === 'مؤجلة'
                      ? 'bg-[#d97706]/20 border border-[#d97706]/40'
                      : 'bg-[#475569]/30 border border-[#475569]/50'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
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

                {/* Case Title and Icon on the right */}
                <View className="flex-row items-center gap-3 flex-1 justify-end ml-2">
                  <Text
                    className="text-white font-bold text-base text-right flex-1"
                    numberOfLines={1}
                  >
                    {c.title}
                  </Text>
                  <View className="w-10 h-10 rounded-xl bg-[#1b2f4d] items-center justify-center border border-[#233d63]">
                    {getCaseIcon(c.case_type || c.title, idx)}
                  </View>
                </View>
              </View>

              {/* Bottom Row: Client Name, Last Session, and Chevron */}
              <View className="flex-row items-center justify-between pt-3 border-t border-[#1a2f4c]">
                <ChevronLeft size={18} color="#64748b" />

                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1.5">
                    <Calendar size={14} color="#64748b" />
                    <Text className="text-[#94a3b8] text-xs">
                      آخر جلسة:{' '}
                      <Text className="text-[#cbd5e1] font-medium">
                        {c.last_session_date || '2026/09/22'}
                      </Text>
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-[#94a3b8] text-xs">
                      الموكل:{' '}
                      <Text className="text-white font-semibold">
                        {c.client_name}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button (+) matching image bottom right */}
      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#eab308] items-center justify-center shadow-lg shadow-[#eab308]/40 active:opacity-80"
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={28} color="#0b1422" strokeWidth={2.5} />
      </Pressable>

      {/* Add New Case Modal */}
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
              <Text className="text-white font-bold text-lg">إضافة قضية جديدة</Text>
            </View>

            <ScrollView className="space-y-4 mb-4">
              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">رقم القضية *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="مثال: 145/2026"
                  placeholderTextColor="#64748b"
                  value={newCaseNumber}
                  onChangeText={setNewCaseNumber}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">عنوان أو وصف القضية</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="مثال: قضية 145/2026 - نزاع تجاري"
                  placeholderTextColor="#64748b"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">اسم الموكل *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="اسم الشخص أو الشركة"
                  placeholderTextColor="#64748b"
                  value={newClientName}
                  onChangeText={setNewClientName}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">اسم الخصم</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="الطرف المقابل في الدعوى"
                  placeholderTextColor="#64748b"
                  value={newOpponentName}
                  onChangeText={setNewOpponentName}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">المحكمة المختصة</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="محكمة الاستئناف / المحكمة العامة"
                  placeholderTextColor="#64748b"
                  value={newCourtName}
                  onChangeText={setNewCourtName}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">نوع القضية</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="نزاع تجاري / قسمة ميراث / إخلاء عقار"
                  placeholderTextColor="#64748b"
                  value={newCaseType}
                  onChangeText={setNewCaseType}
                />
              </View>
            </ScrollView>

            <Pressable
              className="bg-[#eab308] py-3.5 rounded-xl items-center justify-center active:opacity-85"
              onPress={handleCreateCase}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0b1422" />
              ) : (
                <Text className="text-[#0b1422] font-bold text-base">حفظ القضية في النظام</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
