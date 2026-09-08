import type { IMethod, ISampleExample, IPipelineCombination, ICliExecution, IUploadGuide } from '@/data/types';

/**
 * Curated high-fidelity sample inputs & outputs for Al-Maktaba workflows.
 * Enables users to inspect realistic source documents (uploads) and the
 * resulting verified outputs produced by each method.
 */
const CURATED_SAMPLES: Record<
    string,
    {
        sampleInput: ISampleExample;
        sampleOutput: ISampleExample;
        pipelines: IPipelineCombination[];
        uploadGuide: IUploadGuide;
    }
> = {
    'gov-arabic-correspondence': {
        sampleInput: {
            title: 'ملف موجز التوجيه والنقاط المطلوب تضمينها',
            titleAr: 'ملف موجز التوجيه والنقاط المطلوب تضمينها',
            format: 'Word / Text (.docx / .txt)',
            filename: 'briefing-notes-training-program.docx',
            content: `المستلم: معالي نائب وزير الموارد البشرية والتنمية الاجتماعية
المرجع: تعميم رقم (4412/1) وتاريخ 1446/05/12هـ
الموضوع: نتائج برنامج قيادات التحول وتنسيق ورشة العمل المشتركة

النقاط الرئيسية المطلوب تضمينها في الخطاب:
1. الإشارة إلى التعميم الوزاري وإحاطة معاليه باكتمال تدريب الدفعة الأولى من "برنامج قيادات التحول الرقمي" بعدد (120) متدرباً من مختلف القطاعات.
2. طلب عقد ورشة عمل مشتركة لاستعراض مؤشرات قياس امتصاص الحلول الرقمية بنهاية الربع الأول من العام المالي الحالي.
3. التكرم بتسمية ممثلي جهتكم الموقرة في اللجنة الدائمة للتنسيق خلال أسبوعين من تاريخه.
النبرة والأسلوب: رسمي اعتيادي وقور، مطابق لدليل التراسل الحكومي الموحد.`,
        },
        sampleOutput: {
            title: 'مسودة الخطاب الرسمي المعتمد',
            titleAr: 'مسودة الخطاب الرسمي المعتمد',
            format: 'Official Formal Letter (.docx / .pdf)',
            filename: 'official-correspondence-draft.docx',
            content: `بسم الله الرحمن الرحيم
المملكة العربية السعودية
[اسم الجهة الحكومية المصدرة]
مكتب المشرف العام

الرقم: ٤٦/٨١٢٠/م
التاريخ: ١٨ / ٠٨ / ١٤٤٦ هـ
المشفوعات: تقرير إحصائي موجز

معالي نائب وزير الموارد البشرية والتنمية الاجتماعية                                  سلمه الله
السلام عليكم ورحمة الله وبركاته،،،

إشارةً إلى تعميم معاليكم رقم (4412/1) وتاريخ 1446/05/12هـ بشأن مبادرات بناء القدرات الوطنية وتفعيل ممكنات التحول المؤسسي في المنظومة الحكومية؛
يطيب لنا إحاطة معاليكم باكتمال أعمال المرحلة التدريبية للدفعة الأولى من منتسبي "برنامج قيادات التحول الرقمي"، والبالغ عددهم (120) متدرباً ومتدربة يمثلون مختلف الإدارات والقطاعات التنفيذية.

وانطلاقاً من مبدأ تكامل الجهود وتعظيم الأثر المستدام للمخرجات، نأمل التفضل بالاطلاع والتوجيه حيال التنسيق المشترك لعقد ورشة عمل تنفيذية لاستعراض مؤشرات قياس امتصاص الحلول التقنية بنهاية الربع الأول من العام المالي الحالي، مع التكرم بتسمية ممثلي جهتكم الموقرة في اللجنة الدائمة ذات العلاقة خلال أسبوعين من تاريخه.

شاكرين ومقدرين لمعاليكم دوام التعاون المثمر وحسن الاهتمام.

وتقبلوا معاليكم خالص التحية والتقدير،،،

[الاسم والصفة الوظيفية]
ختم وتوقيع صاحب الصلاحية`,
        },
        pipelines: [
            {
                methodId: 'admin-meeting-minutes',
                relationship: 'precedes',
                role: 'Extracts action items and correspondence decisions from committee minutes',
                roleAr: 'استخراج قرارات التراسل والمهمات التنفيذية من محاضر الاجتماعات السابقة',
            },
            {
                methodId: 'legal-policy-drafting',
                relationship: 'follows',
                role: 'Prepares accompanying regulatory annex or policy memo referred to in the letter',
                roleAr: 'إعداد الملحق التنظيمي أو مذكرة السياسات المشار إليها في سياق الخطاب',
            },
        ],
        uploadGuide: {
            label: 'Upload briefing notes, circular references, or bullet points',
            labelAr: 'ارفع ملف نقاط التوجيه، أرقام التعاميم، أو مسودة الملاحظات',
            allowedFormats: ['.docx', '.txt', '.pdf'],
            exampleFilename: 'briefing-notes.docx',
        },
    },

    'banking-credit-memo': {
        sampleInput: {
            title: 'Deal Facts & Financial Spreadsheet Extract',
            titleAr: 'ملخص بيانات الصفقة وجداول التحليل المالي',
            format: 'Excel / CSV (.xlsx / .csv)',
            filename: 'deal-financials-al-marwah-logistics.xlsx',
            content: `Borrower: Al-Marwah Logistics & Supply Chain Co.
Facility Requested: SAR 45,000,000 Term Facility (5-Year Amortising) + SAR 15,000,000 Revolving Working Capital
Purpose: Warehouse expansion in Riyadh Dry Port & fleet automation

Financial Highlights (FY2022 - FY2024 Audited):
- Revenue: SAR 142M (2022) -> SAR 188M (2023) -> SAR 235M (2024) [CAGR: 28.6%]
- EBITDA Margin: 18.2% (2022) -> 20.1% (2023) -> 21.4% (2024)
- Net Debt / EBITDA: Current 1.8x; Pro-forma with requested facility 2.6x (Covenant ceiling 3.25x)
- DSCR: Historical 1.95x; Projected minimum 1.45x under base case, 1.18x under 15% revenue haircut stress test
- Collateral: First mortgage on Riyadh logistics real estate valued at SAR 78M (LTV: 57.6%) + Corporate Guarantee of Parent Holding`,
        },
        sampleOutput: {
            title: 'Credit Memorandum Narrative Section',
            titleAr: 'مسودة التحليل الائتماني لمذكرة الائتمان',
            format: 'Markdown / Word Memo (.md / .docx)',
            filename: 'credit-memo-narrative-draft.docx',
            content: `## 1. Executive Summary & Facility Purpose
Al-Marwah Logistics & Supply Chain Co. requests a credit package of SAR 60.0M comprising a SAR 45.0M 5-year amortising term facility and a SAR 15.0M revolving working capital line. Proceeds will finance the automated expansion of its Riyadh Dry Port hub. 

## 2. Business & Industry Assessment
The company has demonstrated sustained compound annual revenue growth of 28.6% (SAR 142M to SAR 235M across FY22-FY24), capitalizing on structural tailwinds from Saudi Vision 2030 National Transport & Logistics Strategy (NTLS). Contract renewals with tier-1 industrial clients underpin 68% of forward revenue visibility.

## 3. Financial Analysis & Repayment Capacity
- **Operating Performance:** EBITDA margins expanded 320 bps to 21.4% in FY24, reflecting operational scale in automated warehousing.
- **Leverage & Solvency:** Pro-forma Net Debt/EBITDA increases from 1.8x to 2.6x post-disbursement, maintaining an adequate 65 bps headroom below the proposed 3.25x covenant ceiling.
- **Debt Service Coverage:** Base-case projected DSCR averages 1.58x (minimum 1.45x in Year 2). Under severe macroeconomic stress (15% volume contraction + 150 bps rate increase), DSCR holds at 1.18x.

## 4. Security Structure & Risk Mitigants
- Primary collateral consists of prime logistics land and facilities in Riyadh with an appraised value of SAR 78.0M, providing a comfortable initial LTV of 57.6%.
- Mandatory cash sweep of 25% of excess annual cash flow above SAR 10M debt service cushion.`,
        },
        pipelines: [
            {
                methodId: 'banking-kyc-narrative',
                relationship: 'precedes',
                role: 'Supplies verified ownership structures and KYC clearance before credit structuring',
                roleAr: 'توفير وثائق هيكل الملكية المعتمد والمطابقة الرقابية لـ اعرف عميلك قبل الدراسة',
            },
            {
                methodId: 'finance-variance-commentary',
                relationship: 'complements',
                role: 'Reconciles historical budget vs actual variance in company financial spreads',
                roleAr: 'مطابقة الانحرافات بين الميزانية المقدرة والأداء الفعلي في القوائم المالية',
            },
        ],
        uploadGuide: {
            label: 'Upload client audited financials and term sheet spread',
            labelAr: 'ارفع القوائم المالية المدققة للعميل ومسودة شروط التمويل',
            allowedFormats: ['.xlsx', '.csv', '.pdf'],
            exampleFilename: 'borrower-spreads.xlsx',
        },
    },

    'telecom-cs-response': {
        sampleInput: {
            title: 'Customer Complaint Transcript & Network Diagnostic Log',
            titleAr: 'سجل شكوى العميل وتشخيص الشبكة الفني',
            format: 'JSON / CRM Ticket (.json / .txt)',
            filename: 'crm-ticket-fiber-outage-089412.json',
            content: `{
  "ticketId": "CS-SA-2025-99214",
  "customerSegment": "VIP Enterprise Fiber",
  "accountName": "دار الرياض للحلول الهندسية",
  "customerTone": "High Frustration / Escalated to Executive Care",
  "issue": "انقطاع مفاجئ في خدمة الفايبر للأعمال منذ ٦ ساعات خلال أوقات الدوام الرسمي، وتأخر وصول الفريق الميداني",
  "networkDiagnostic": {
    "nodeId": "RUH-OLAYA-FDH-04",
    "rootCause": "تضرر كابل ألياف بصرية أرضي نتيجة أعمال حفر بلدية غير منسقة",
    "repairEta": "تم الإصلاح واكتمال الاختبار بنجاح قبل 20 دقيقة",
    "slaBreach": true,
    "eligibleCompensation": "رصيد تعويضي يعادل اشتراك 10 أيام + مسار مساند 5G مجاني لمدة شهر"
  }
}`,
        },
        sampleOutput: {
            title: 'Customer Service Resolution Message',
            titleAr: 'رسالة معالجة الشكوى المعتمدة للعميل',
            format: 'SMS / Email / CRM Formatted (.txt / .md)',
            filename: 'cs-resolution-response.md',
            content: `السادة / شركة دار الرياض للحلول الهندسية المحترمين،
تحية طيبة وبعد،،

نعتذر لكم ببالغ الأسف والتقدير عن الانقطاع الخارج عن الإرادة الذي طال خدمة فايبر الأعمال لديكم اليوم، وندرك تماماً حجم التأثير الذي أحدثه ذلك على سير أعمالكم اليومية.

نود إحاطتكم بأن الانقطاع نجم عن ضرر مفاجئ طال مسار الألياف البصرية الأرضي في منطقة العليا جراء أعمال مقاولات خارجية. وقد باشرت فرق الطوارئ الهندسية العمل على استبدال المسار المتضرر، ونؤكد لكم اكتمال أعمال الإصلاح وعودة الخدمة للعمل بكامل كفاءتها وسرعتها المعتادة.

وتقديراً لشراكتكم وثقتكم الغالية، تم تلقائياً تطبيق ما يلي على حسابكم دون الحاجة لأي إجراء من طرفكم:
1. قيد رصيد تعويضي يعادل قيمة اشتراك (10) أيام كاملة في فاتورتكم القادمة.
2. تفعيل شريحة احتياطية لتقنية 5G للأعمال مجاناً لمدة شهر لتأمين استمرارية الاتصال في حال أي طارئ.

مدير حسابكم التنفيذي على أتم الاستعداد للتواصل معكم لمتابعة استقرار الخدمة.

مع خالص التحية والتقدير،
فريق العناية بكبار العملاء`,
        },
        pipelines: [
            {
                methodId: 'cs-complaint-triage',
                relationship: 'precedes',
                role: 'Classifies complaint urgency and routes network diagnostics before generating response',
                roleAr: 'تصنيف أولوية الشكوى وفرز التشخيص التقني قبل صياغة الرد للعميل',
            },
        ],
        uploadGuide: {
            label: 'Upload CRM ticket payload or customer message text',
            labelAr: 'ارفع بيانات تذكرة نظام خدمة العملاء أو نص رسالة الشكوى',
            allowedFormats: ['.json', '.txt'],
            exampleFilename: 'ticket-data.json',
        },
    },

    'legal-policy-drafting': {
        sampleInput: {
            title: 'Policy Objective Brief & Statutory Principles',
            titleAr: 'موجز أهداف السياسة والضوابط النظامية المرجعية',
            format: 'Markdown / Word (.docx / .md)',
            filename: 'policy-mandate-ai-procurement.md',
            content: `# الهدف النظامي للسياسة
إعداد سياسة داخلية تنظم اعتماد واستخدام نماذج الذكاء الاصطناعي التوليدي في إجراءات التعاقد والمشتريات الحكومية للجهة.

# الضوابط الإلزامية الواجب إدراجها:
1. حظر تصدير أي وثائق مصنفة بدرجة (سري) أو (سري للغاية) لنماذج سحابية خارجية عامة.
2. اشتراط وجود مراجعة بشرية مؤكدة (Human-in-the-loop) على جميع مخرجات التقييم الفني للمنافسات.
3. التزام الموردين بالإفصاح الكامل في حال استخدام أدوات الذكاء الاصطناعي في إعداد وثائق العروض.
4. توافق تام مع ضوابط حوكمة البيانات الصادرة من الهيئة الوطنية للأمن السيبراني (NCA) ومكتب إدارة البيانات (NDMO).`,
        },
        sampleOutput: {
            title: 'Draft Governance Policy Section',
            titleAr: 'مسودة مواد لائحة حوكمة استخدام الذكاء الاصطناعي',
            format: 'Regulatory Draft (.docx / .pdf)',
            filename: 'ai-procurement-policy-draft.docx',
            content: `## المادة الثالثة: ضوابط إدخال البيانات ومستويات الحساسية
١. يُحظر حظراً تاماً إدخال أو معالجة أي وثائق أو بيانات مصنفة بدرجة "سري" أو "سري للغاية" عبر أي منصات أو نماذج ذكاء اصطناعي غير مستضافة في بيئة سحابية حكومية معتمدة داخل النطاق الجغرافي للمملكة العربية السعودية.
٢. يلتزم مديرو المشاريع بحجب وتجريد كافة البيانات الشخصية والمالية الحساسة قبل تغذية النماذج المصرح بها وفق ضوابط مكتب إدارة البيانات الوطنية (NDMO).

## المادة الرابعة: الرقابة البشرية والمسؤولية النظامية
١. تُعد مخرجات أدوات الذكاء الاصطناعي توصيات ومسودات استرشادية، ولا يجوز الاستناد إليها كقرارات ترسية أو استبعاد نهائي للعروض دون محضر توقيع معتمد من لجنة فحص العروض المختصة.
٢. يتحمل الموظف المسؤول واللجنة الإشرافية كامل المسؤولية النظامية عن دقة واكتمال المستندات التعاقدية الصادرة.

## المادة الخامسة: متطلبات إفصاح المتنافسين
يلتزم المتنافسون في كراسات الشروط والمنافسات بالإفصاح الصريح عن استخدامهم لأي حلول ذكاء اصطناعي توليدي في إعداد وثائق العطاءات الفنية، مع تعهد بعدم انتهاك حقوق الملكية الفكرية لطرف ثالث.`,
        },
        pipelines: [
            {
                methodId: 'procurement-rfp-eval',
                relationship: 'follows',
                role: 'Provides practical evaluation rubric governed by this drafted policy',
                roleAr: 'تطبيق معايير التقييم الفني للعروض وفق ضوابط هذه السياسة',
            },
        ],
        uploadGuide: {
            label: 'Upload policy brief and relevant statutory decree references',
            labelAr: 'ارفع موجز مسودة السياسة وأرقام الأوامر السامية أو الأنظمة ذات الصلة',
            allowedFormats: ['.docx', '.md', '.pdf'],
            exampleFilename: 'policy-mandate.docx',
        },
    },

    'energy-hse-report': {
        sampleInput: {
            title: 'Shift Log & Gas Leak Telemetry Report',
            titleAr: 'سجل وردية العمل وقراءات مجسات تسرب الغاز',
            format: 'Log Extract / CSV (.csv / .txt)',
            filename: 'gas-leak-sensor-log-plant4.txt',
            content: `Location: Yanbu Gas Separation Plant - Unit 4B
Timestamp: 1446/07/11 - 14:22 AST
Incident: H2S sensor alarm trigger at Valve Station V-402 (Reading peaked at 12.4 ppm for 4 minutes).
Immediate Response:
- Automated emergency shutoff valve actuated at 14:23.
- Area evacuation siren sounded; 18 technicians evacuated to primary muster point B within 90 seconds.
- HSE response crew donned SCBA equipment and isolated flange gasket F-402B.
- Reading returned to 0.0 ppm at 14:38.
Casualties / Injuries: 0 injuries, 0 medical treatments required.
Initial Root Cause: Thermal stress degradation on elastomer seal following ambient heat surge.`,
        },
        sampleOutput: {
            title: 'Formal HSE Incident Investigation Report',
            titleAr: 'تقرير التحقيق المعتمد في واقعة السلامة والصحة المهنية',
            format: 'HSE Formal Investigation (.pdf / .docx)',
            filename: 'hse-incident-report-yanbu-v402.pdf',
            content: `### 1. INCIDENT CLASSIFICATION & SUMMARY
- **Event Type:** Tier-2 Process Safety Event (Loss of Primary Containment - H2S Trace Gas)
- **Severity Level:** Moderate (Zero injuries, prompt automated fail-safe isolation)
- **Facility:** Yanbu Processing Division - Sub-unit 4B (Valve Station V-402)
- **Date & Time:** 11 Rajab 1446 / 14:22 AST

### 2. CHRONOLOGY OF EMERGENCY RESPONSE
- **14:22:** Sensor S-402 detects localized H2S concentration peaking at 12.4 ppm (safety threshold: 10.0 ppm).
- **14:23:** Emergency Shutoff Valve (ESDV-402) automatically trips, isolating upstream hydrocarbon feed.
- **14:24:** All 18 field personnel account for at Muster Point B (Headcount verified in 90s, compliant with OSHA/Royal Commission standards).
- **14:31:** Certified HSE First-Response Team equipped with positive-pressure SCBA enters cordon perimeter.
- **14:38:** Mechanical isolation confirmed; atmospheric monitors confirm 0.0 ppm across surrounding 100m perimeter.

### 3. PRELIMINARY ROOT CAUSE & CORRECTIVE ACTIONS (CAPA)
1. **Root Cause:** Accelerated thermal polymer fatigue on high-pressure flange gasket F-402B due to cyclic thermal load.
2. **Immediate Action:** Replacement of failed elastomer seal with high-spec spiral-wound metal gasket (Inconel 625).
3. **Preventive Action:** Ultrasonic integrity scan scheduled across all adjacent Unit 4B flanges before operational restart.`,
        },
        pipelines: [
            {
                methodId: 'admin-meeting-minutes',
                relationship: 'follows',
                role: 'Logs corrective action assignments into the weekly executive operations review',
                roleAr: 'تسجيل خطة الإجراءات التصحيحية ضمن محضر اجتماع العمليات الأسبوعي',
            },
        ],
        uploadGuide: {
            label: 'Upload field log, sensor alarms CSV, or incident interview notes',
            labelAr: 'ارفع سجل الملاحظات الميدانية، قراءات المجسات الرقمية، أو إفادات المشرفين',
            allowedFormats: ['.csv', '.txt', '.docx'],
            exampleFilename: 'incident-telemetry.csv',
        },
    },

    'clinical-discharge-summary': {
        sampleInput: {
            title: 'Inpatient Electronic Medical Record (EMR) Extract',
            titleAr: 'مستخرج الملف الطبي الإلكتروني للمريض المنوم',
            format: 'EMR Structured Text (.txt / .json)',
            filename: 'emr-discharge-patient-card-88120.txt',
            content: `Patient MRN: [REDACTED BY PRIVACY SENTINEL]
Age: 58 | Gender: Male | Admission Date: 2025-02-01 | Discharge Date: 2025-02-06
Attending Physician: Dr. Tariq Al-Ghamdi (Cardiology)
Admission Diagnosis: Acute Non-ST Elevation Myocardial Infarction (NSTEMI), Type 2 Diabetes Mellitus, Hypertension.
Hospital Course:
- Underwent successful coronary angiography via right radial approach on Day 2: 85% stenosis in Mid-LAD successfully stented with Drug-Eluting Stent (DES).
- Post-PCI course uneventful. Peak Troponin-I 4.8 ng/mL declining to 0.12 ng/mL.
- Echocardiography: LVEF 48%, mild anterior hypokinesia, no valvular lesions.
- Fasting blood glucose stabilized between 130-155 mg/dL on adjusted insulin regimen.
Discharge Medications: Aspirin 100mg PO OD, Ticagrelor 90mg PO BID, Atorvastatin 80mg PO QHS, Bisoprolol 5mg PO OD, Metformin 1000mg PO BID.`,
        },
        sampleOutput: {
            title: 'Structured Clinical Discharge Summary',
            titleAr: 'ملخص الخروج الطبي المعتمد للمريض والمراجع',
            format: 'Clinical Report (.docx / .pdf)',
            filename: 'clinical-discharge-summary.pdf',
            content: `## HOSPITAL DISCHARGE SUMMARY
**Patient:** 58-year-old male | **Service:** Cardiology Department | **Length of Stay:** 5 Days

### 1. FINAL DIAGNOSES
1. Acute Coronary Syndrome: Non-ST-Elevation Myocardial Infarction (NSTEMI) — Resolved post-PCI
2. Single-Vessel Coronary Artery Disease (85% Mid-LAD lesion, successfully stented with DES)
3. Essential Hypertension & Type 2 Diabetes Mellitus (Controlled)

### 2. SUMMARY OF HOSPITAL COURSE & INTERVENTIONS
The patient presented with typical exertional retrosternal angina and elevated biomarkers. Diagnostic coronary angiography revealed critical 85% mid-LAD stenosis. Percutaneous Coronary Intervention (PCI) with a drug-eluting stent was executed without complication. Serial electrocardiograms and cardiac enzymes normalized prior to discharge. Left ventricular ejection fraction preserved at 48%.

### 3. DISCHARGE MEDICATIONS & DUAL ANTIPLATELET THERAPY (DAPT)
- **Ticagrelor 90 mg:** 1 tablet orally twice daily (CRITICAL: 12-month uninterrupted course for stent thrombosis prevention).
- **Aspirin 100 mg:** 1 tablet orally once daily with food.
- **Atorvastatin 80 mg:** 1 tablet orally at bedtime (Lipid target: LDL < 55 mg/dL).
- **Bisoprolol 5 mg:** 1 tablet orally once daily (Target resting heart rate 60-70 bpm).
- **Metformin 1000 mg:** 1 tablet orally twice daily with meals.

### 4. FOLLOW-UP & RED-FLAG INSTRUCTIONS
- Cardiology Outpatient Clinic: Appointment booked in 14 days (Echo & cardiac rehab review).
- Red-Flag Warnings: Immediate Emergency Department presentation required if recurring chest discomfort, syncope, or unmanageable shortness of breath occurs.`,
        },
        pipelines: [
            {
                methodId: 'admin-meeting-minutes',
                relationship: 'complements',
                role: 'Logs quality compliance in weekly hospital department morbidity & mortality audit',
                roleAr: 'توثيق معايير جودة الملخصات الطبية في اجتماع مراجعة وفيات ومضاعفات القسم',
            },
        ],
        uploadGuide: {
            label: 'Upload de-identified EMR progress notes and lab values',
            labelAr: 'ارفع ملاحظات التنويم الطبية ونتائج التحاليل بعد حجب الهوية',
            allowedFormats: ['.txt', '.docx', '.json'],
            exampleFilename: 'emr-progress-notes.txt',
        },
    },
};

/**
 * Fallback generator that crafts contextual, realistic sample inputs and outputs
 * for any method in the catalogue based on its metadata, inputsRequired, and whatItDoes.
 */
export function getSampleInput(method: IMethod): ISampleExample {
    if (CURATED_SAMPLES[method.id]?.sampleInput) {
        return CURATED_SAMPLES[method.id].sampleInput;
    }

    const isArabic =
        method.language === 'Arabic' ||
        method.titleLang === 'ar' ||
        /[\u0600-\u06FF]/.test(method.title);

    const inputBullets = method.inputsRequired
        .map((req, i) => `${i + 1}. ${req}`)
        .join('\n');

    if (isArabic) {
        return {
            title: `مدخلات نموذجية لتشغيل أسلوب: ${method.title}`,
            titleAr: `مدخلات نموذجية لتشغيل أسلوب: ${method.title}`,
            format: 'Word / Plain Text (.docx / .txt)',
            filename: `input-${method.id}.txt`,
            content: `المهمة: ${method.title}
القطاع: ${method.sectorId}
عائلة الدور الوظيفي: ${method.roleId}

عناصر البيانات المطلوب إرفاقها:
${inputBullets}

ملاحظات التشغيل:
- يُرجى التأكد من اكتمال البيانات الأولية قبل إطلاق أمر التشغيل.
- يتم حجب البيانات الحساسة أو السرية تلقائياً قبل المعالجة عبر وكيل حماية الخصوصية.`,
        };
    }

    return {
        title: `Sample Input Document for: ${method.title}`,
        titleAr: `المدخلات النموذجية لأسلوب: ${method.title}`,
        format: 'Word / Text (.docx / .txt)',
        filename: `input-${method.id}.txt`,
        content: `Workflow Task: ${method.title}
Target Sector: ${method.sectorId}
Role Family: ${method.roleId}

Required Input Data Fields:
${inputBullets}

Operational Notes:
- Ensure all prerequisite facts and constraints are filled prior to executing the command.
- PII and confidential identifiers are filtered via the Data Privacy Sentinel.`,
    };
}

export function getSampleOutput(method: IMethod): ISampleExample {
    if (CURATED_SAMPLES[method.id]?.sampleOutput) {
        return CURATED_SAMPLES[method.id].sampleOutput;
    }

    const isArabic =
        method.language === 'Arabic' ||
        method.titleLang === 'ar' ||
        /[\u0600-\u06FF]/.test(method.title);

    const qualityChecks = method.qualityChecklist
        .map((chk) => `[✓] ${chk}`)
        .join('\n');

    if (isArabic) {
        return {
            title: `المخرج النموذجي المعتمد لأسلوب: ${method.title}`,
            titleAr: `المخرج النموذجي المعتمد لأسلوب: ${method.title}`,
            format: method.outputFormat || 'Structured Document (.docx / .md)',
            filename: `output-${method.id}.md`,
            content: `# مسودة الإنجاز المكتملة — ${method.title}

## ١. ملخص النتيجة التنفيذية
تم توليد هذا المستند استناداً إلى المدخلات المصدرية المرفوعة وفق الضوابط والمعايير المعتمدة في قطاع ${method.sectorId}.

## ٢. تفاصيل المحتوى المعالج
- **ما أنجزه الأسلوب:** ${method.whatItDoes}
- **صيغة الإخراج:** ${method.outputFormat}

## ٣. قائمة التحقق ومطابقة الجودة المنجزة:
${qualityChecks}

---
تنبيه حوكمة: ${method.whatStaysHuman}`,
        };
    }

    return {
        title: `Sample Verified Output for: ${method.title}`,
        titleAr: `المخرج النموذجي المعتمد لأسلوب: ${method.title}`,
        format: method.outputFormat || 'Structured Document (.docx / .md)',
        filename: `output-${method.id}.md`,
        content: `# Verified Execution Draft — ${method.title}

## 1. Executive Summary
This document was generated from uploaded source inputs following standard parameters for the ${method.sectorId} sector.

## 2. Operational Specification
- **Task Scope:** ${method.whatItDoes}
- **Output Standard:** ${method.outputFormat}

## 3. Automated Quality Gate Verifications:
${qualityChecks}

---
Governance Notice: ${method.whatStaysHuman}`,
    };
}

export function getPipelineCombinations(method: IMethod): IPipelineCombination[] {
    if (CURATED_SAMPLES[method.id]?.pipelines) {
        return CURATED_SAMPLES[method.id].pipelines;
    }

    // Default complementary pipeline for any method
    return [
        {
            methodId: 'admin-meeting-minutes',
            relationship: 'precedes',
            role: 'Extracts action items, stakeholder assignments, and meeting facts',
            roleAr: 'استخراج متطلبات العمل والتكليفات الرسمية من محضر الاجتماع الأخير',
        },
    ];
}

export function getUploadGuide(method: IMethod): IUploadGuide {
    if (CURATED_SAMPLES[method.id]?.uploadGuide) {
        return CURATED_SAMPLES[method.id].uploadGuide;
    }

    const isArabic =
        method.language === 'Arabic' ||
        method.titleLang === 'ar' ||
        /[\u0600-\u06FF]/.test(method.title);

    return {
        label: isArabic
            ? 'ارفع وثائق المدخلات (مستند Word أو PDF أو ملف نصي)'
            : 'Upload source documents (.docx, .pdf, or .txt)',
        labelAr: 'ارفع وثائق المدخلات (مستند Word أو PDF أو ملف نصي)',
        allowedFormats: ['.docx', '.pdf', '.txt', '.xlsx'],
        exampleFilename: `source-input-${method.id}.docx`,
    };
}

export function getCliExecution(method: IMethod): ICliExecution {
    const inputExample = getSampleInput(method);
    const filename = inputExample.filename || 'input.txt';

    return {
        command: `agy run --method "${method.id}" \\\n  --input ./${filename} \\\n  --agents "quality-auditor,privacy-sentinel" \\\n  --output ./output-${method.id}.md`,
        inputFlag: `--input ./${filename}`,
        notes: `Runs the autonomous workflow using Antigravity Agent CLI, streaming verified output to output-${method.id}.md.`,
        notesAr: `يشغل الأسلوب عبر واجهة سطر أوامر وكلاء Antigravity CLI مع تمرير وكلاء الجودة وحماية الخصوصية وحفظ المخرج المعتمد.`,
    };
}
