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
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Scale,
} from 'lucide-react-native';
import { OfficeHeader } from '@/components/OfficeHeader';
import { lawyerApi } from '@/client/lawyerApi';
import { HearingSession, Case } from '@/types/lawyer';

type SessionFilter = 'الكل' | 'جلسات اليوم' | 'المجدولة' | 'المنتهية';

export default function SessionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessions, setSessions] = useState<HearingSession[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [activeFilter, setActiveFilter] = useState<SessionFilter>('الكل');

  // Add Session Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [sessionDate, setSessionDate] = useState('2026/09/22');
  const [sessionTime, setSessionTime] = useState('10:00 ص');
  const [courtName, setCourtName] = useState('محكمة الاستئناف');
  const [courtCircle, setCourtCircle] = useState('الدائرة الأولى');
  const [sessionReason, setSessionReason] = useState('جلسة مرافعة');
  const [attendingLawyer, setAttendingLawyer] = useState('أ. سارة عبدالله');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const [sData, cData] = await Promise.all([
        lawyerApi.getSessions(),
        lawyerApi.getCases(),
      ]);
      setSessions(sData);
      setCases(cData);
      if (cData.length > 0 && !selectedCaseId) {
        setSelectedCaseId(cData[0].id);
      }
    } catch (err) {
      console.log('Error loading sessions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCaseId]);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadSessions();
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (activeFilter === 'الكل') return true;
      if (activeFilter === 'جلسات اليوم') {
        return (
          s.session_reason?.includes('اليوم') ||
          s.session_date?.includes('22 سبتمبر') ||
          s.session_date?.includes('2026/09/22')
        );
      }
      if (activeFilter === 'المجدولة') return s.status === 'مجدولة';
      if (activeFilter === 'المنتهية') return s.status === 'منتهية';
      return true;
    });
  }, [sessions, activeFilter]);

  const handleCreateSession = async () => {
    if (!sessionReason) return;
    setIsSubmitting(true);
    try {
      const matchedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
      await lawyerApi.addSession({
        case_id: matchedCase?.id || 'case-1',
        case_title: matchedCase?.title || 'قضية نزاع تجاري',
        case_number: matchedCase?.case_number || '145/2026',
        client_name: matchedCase?.client_name || 'شركة النور التجارية',
        session_date: sessionDate,
        session_time: sessionTime,
        court_name: courtName || matchedCase?.court_name || 'محكمة الاستئناف',
        court_circle: courtCircle || matchedCase?.court_circle || 'الدائرة التجارية الأولى',
        session_reason: sessionReason,
        session_result: 'مجدولة في الرول',
        status: 'مجدولة',
        attending_lawyer: attendingLawyer,
      });
      setShowAddModal(false);
      setSessionReason('');
      loadSessions();
    } catch (err) {
      console.log('Error adding session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0b1422]">
      <OfficeHeader
        title="مكتب المستشار أحمد كامل للمحاماة"
        subtitle="جدول الجلسات والرول القضائي"
        onNotificationPress={() => {}}
      />

      {/* Filter Tabs */}
      <View className="px-4 py-3 flex-row justify-end gap-2">
        {(['الكل', 'جلسات اليوم', 'المجدولة', 'المنتهية'] as SessionFilter[]).map((tab) => {
          const isSelected = activeFilter === tab;
          return (
            <Pressable
              key={tab}
              className={`px-3.5 py-1.5 rounded-full border ${
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

      {/* Sessions List */}
      <ScrollView
        className="flex-1 px-4 pt-1"
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />
        }
      >
        {loading ? (
          <ActivityIndicator color="#eab308" className="py-8" />
        ) : filteredSessions.length === 0 ? (
          <View className="bg-[#132238] border border-[#1e3557] rounded-xl p-8 items-center justify-center my-6">
            <Calendar size={40} color="#64748b" />
            <Text className="text-white font-bold text-base mt-3">لا توجد جلسات مجدولة</Text>
            <Text className="text-[#94a3b8] text-xs text-center mt-1">
              يمكنك جدولة جلسة جديدة باستخدام زر الإضافة في الأسفل
            </Text>
          </View>
        ) : (
          filteredSessions.map((s, idx) => {
            const isToday =
              s.session_reason?.includes('اليوم') ||
              s.session_date?.includes('22 سبتمبر') ||
              s.session_date?.includes('2026/09/22');
            const isCompleted = s.status === 'منتهية';

            return (
              <Pressable
                key={s.id || idx}
                className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4 mb-3.5 active:opacity-85 shadow-sm"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/cases/[id]',
                    params: { id: s.case_id },
                  })
                }
              >
                {/* Top Row: Time, Date and Status */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-2">
                    <View
                      className={`px-2.5 py-0.5 rounded-full ${
                        isToday
                          ? 'bg-[#eab308]/20 border border-[#eab308]'
                          : isCompleted
                          ? 'bg-[#059669]/20 border border-[#059669]/40'
                          : 'bg-[#d97706]/20 border border-[#d97706]/40'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isToday
                            ? 'text-[#eab308]'
                            : isCompleted
                            ? 'text-[#10b981]'
                            : 'text-[#f59e0b]'
                        }`}
                      >
                        {isToday ? 'جلسة اليوم' : s.status}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1 bg-[#0b1422] px-2 py-0.5 rounded-md border border-[#1e3557]">
                      <Clock size={12} color="#94a3b8" />
                      <Text className="text-[#cbd5e1] text-xs font-medium">
                        {s.session_time || '10:00 ص'}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-white font-bold text-sm text-right">
                    {s.session_date}
                  </Text>
                </View>

                {/* Session Reason and Case Title */}
                <Text className="text-white font-bold text-base text-right mb-1">
                  {s.session_reason}
                </Text>

                <Text className="text-[#eab308] text-xs text-right font-medium mb-3">
                  {s.case_title || `قضية رقم ${s.case_number || '145/2026'}`}
                </Text>

                {/* Court and Lawyer Details */}
                <View className="pt-2.5 border-t border-[#1a2f4c] flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5">
                    <User size={13} color="#64748b" />
                    <Text className="text-[#94a3b8] text-xs">
                      {s.attending_lawyer || 'أ. سارة عبدالله'}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-[#cbd5e1] text-xs font-medium">
                      {s.court_name} {s.court_circle ? `(${s.court_circle})` : ''}
                    </Text>
                    <Scale size={13} color="#eab308" />
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button (+) */}
      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#eab308] items-center justify-center shadow-lg shadow-[#eab308]/40 active:opacity-80"
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={28} color="#0b1422" strokeWidth={2.5} />
      </Pressable>

      {/* Add New Session Modal */}
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
              <Text className="text-white font-bold text-lg">جدولة جلسة محكمة</Text>
            </View>

            <ScrollView className="space-y-4 mb-4">
              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">القضية المرتبطة</Text>
                <View className="bg-[#0b1422] border border-[#1e3557] rounded-xl p-2.5">
                  <Text className="text-white text-xs text-right font-medium">
                    {cases.find((c) => c.id === selectedCaseId)?.title || 'قضية 145/2026 - نزاع تجاري'}
                  </Text>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">تاريخ الجلسة *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="2026/10/12"
                  placeholderTextColor="#64748b"
                  value={sessionDate}
                  onChangeText={setSessionDate}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">الوقت</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="10:00 ص"
                  placeholderTextColor="#64748b"
                  value={sessionTime}
                  onChangeText={setSessionTime}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">المحكمة</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="محكمة الاستئناف / المحكمة العامة"
                  placeholderTextColor="#64748b"
                  value={courtName}
                  onChangeText={setCourtName}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">موضوع أو سبب الجلسة *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="مرافعة / سماع شهود / تقديم مذكرات"
                  placeholderTextColor="#64748b"
                  value={sessionReason}
                  onChangeText={setSessionReason}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">المحامي المكلف بالحضور</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="أ. سارة عبدالله"
                  placeholderTextColor="#64748b"
                  value={attendingLawyer}
                  onChangeText={setAttendingLawyer}
                />
              </View>
            </ScrollView>

            <Pressable
              className="bg-[#eab308] py-3.5 rounded-xl items-center justify-center active:opacity-85"
              onPress={handleCreateSession}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0b1422" />
              ) : (
                <Text className="text-[#0b1422] font-bold text-base">إضافة الجلسة للرول</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
