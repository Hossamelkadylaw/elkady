DO $$
DECLARE
    c_noor UUID;
    c_khaled UUID;
    c_amal UUID;
    c_sara UUID;
    c_wafaa UUID;
    c_mona UUID;
    c_abdullah UUID;
    c_qahtani UUID;
    case_145 UUID;
    case_098 UUID;
    case_210 UUID;
    case_056 UUID;
BEGIN
    -- Insert clients
    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('شركة النور التجارية', 'company', '+966 11 234 5678', 'info@alnoor.com', 'نشط', 3, 'سعودي')
    RETURNING id INTO c_noor;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('خالد إبراهيم منصور', 'individual', '+966 50 987 6543', 'khaled.mansour@example.com', 'معلق', 1, 'سعودي')
    RETURNING id INTO c_khaled;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('مؤسسة الأمل العقارية', 'company', '+966 11 876 5432', 'info@alamalestates.com', 'نشط', 2, 'سعودي')
    RETURNING id INTO c_amal;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('سارة عبد الله محمد', 'individual', '+966 55 321 9876', 'sara.abdullah@example.com', 'مغلق', 0, 'سعودي')
    RETURNING id INTO c_sara;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('شركة الوفاء للمقاولات', 'company', '+966 53 111 2233', 'info@alwaffa.com', 'نشط', 4, 'سعودي')
    RETURNING id INTO c_wafaa;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('منى سعيد الحربي', 'individual', '+966 55 123 4567', 'mona@harbi.sa', 'مغلق', 1, 'سعودي')
    RETURNING id INTO c_mona;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('عبدالله محمد السالم', 'individual', '+966 50 321 9876', 'abdullah@alsalem.sa', 'نشط', 4, 'سعودي')
    RETURNING id INTO c_abdullah;

    INSERT INTO clients (name, client_type, phone, email, status, cases_count, nationality)
    VALUES ('سارة علي القحطاني', 'individual', '+966 53 654 3210', 'sarah@qahtani.sa', 'معلق', 2, 'سعودي')
    RETURNING id INTO c_qahtani;

    -- Insert cases
    INSERT INTO cases (case_number, case_year, title, client_id, client_name, opponent_name, assigned_lawyer, case_type, court_name, court_circle, status, last_session_date, case_subject)
    VALUES ('145/2026', '2026', 'قضية 145/2026 - نزاع تجاري', c_noor, 'شركة النور التجارية', 'مؤسسة الفجر للمقاولات', 'أ. سارة عبدالله', 'نزاع تجاري', 'محكمة الاستئناف', 'الدائرة التجارية الأولى', 'منظورة', '2026/09/22', 'مطالبة بمستحقات مقاولة وتوريد مواد إنشائية لمشروع برج السلام')
    RETURNING id INTO case_145;

    INSERT INTO cases (case_number, case_year, title, client_id, client_name, opponent_name, assigned_lawyer, case_type, court_name, court_circle, status, last_session_date, case_subject)
    VALUES ('098/2026', '2026', 'قضية 098/2026 - قسمة ميراث', c_khaled, 'أحمد محمد العتيبي', 'ورثة المرحوم سالم', 'أ. أحمد كامل', 'أحوال شخصية', 'محكمة الأحوال الشخصية', 'دائرة التركات الثالثة', 'مؤجلة', '2026/10/05', 'دعوى حصر وقسمة تركة عقارية ومالية')
    RETURNING id INTO case_098;

    INSERT INTO cases (case_number, case_year, title, client_id, client_name, opponent_name, assigned_lawyer, case_type, court_name, court_circle, status, last_session_date, case_subject)
    VALUES ('210/2026', '2026', 'قضية 210/2026 - إخلاء عقار', c_amal, 'سالم عبد الله الحربي', 'شركة ريادة للتجارة', 'أ. فهد المطيري', 'عقاري', 'المحكمة العامة', 'الدائرة الحقوقية الثانية', 'منظورة', '2026/09/28', 'إخلاء عقار تجاري لانتهاء مدة العقد وعدم سداد الأجرة')
    RETURNING id INTO case_210;

    INSERT INTO cases (case_number, case_year, title, client_id, client_name, opponent_name, assigned_lawyer, case_type, court_name, court_circle, status, last_session_date, case_subject)
    VALUES ('056/2025', '2025', 'قضية 056/2025 - نفقة', c_sara, 'نورة خالد السبيعي', 'محمد عبدالله الدوسري', 'أ. سارة عبدالله', 'أحوال شخصية', 'محكمة الأسرة', 'دائرة النفقات', 'منتهية', '2025/12/12', 'حكم قطعي بثبوت النفقة الماضية والمستقبلية')
    RETURNING id INTO case_056;

    -- Insert sessions for case 145/2026
    INSERT INTO sessions (case_id, session_date, session_time, court_name, court_circle, session_reason, session_result, status, attending_lawyer)
    VALUES 
    (case_145, '2026-08-12', '09:30', 'محكمة الاستئناف', 'الدائرة التجارية الأولى', 'جلسة مرافعة', 'تم تقديم المذكرة الجوابية وحجز الدعوى للرد', 'منتهية', 'أ. سارة عبدالله'),
    (case_145, '2026-09-03', '10:00', 'محكمة الاستئناف', 'الدائرة التجارية الأولى', 'تأجيل لتقديم مستندات', 'تم إمهال الخصم لتقديم كشف الحساب النهائي', 'مؤجلة', 'أ. سارة عبدالله'),
    (case_145, '2026-09-22', '11:15', 'محكمة الاستئناف', 'الدائرة التجارية الأولى', 'جلسة اليوم', 'مناقشة تقرير الخبير الهندسي وسماع الشهود', 'مجدولة', 'أ. سارة عبدالله');

    -- Insert sessions for other cases
    INSERT INTO sessions (case_id, session_date, session_time, court_name, court_circle, session_reason, session_result, status, attending_lawyer)
    VALUES 
    (case_210, '2026-09-28', '10:30', 'المحكمة العامة', 'الدائرة الحقوقية الثانية', 'جلسة النطق بالحكم', 'جلسة مخصصة للنطق بالحكم في طلب الإخلاء', 'مجدولة', 'أ. فهد المطيري'),
    (case_098, '2026-10-05', '09:00', 'محكمة الأحوال الشخصية', 'دائرة التركات الثالثة', 'جلسة فرز العقارات', 'حضور الخبير العقاري لبيان القسمة الرضائية', 'مجدولة', 'أ. أحمد كامل');

    -- Insert documents for case 145/2026
    INSERT INTO documents (case_id, title, file_name, file_size, file_type)
    VALUES 
    (case_145, 'عقد المقاولة', 'عقد المقاولة.pdf', '3.1 ميجابايت', 'pdf'),
    (case_145, 'محضر إثبات حالة', 'محضر إثبات حالة.pdf', '1.8 ميجابايت', 'pdf'),
    (case_145, 'صحيفة الدعوى', 'صحيفة الدعوى.pdf', '2.4 ميجابايت', 'pdf');

    -- Insert tasks
    INSERT INTO tasks (case_id, title, description, priority, status, due_date, assigned_to)
    VALUES 
    (case_145, 'إعداد مذكرة الرد على الخبير', 'دراسة تقرير الخبير وتقديم الاعتراضات الفنية قبل جلسة 22 سبتمبر', 'high', 'in_progress', '2026-09-22', 'أ. سارة عبدالله'),
    (case_210, 'إخطار المنفذ ضده بالإخلاء', 'تجهيز صحيفة التنفيذ والإنذار العدلي', 'medium', 'pending', '2026-09-25', 'أ. فهد المطيري'),
    (case_098, 'طلب كشف حسابات المتوفى', 'مخاطبة البنك المركزي لحصر الأرصدة البنكية', 'high', 'completed', '2026-09-10', 'أ. أحمد كامل');
END $$;