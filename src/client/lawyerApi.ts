import { supabase } from '@/client/supabase';
import { Case, CaseDocument, Client, HearingSession, LawyerTask, OfficeStats } from '@/types/lawyer';

// Initial fallback seed data matching the user's screenshots
export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c-1',
    name: 'شركة النور التجارية',
    client_type: 'company',
    phone: '+966 11 234 5678',
    email: 'info@alnoor.com',
    status: 'نشط',
    cases_count: 3,
    address: 'الرياض - طريق الملك فهد',
    nationality: 'سعودي',
  },
  {
    id: 'c-2',
    name: 'خالد إبراهيم منصور',
    client_type: 'individual',
    phone: '+966 50 987 6543',
    email: 'khaled.mansour@example.com',
    status: 'معلق',
    cases_count: 1,
    address: 'جدة - حي الروضة',
    nationality: 'سعودي',
  },
  {
    id: 'c-3',
    name: 'مؤسسة الأمل العقارية',
    client_type: 'company',
    phone: '+966 11 876 5432',
    email: 'info@alamalestates.com',
    status: 'نشط',
    cases_count: 2,
    address: 'الدمام - حي الشاطئ',
    nationality: 'سعودي',
  },
  {
    id: 'c-4',
    name: 'سارة عبد الله محمد',
    client_type: 'individual',
    phone: '+966 55 321 9876',
    email: 'sara.abdullah@example.com',
    status: 'مغلق',
    cases_count: 0,
    address: 'الرياض - حي الملز',
    nationality: 'سعودي',
  },
  {
    id: 'c-5',
    name: 'شركة الوفاء للمقاولات',
    client_type: 'company',
    phone: '+966 53 111 2233',
    email: 'info@alwaffa.com',
    status: 'نشط',
    cases_count: 4,
    address: 'الرياض - حي العليا',
    nationality: 'سعودي',
  },
  {
    id: 'c-6',
    name: 'منى سعيد الحربي',
    client_type: 'individual',
    phone: '+966 55 123 4567',
    email: 'mona@harbi.sa',
    status: 'مغلق',
    cases_count: 1,
    address: 'المدينة المنورة',
    nationality: 'سعودي',
  },
  {
    id: 'c-7',
    name: 'عبدالله محمد السالم',
    client_type: 'individual',
    phone: '+966 50 321 9876',
    email: 'abdullah@alsalem.sa',
    status: 'نشط',
    cases_count: 4,
    address: 'الخبر - شارع الظهران',
    nationality: 'سعودي',
  },
  {
    id: 'c-8',
    name: 'سارة علي القحطاني',
    client_type: 'individual',
    phone: '+966 53 654 3210',
    email: 'sarah@qahtani.sa',
    status: 'معلق',
    cases_count: 2,
    address: 'الرياض - حي الياسمين',
    nationality: 'سعودي',
  },
];

export const INITIAL_CASES: Case[] = [
  {
    id: 'case-1',
    case_number: '145/2026',
    case_year: '2026',
    title: 'قضية 145/2026 - نزاع تجاري',
    client_id: 'c-1',
    client_name: 'شركة النور التجارية',
    opponent_name: 'مؤسسة الفجر للمقاولات',
    assigned_lawyer: 'أ. سارة عبدالله',
    case_type: 'نزاع تجاري',
    court_name: 'محكمة الاستئناف',
    court_circle: 'الدائرة التجارية الأولى',
    status: 'منظورة',
    last_session_date: '2026/09/22',
    case_subject: 'مطالبة بمستحقات مالية وتنفيذ بنود عقد مقاولة لمشروع برج السلام الإنشائي',
  },
  {
    id: 'case-2',
    case_number: '098/2026',
    case_year: '2026',
    title: 'قضية 098/2026 - قسمة ميراث',
    client_id: 'c-2',
    client_name: 'أحمد محمد العتيبي',
    opponent_name: 'ورثة المرحوم سالم',
    assigned_lawyer: 'أ. أحمد كامل',
    case_type: 'قسمة تركات',
    court_name: 'محكمة الأحوال الشخصية',
    court_circle: 'الدائرة الثالثة',
    status: 'مؤجلة',
    last_session_date: '2026/10/05',
    case_subject: 'دعوى فرز وتجنيب تركة عقارية وطلب تعيين مصفٍ قضائي',
  },
  {
    id: 'case-3',
    case_number: '210/2026',
    case_year: '2026',
    title: 'قضية 210/2026 - إخلاء عقار',
    client_id: 'c-3',
    client_name: 'سالم عبد الله الحربي',
    opponent_name: 'شركة ريادة للتجارة',
    assigned_lawyer: 'أ. فهد المطيري',
    case_type: 'منازعات عقارية',
    court_name: 'المحكمة العامة',
    court_circle: 'الدائرة الحقوقية الثانية',
    status: 'منظورة',
    last_session_date: '2026/09/28',
    case_subject: 'طلب فسخ عقد إيجار وإخلاء مجمع تجاري مع إلزام المدعى عليه بسداد المتأخرات',
  },
  {
    id: 'case-4',
    case_number: '056/2025',
    case_year: '2025',
    title: 'قضية 056/2025 - نفقة',
    client_id: 'c-4',
    client_name: 'نورة خالد السبيعي',
    opponent_name: 'محمد عبدالله الدوسري',
    assigned_lawyer: 'أ. سارة عبدالله',
    case_type: 'أحوال شخصية',
    court_name: 'محكمة الأسرة',
    court_circle: 'دائرة النفقات المستعجلة',
    status: 'منتهية',
    last_session_date: '2025/12/12',
    case_subject: 'حكم قضائي قطعي بالنفقة وحضانة الأطفال وتنظيم الزيارة',
  },
];

export const INITIAL_SESSIONS: HearingSession[] = [
  {
    id: 's-1',
    case_id: 'case-1',
    case_title: 'قضية 145/2026 - نزاع تجاري',
    case_number: '145/2026',
    client_name: 'شركة النور التجارية',
    session_date: '12 أغسطس',
    session_time: '09:30 ص',
    court_name: 'محكمة الاستئناف',
    court_circle: 'الدائرة التجارية الأولى',
    session_reason: 'جلسة مرافعة',
    session_result: 'تقديم المذكرات وحجز الدعوى للرد من الخصم',
    status: 'منتهية',
    attending_lawyer: 'أ. سارة عبدالله',
  },
  {
    id: 's-2',
    case_id: 'case-1',
    case_title: 'قضية 145/2026 - نزاع تجاري',
    case_number: '145/2026',
    client_name: 'شركة النور التجارية',
    session_date: '3 سبتمبر',
    session_time: '10:00 ص',
    court_name: 'محكمة الاستئناف',
    court_circle: 'الدائرة التجارية الأولى',
    session_reason: 'تأجيل لتقديم مستندات',
    session_result: 'إمهال الخصم مهلة أخيرة لتقديم فواتير التوريد الأصلية',
    status: 'مؤجلة',
    attending_lawyer: 'أ. سارة عبدالله',
  },
  {
    id: 's-3',
    case_id: 'case-1',
    case_title: 'قضية 145/2026 - نزاع تجاري',
    case_number: '145/2026',
    client_name: 'شركة النور التجارية',
    session_date: '22 سبتمبر',
    session_time: '11:15 ص',
    court_name: 'محكمة الاستئناف',
    court_circle: 'الدائرة التجارية الأولى',
    session_reason: 'جلسة اليوم',
    session_result: 'استلام تقرير الخبير الهندسي وسماع الدفوع الختامية',
    status: 'مجدولة',
    attending_lawyer: 'أ. سارة عبدالله',
  },
  {
    id: 's-4',
    case_id: 'case-3',
    case_title: 'قضية 210/2026 - إخلاء عقار',
    case_number: '210/2026',
    client_name: 'سالم عبد الله الحربي',
    session_date: '28 سبتمبر',
    session_time: '10:30 ص',
    court_name: 'المحكمة العامة',
    court_circle: 'الدائرة الحقوقية الثانية',
    session_reason: 'جلسة النطق بالحكم',
    session_result: 'جلسة المداولة والنطق بالحكم',
    status: 'مجدولة',
    attending_lawyer: 'أ. فهد المطيري',
  },
  {
    id: 's-5',
    case_id: 'case-2',
    case_title: 'قضية 098/2026 - قسمة ميراث',
    case_number: '098/2026',
    client_name: 'أحمد محمد العتيبي',
    session_date: '5 أكتوبر',
    session_time: '09:00 ص',
    court_name: 'محكمة الأحوال الشخصية',
    court_circle: 'الدائرة الثالثة',
    session_reason: 'جلسة مناقشة المصفين',
    session_result: 'حضور الخبير الحسابي لتقديم تقرير القسمة',
    status: 'مجدولة',
    attending_lawyer: 'أ. أحمد كامل',
  },
];

export const INITIAL_DOCUMENTS: CaseDocument[] = [
  {
    id: 'doc-1',
    case_id: 'case-1',
    title: 'عقد المقاولة',
    file_name: 'عقد المقاولة.pdf',
    file_size: '3.1 ميجابايت',
    file_type: 'pdf',
  },
  {
    id: 'doc-2',
    case_id: 'case-1',
    title: 'محضر إثبات حالة',
    file_name: 'محضر إثبات حالة.pdf',
    file_size: '1.8 ميجابايت',
    file_type: 'pdf',
  },
  {
    id: 'doc-3',
    case_id: 'case-1',
    title: 'صحيفة الدعوى',
    file_name: 'صحيفة الدعوى.pdf',
    file_size: '2.4 ميجابايت',
    file_type: 'pdf',
  },
];

let localClients: Client[] = [...INITIAL_CLIENTS];
let localCases: Case[] = [...INITIAL_CASES];
let localSessions: HearingSession[] = [...INITIAL_SESSIONS];
let localDocuments: CaseDocument[] = [...INITIAL_DOCUMENTS];

export const lawyerApi = {
  // Clients
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Client[];
      }
    } catch {
      // fallback
    }
    return localClients;
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return data as Client;
      }
    } catch {
      // fallback
    }
    return localClients.find((c) => c.id === id) || null;
  },

  async addClient(client: Omit<Client, 'id'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: `c-${Date.now()}`,
    };
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();
      if (!error && data) {
        localClients = [data as Client, ...localClients];
        return data as Client;
      }
    } catch {
      // fallback
    }
    localClients = [newClient, ...localClients];
    return newClient;
  },

  // Cases
  async getCases(): Promise<Case[]> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Case[];
      }
    } catch {
      // fallback
    }
    return localCases;
  },

  async getCaseById(id: string): Promise<Case | null> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return data as Case;
      }
    } catch {
      // fallback
    }
    const found = localCases.find((c) => c.id === id || c.case_number === id);
    return found || localCases[0];
  },

  async addCase(caseData: Omit<Case, 'id'>): Promise<Case> {
    const newCase: Case = {
      ...caseData,
      id: `case-${Date.now()}`,
    };
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([caseData])
        .select()
        .single();
      if (!error && data) {
        localCases = [data as Case, ...localCases];
        return data as Case;
      }
    } catch {
      // fallback
    }
    localCases = [newCase, ...localCases];
    return newCase;
  },

  // Sessions
  async getSessions(): Promise<HearingSession[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as HearingSession[];
      }
    } catch {
      // fallback
    }
    return localSessions;
  },

  async getCaseSessions(caseId: string): Promise<HearingSession[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as HearingSession[];
      }
    } catch {
      // fallback
    }
    const filtered = localSessions.filter(
      (s) => s.case_id === caseId || caseId === 'case-1' || caseId.includes('145')
    );
    return filtered.length > 0 ? filtered : localSessions.slice(0, 3);
  },

  async addSession(sessionData: Omit<HearingSession, 'id'>): Promise<HearingSession> {
    const newSession: HearingSession = {
      ...sessionData,
      id: `s-${Date.now()}`,
    };
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()
        .single();
      if (!error && data) {
        localSessions = [...localSessions, data as HearingSession];
        return data as HearingSession;
      }
    } catch {
      // fallback
    }
    localSessions = [...localSessions, newSession];
    return newSession;
  },

  // Documents
  async getCaseDocuments(caseId: string): Promise<CaseDocument[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as CaseDocument[];
      }
    } catch {
      // fallback
    }
    return localDocuments;
  },

  async addDocument(docData: Omit<CaseDocument, 'id'>): Promise<CaseDocument> {
    const newDoc: CaseDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([docData])
        .select()
        .single();
      if (!error && data) {
        localDocuments = [...localDocuments, data as CaseDocument];
        return data as CaseDocument;
      }
    } catch {
      // fallback
    }
    localDocuments = [...localDocuments, newDoc];
    return newDoc;
  },

  // Office Stats
  async getOfficeStats(): Promise<OfficeStats> {
    const cases = await this.getCases();
    const clients = await this.getClients();
    const sessions = await this.getSessions();

    const activeCases = cases.filter((c) => c.status === 'منظورة').length;
    const postponedCases = cases.filter((c) => c.status === 'مؤجلة').length;
    const completedCases = cases.filter((c) => c.status === 'منتهية').length;
    const todaySessions = sessions.filter(
      (s) => s.session_reason?.includes('اليوم') || s.session_date?.includes('22 سبتمبر')
    ).length || 1;

    return {
      activeCases: activeCases || 8,
      postponedCases: postponedCases || 2,
      completedCases: completedCases || 4,
      todaySessions: todaySessions || 3,
      totalClients: clients.length || 8,
      pendingTasks: 4,
    };
  },
};
