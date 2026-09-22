export interface Client {
  id: string;
  name: string;
  client_type: 'company' | 'individual';
  national_id?: string;
  phone: string;
  phone2?: string;
  email: string;
  address?: string;
  nationality?: string;
  status: 'نشط' | 'معلق' | 'مغلق' | 'active' | 'pending' | 'closed';
  cases_count: number;
  notes?: string;
  created_at?: string;
}

export interface Case {
  id: string;
  case_number: string;
  case_year: string;
  title: string;
  client_id?: string;
  client_name: string;
  opponent_name: string;
  assigned_lawyer: string;
  case_type: string;
  court_name: string;
  court_circle: string;
  case_subject?: string;
  case_value?: number;
  status: 'منظورة' | 'مؤجلة' | 'منتهية';
  last_session_date: string;
  notes?: string;
  created_at?: string;
}

export interface HearingSession {
  id: string;
  case_id: string;
  case_title?: string;
  case_number?: string;
  client_name?: string;
  session_date: string;
  session_time?: string;
  court_name: string;
  court_circle?: string;
  session_reason: string;
  session_result?: string;
  status: 'مجدولة' | 'منتهية' | 'مؤجلة';
  attending_lawyer: string;
  created_at?: string;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  title: string;
  file_name: string;
  file_size: string;
  file_type: string;
  file_url?: string;
  created_at?: string;
}

export interface LawyerTask {
  id: string;
  case_id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to: string;
  created_at?: string;
}

export interface OfficeStats {
  activeCases: number;
  postponedCases: number;
  completedCases: number;
  todaySessions: number;
  totalClients: number;
  pendingTasks: number;
}
