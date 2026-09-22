import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import {
  Scale,
  Users,
  Calendar,
  FileText,
  ChevronRight,
  MoreVertical,
  Plus,
  CheckCircle2,
  Clock,
  X,
  Share2,
} from 'lucide-react-native';
import { lawyerApi } from '@/client/lawyerApi';
import { Case, CaseDocument, HearingSession } from '@/types/lawyer';

export default function CaseDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = typeof params.id === 'string' ? params.id : 'case-1';

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [sessions, setSessions] = useState<HearingSession[]>([]);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // New Hearing Modal State
  const [showAddHearingModal, setShowAddHearingModal] = useState(false);
  const [hearingDate, setHearingDate] = useState('2026/10/15');
  const [hearingTime, setHearingTime] = useState('10:00 ص');
  const [hearingReason, setHearingReason] = useState('جلسة مرافعة وتقديم مستندات');
  const [attendingLawyer, setAttendingLawyer] = useState('أ. سارة عبدالله');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCaseDetails = useCallback(async () => {
    try {
      const [c, s, d] = await Promise.all([
        lawyerApi.getCaseById(caseId),
        lawyerApi.getCaseSessions(caseId),
        lawyerApi.getCaseDocuments(caseId),
      ]);
      setCaseData(c);
      setSessions(s);
      setDocuments(d);
    } catch (err) {
      console.log('Error loading case details:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useFocusEffect(
    useCallback(() => {
      loadCaseDetails();
    }, [loadCaseDetails])
  );

  const handleAddHearing = async () => {
    if (!hearingReason) return;
    setIsSubmitting(true);
    try {
      await lawyerApi.addSession({
        case_id: caseId,
        case_title: caseData?.title || 'قضية 145/2026',
        case_number: caseData?.case_number || '145/2026',
        client_name: caseData?.client_name || 'شركة النور التجارية',
        session_date: hearingDate,
        session_time: hearingTime,
        court_name: caseData?.court_name || 'محكمة الاستئناف',
        court_circle: caseData?.court_circle || 'الدائرة التجارية الأولى',
        session_reason: hearingReason,
        session_result: 'مجدولة',
        status: 'مجدولة',
        attending_lawyer: attendingLawyer,
      });
      setShowAddHearingModal(false);
      setHearingReason('');
      loadCaseDetails();
    } catch (err) {
      console.log('Error adding hearing:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !caseData) {
    return (
      <View className="flex-1 bg-[#0b1422] items-center justify-center">
        <ActivityIndicator color="#eab308" size="large" />
      </View>
    );
  }

  const currentCase = caseData || {
    id: 'case-1',
    case_number: '145/2026',
    case_year: '2026',
    title: 'قضية 145/2026 - نزاع تجاري',
    client_name: 'شركة النور التجارية',
    opponent_name: 'مؤسسة الفجر للمقاولات',
    assigned_lawyer: 'أ. سارة عبدالله',
    case_type: 'نزاع تجاري',
    court_name: 'محكمة الاستئناف',
    court_circle: 'الدائرة التجارية الأولى',
    status: 'منظورة',
    last_session_date: '2026/09/22',
  };

  return (
    <View className="flex-1 bg-[#0b1422]">
      {/* Header matching Image 3 */}
      <View className="bg-[#0b1422] px-4 pt-12 pb-3 border-b border-[#162740] flex-row items-center justify-between">
        <Pressable
          className="w-10 h-10 rounded-full bg-[#132238] border border-[#1e3557] items-center justify-center active:opacity-75"
          onPress={() => {}}
        >
          <MoreVertical size={20} color="#f8fafc" />
        </Pressable>

        <Text className="text-white text-lg font-bold text-center">تفاصيل القضية</Text>

        <Pressable
          className="w-10 h-10 rounded-full bg-[#132238] border border-[#1e3557] items-center justify-center active:opacity-75"
          onPress={() => router.back()}
        >
          <ChevronRight size={22} color="#f8fafc" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Hero Card matching Image 3 */}
        <View className="bg-[#132238] border border-[#1e3557] rounded-2xl p-5 mb-4">
          <View className="flex-row items-start justify-between">
            <View className="w-14 h-14 rounded-full bg-[#1b2f4d] border border-[#eab308]/40 items-center justify-center">
              <Scale size={28} color="#eab308" />
            </View>

            <View className="flex-1 items-end mr-3">
              <Text className="text-white text-xl font-bold text-right mb-1">
                قضية رقم {currentCase.case_number}
              </Text>
              <Text className="text-[#94a3b8] text-xs text-right">
                {currentCase.case_type} - {currentCase.court_name}
              </Text>

              {/* Status Badge with Yellow Dot */}
              <View className="mt-3 bg-[#1e2f4a] border border-[#eab308]/30 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                <Text className="text-[#eab308] text-xs font-semibold">
                  الحالة: {currentCase.status}
                </Text>
                <View className="w-2 h-2 rounded-full bg-[#eab308]" />
              </View>
            </View>
          </View>
        </View>

        {/* Parties Card (أطراف القضية) */}
        <View className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4.5 mb-4">
          <View className="flex-row items-center justify-end gap-2 mb-3.5 pb-2 border-b border-[#1a2f4c]">
            <Text className="text-white font-bold text-base text-right">أطراف القضية</Text>
            <Users size={18} color="#eab308" />
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-white font-semibold text-sm">
                {currentCase.client_name}
              </Text>
              <Text className="text-[#94a3b8] text-sm">الموكل:</Text>
            </View>

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-white font-semibold text-sm">
                {currentCase.opponent_name || 'مؤسسة الفجر للمقاولات'}
              </Text>
              <Text className="text-[#94a3b8] text-sm">الخصم:</Text>
            </View>

            <View className="flex-row items-center justify-between py-1">
              <Text className="text-[#eab308] font-semibold text-sm">
                {currentCase.assigned_lawyer || 'أ. سارة عبدالله'}
              </Text>
              <Text className="text-[#94a3b8] text-sm">المحامي المسؤول:</Text>
            </View>
          </View>
        </View>

        {/* Hearings Timeline (جلسات القضية) */}
        <View className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4.5 mb-4">
          <View className="flex-row items-center justify-end gap-2 mb-3.5 pb-2 border-b border-[#1a2f4c]">
            <Text className="text-white font-bold text-base text-right">جلسات القضية</Text>
            <Calendar size={18} color="#eab308" />
          </View>

          <View className="relative pl-3">
            {sessions.map((session, index) => {
              const isLast = index === sessions.length - 1;
              const isToday =
                session.session_reason?.includes('اليوم') ||
                session.session_date?.includes('22 سبتمبر');
              const isCompleted = session.status === 'منتهية';

              return (
                <View key={session.id || index} className="flex-row items-start mb-4">
                  {/* Status Indicator Icon on Left */}
                  <View className="items-center mr-3 mt-1">
                    {isCompleted ? (
                      <View className="w-5 h-5 rounded-full bg-[#059669]/20 items-center justify-center">
                        <CheckCircle2 size={16} color="#10b981" />
                      </View>
                    ) : isToday ? (
                      <View className="w-5 h-5 rounded-full border-2 border-[#eab308] items-center justify-center bg-[#eab308]/20">
                        <View className="w-2 h-2 rounded-full bg-[#eab308]" />
                      </View>
                    ) : (
                      <View className="w-5 h-5 rounded-full bg-[#d97706]/30 items-center justify-center">
                        <Clock size={14} color="#f59e0b" />
                      </View>
                    )}
                    {!isLast && <View className="w-0.5 h-10 bg-[#1e3557] mt-1" />}
                  </View>

                  {/* Hearing Information */}
                  <View className="flex-1 items-end">
                    <Text className="text-white font-bold text-sm text-right">
                      {session.session_date}
                    </Text>
                    <Text className="text-[#94a3b8] text-xs text-right mt-0.5">
                      {session.session_reason}
                    </Text>
                    {session.session_result ? (
                      <Text className="text-[#cbd5e1] text-xs text-right mt-1 bg-[#0b1422] px-2 py-1 rounded-md border border-[#1a2f4c]">
                        {session.session_result}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Attached Documents (المستندات المرفقة) */}
        <View className="bg-[#132238] border border-[#1e3557] rounded-2xl p-4.5 mb-6">
          <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-[#1a2f4c]">
            <Pressable className="flex-row items-center gap-1" onPress={() => {}}>
              <ChevronRight size={14} color="#94a3b8" />
              <Text className="text-[#94a3b8] text-xs font-semibold">عرض الكل</Text>
            </Pressable>

            <View className="flex-row items-center gap-2">
              <Text className="text-white font-bold text-base text-right">المستندات المرفقة</Text>
              <FileText size={18} color="#eab308" />
            </View>
          </View>

          {/* Documents Grid / Row matching Image 3 */}
          <View className="flex-row flex-wrap gap-2.5 justify-between">
            {documents.map((doc, idx) => (
              <View
                key={doc.id || idx}
                className="flex-1 min-w-[30%] bg-[#0b1422] border border-[#1e3557] rounded-xl p-3 items-center"
              >
                {/* Red PDF Badge */}
                <View className="w-9 h-11 bg-[#dc2626] rounded-md items-center justify-center mb-2 shadow-sm">
                  <Text className="text-white text-[10px] font-extrabold tracking-tighter">PDF</Text>
                </View>

                <Text
                  className="text-white text-xs font-semibold text-center mb-1 w-full"
                  numberOfLines={1}
                >
                  {doc.title || doc.file_name}
                </Text>
                <Text className="text-[#94a3b8] text-[10px] text-center mb-2">
                  {doc.file_size || '2.4 ميجابايت'}
                </Text>

                <Pressable className="p-1 active:opacity-75" onPress={() => {}}>
                  <MoreVertical size={14} color="#64748b" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button: "+ إضافة جلسة جديدة" matching Image 3 */}
      <View className="absolute bottom-4 left-4 right-4">
        <Pressable
          className="w-full bg-[#132238] border-2 border-[#eab308] py-4 rounded-full flex-row items-center justify-center gap-2.5 shadow-lg shadow-black/40 active:opacity-85"
          onPress={() => setShowAddHearingModal(true)}
        >
          <Plus size={20} color="#eab308" />
          <Text className="text-[#eab308] font-bold text-base">إضافة جلسة جديدة</Text>
        </Pressable>
      </View>

      {/* Add New Hearing Modal */}
      <Modal visible={showAddHearingModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#132238] rounded-t-3xl border-t border-[#1e3557] p-5 max-h-[80%]">
            <View className="flex-row items-center justify-between pb-3 border-b border-[#1e3557] mb-4">
              <Pressable
                className="w-8 h-8 rounded-full bg-[#1e2f4a] items-center justify-center"
                onPress={() => setShowAddHearingModal(false)}
              >
                <X size={18} color="#f8fafc" />
              </Pressable>
              <Text className="text-white font-bold text-lg">جدولة جلسة جديدة</Text>
            </View>

            <View className="space-y-3 mb-4">
              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">تاريخ الجلسة *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="2026/10/15"
                  placeholderTextColor="#64748b"
                  value={hearingDate}
                  onChangeText={setHearingDate}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">توقيت الجلسة</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="10:00 ص"
                  placeholderTextColor="#64748b"
                  value={hearingTime}
                  onChangeText={setHearingTime}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">سبب أو موضوع الجلسة *</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="مرافعة / تقديم مذكرات / سماع شهود"
                  placeholderTextColor="#64748b"
                  value={hearingReason}
                  onChangeText={setHearingReason}
                />
              </View>

              <View className="mb-3">
                <Text className="text-[#94a3b8] text-xs text-right mb-1">المحامي الحاضر</Text>
                <TextInput
                  className="bg-[#0b1422] border border-[#1e3557] rounded-xl px-3.5 py-2.5 text-white text-right text-sm"
                  placeholder="أ. سارة عبدالله"
                  placeholderTextColor="#64748b"
                  value={attendingLawyer}
                  onChangeText={setAttendingLawyer}
                />
              </View>
            </View>

            <Pressable
              className="bg-[#eab308] py-3.5 rounded-xl items-center justify-center active:opacity-85"
              onPress={handleAddHearing}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0b1422" />
              ) : (
                <Text className="text-[#0b1422] font-bold text-base">تأكيد إدراج الجلسة</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
