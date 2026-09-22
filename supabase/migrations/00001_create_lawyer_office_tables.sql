CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_type TEXT DEFAULT 'company',
    name TEXT NOT NULL,
    national_id TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    phone2 TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    nationality TEXT DEFAULT 'سعودي',
    status TEXT DEFAULT 'active',
    cases_count INT DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT NOT NULL,
    case_year TEXT DEFAULT '2026',
    title TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    opponent_name TEXT DEFAULT '',
    assigned_lawyer TEXT DEFAULT 'أ. أحمد كامل',
    case_type TEXT DEFAULT 'نزاع تجاري',
    court_name TEXT DEFAULT 'محكمة الاستئناف',
    court_circle TEXT DEFAULT 'الدائرة التجارية الأولى',
    case_subject TEXT DEFAULT '',
    case_value NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'منظورة',
    last_session_date TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    session_date TEXT NOT NULL,
    session_time TEXT DEFAULT '09:30',
    court_name TEXT DEFAULT '',
    court_circle TEXT DEFAULT '',
    session_reason TEXT DEFAULT '',
    session_result TEXT DEFAULT '',
    status TEXT DEFAULT 'مجدولة',
    attending_lawyer TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size TEXT DEFAULT '2.4 ميجابايت',
    file_type TEXT DEFAULT 'pdf',
    file_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    due_date TEXT DEFAULT '',
    assigned_to TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated full read and write for this mobile management app
CREATE POLICY "Allow anon read clients" ON clients FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert clients" ON clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update clients" ON clients FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete clients" ON clients FOR DELETE TO anon USING (true);

CREATE POLICY "Allow auth read clients" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update clients" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth delete clients" ON clients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow anon read cases" ON cases FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert cases" ON cases FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update cases" ON cases FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete cases" ON cases FOR DELETE TO anon USING (true);

CREATE POLICY "Allow auth read cases" ON cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth insert cases" ON cases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update cases" ON cases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth delete cases" ON cases FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow anon read sessions" ON sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert sessions" ON sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update sessions" ON sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete sessions" ON sessions FOR DELETE TO anon USING (true);

CREATE POLICY "Allow auth read sessions" ON sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth insert sessions" ON sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update sessions" ON sessions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth delete sessions" ON sessions FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow anon read documents" ON documents FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert documents" ON documents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update documents" ON documents FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete documents" ON documents FOR DELETE TO anon USING (true);

CREATE POLICY "Allow auth read documents" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth insert documents" ON documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update documents" ON documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth delete documents" ON documents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow anon read tasks" ON tasks FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert tasks" ON tasks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update tasks" ON tasks FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete tasks" ON tasks FOR DELETE TO anon USING (true);

CREATE POLICY "Allow auth read tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth insert tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update tasks" ON tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth delete tasks" ON tasks FOR DELETE TO authenticated USING (true);
