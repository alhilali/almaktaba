import type { IMethod, ISampleExample, IPipelineCombination, ICliExecution, IUploadGuide } from '@/data/types';
import { getAgentsForMethod } from '@/data/agents';

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

    'professional-proposal': {
        sampleInput: {
            title: 'Client Brief & Reference Engagement',
            titleAr: 'موجز العميل والتجربة المرجعية السابقة',
            format: 'Word / PDF (.docx / .pdf)',
            filename: 'client-brief-smart-city-pmo.docx',
            content: `Client: Regional Development Authority — Smart City Programme
Engagement sought: Establish a central Programme Management Office (PMO) for a 3-year smart-city delivery portfolio (SAR 1.2bn across 14 projects).
Scope asks:
- Governance model, stage gates, and benefits-tracking framework
- Portfolio reporting dashboard aligned to the authority's board cycle
- Capability build: train 12 civil-servant project managers over the engagement
Evaluation: 70% technical / 30% commercial. Arabic + English submission.
Reference engagement to reuse: "National Ports PMO stand-up (2023)" — similar governance stand-up, 18-month duration, 9-person team.`,
        },
        sampleOutput: {
            title: 'Consulting Proposal — Technical Sections',
            titleAr: 'مسودة العرض الفني للخدمات الاستشارية',
            format: 'Proposal Draft (.docx)',
            filename: 'proposal-smart-city-pmo-draft.docx',
            content: `## 1. Our Understanding of the Problem
The Authority is standing up a SAR 1.2bn smart-city portfolio across 14 projects and needs a central PMO to impose consistent governance, stage gates, and benefits tracking before delivery accelerates. The core risk is not individual project delivery but portfolio-level coordination and transparent reporting to the board.

## 2. Proposed Approach
A three-phase stand-up mirroring our National Ports PMO methodology, adapted to a smart-city context:
- **Phase 1 — Design (Months 1–3):** governance model, RACI, stage-gate definitions, benefits taxonomy.
- **Phase 2 — Mobilise (Months 4–8):** reporting dashboard build, tooling, first board-cycle report.
- **Phase 3 — Embed & Transfer (Months 9–36):** run the cadence, coach 12 PMs to independent operation.

## 3. Workplan
| Phase | Key deliverables | Duration |
|---|---|---|
| Design | Governance handbook, stage-gate model | 3 months |
| Mobilise | Portfolio dashboard, reporting pack | 5 months |
| Embed | Capability programme, quarterly reviews | 28 months |

## 4. Proposed Team
Engagement Partner, PMO Lead, Governance SME, Reporting/BI Specialist, and two embedded PM coaches — mapped to the capability-transfer objective.

[Commercial terms and pricing intentionally omitted — prepared separately by the engagement lead.]`,
        },
        pipelines: [
            {
                methodId: 'professional-rfp-drafting',
                relationship: 'precedes',
                role: 'Converts the client need into a structured, testable requirements set the proposal responds to',
                roleAr: 'تحويل احتياج العميل إلى متطلبات منظمة وقابلة للقياس يستند إليها العرض',
            },
            {
                methodId: 'finance-variance-commentary',
                relationship: 'complements',
                role: 'Supports the benefits-tracking narrative with budget vs actual commentary',
                roleAr: 'دعم سردية تتبع المنافع بتحليل الانحرافات بين الميزانية والأداء الفعلي',
            },
        ],
        uploadGuide: {
            label: 'Upload the client brief / RFP and one comparable past engagement',
            labelAr: 'ارفع موجز العميل أو كراسة الطرح وتجربة سابقة مماثلة',
            allowedFormats: ['.docx', '.pdf'],
            exampleFilename: 'client-brief.docx',
        },
    },

    'hr-job-description': {
        sampleInput: {
            title: 'طلب استحداث وظيفة ومهامها الأساسية',
            titleAr: 'طلب استحداث وظيفة ومهامها الأساسية',
            format: 'Word / Text (.docx / .txt)',
            filename: 'job-request-data-analyst.txt',
            content: `المسمى الوظيفي: محلل بيانات أول
المرتبة: الرابعة — إدارة ذكاء الأعمال
الإدارة والارتباط: يرتبط مباشرة بمدير إدارة ذكاء الأعمال

المهام الأساسية المطلوبة:
1. تصميم وبناء لوحات المؤشرات التشغيلية وتحديثها دورياً.
2. كتابة الاستعلامات التحليلية واستخلاص الرؤى من مستودع البيانات.
3. دعم الإدارات في تفسير المؤشرات واتخاذ القرار المبني على البيانات.

ملاحظات: مطلوب إتقان العربية والإنجليزية. الوظيفة مفتوحة للكفاءات الوطنية.`,
        },
        sampleOutput: {
            title: 'الوصف الوظيفي المتوازن والمعتمد',
            titleAr: 'الوصف الوظيفي المتوازن والمعتمد',
            format: 'Job Description (.docx)',
            filename: 'job-description-senior-data-analyst.docx',
            content: `# الوصف الوظيفي: محلل بيانات أول

## الغرض من الوظيفة
تحويل بيانات المنظمة إلى رؤى عملية تدعم اتخاذ القرار، عبر بناء لوحات مؤشرات موثوقة وتحليلات دقيقة تخدم الإدارات التشغيلية.

## المهام والمسؤوليات الرئيسية
- تصميم لوحات المؤشرات التشغيلية وصيانتها وضمان دقتها.
- إعداد الاستعلامات التحليلية واستخلاص الأنماط والرؤى من مستودع البيانات.
- مساندة الإدارات في تفسير النتائج ودعم القرارات المبنية على البيانات.

## المتطلبات الإلزامية
- درجة البكالوريوس في علوم البيانات أو نظم المعلومات أو ما يعادلها.
- إتقان لغة الاستعلام SQL وأداة تصور بيانات واحدة على الأقل.
- إجادة العربية والإنجليزية تحدثاً وكتابة.

## المتطلبات المفضّلة
- خبرة سابقة في قطاع مماثل.
- الإلمام بأساسيات هندسة البيانات.

ملاحظة حوكمة: المرتبة والنطاق المالي يُعتمدان من إدارة الموارد البشرية ولم يُذكرا في هذه المسودة.`,
        },
        pipelines: [
            {
                methodId: 'admin-meeting-minutes',
                relationship: 'precedes',
                role: 'Captures the hiring decision and headcount approval from the committee minutes',
                roleAr: 'توثيق قرار التوظيف واعتماد الاحتياج من محضر لجنة الموارد البشرية',
            },
        ],
        uploadGuide: {
            label: 'Upload the role request with title, grade, and core duties',
            labelAr: 'ارفع طلب الوظيفة متضمناً المسمى والمرتبة والمهام الأساسية',
            allowedFormats: ['.docx', '.txt'],
            exampleFilename: 'job-request.txt',
        },
    },

    'finance-variance-commentary': {
        sampleInput: {
            title: 'Monthly P&L Variance Table & Driver Notes',
            titleAr: 'جدول انحرافات الأرباح والخسائر وملاحظات المسببات',
            format: 'Excel / CSV (.xlsx / .csv)',
            filename: 'variance-table-march-fleet-ops.csv',
            content: `Materiality threshold: SAR 50,000 or 5% movement
Line, Budget, Actual, Variance, Driver note
Fuel & energy, 1,200,000, 1,412,000, +212,000, "Diesel price +9%, peak-season mileage up 6%"
Fleet maintenance, 640,000, 548,000, -92,000, "Three major overhauls deferred to Q2"
Driver payroll, 2,100,000, 2,118,000, +18,000, "Within range — overtime offset by lower headcount"
Third-party haulage, 380,000, 470,000, +90,000, "Capacity shortfall covered by spot-market hire"
Insurance, 210,000, 209,000, -1,000, "No change"`,
        },
        sampleOutput: {
            title: 'Management Pack — Variance Commentary',
            titleAr: 'سرد انحرافات حزمة التقارير الإدارية',
            format: 'Commentary (.md / .docx)',
            filename: 'variance-commentary-march.md',
            content: `## March — Variance Commentary (material lines only)

**Fuel & energy — SAR +212k (adverse).** The overrun reflects a 9% rise in diesel prices combined with a 6% increase in peak-season mileage. Both drivers are external and volume-led rather than efficiency losses.

**Fleet maintenance — SAR -92k (favourable).** The saving is timing, not structural: three major overhauls were deferred to Q2 and will reverse next quarter.

**Third-party haulage — SAR +90k (adverse).** A capacity shortfall was covered through spot-market hire at a premium to contracted rates; recurring if internal capacity is not added.

*Lines below the SAR 50k / 5% threshold (driver payroll, insurance) are not commented on per the stated materiality policy.*`,
        },
        pipelines: [
            {
                methodId: 'banking-credit-memo',
                relationship: 'follows',
                role: 'Feeds reconciled variance narrative into the borrower financial assessment',
                roleAr: 'تغذية التحليل الائتماني بسردية الانحرافات المطابَقة',
            },
            {
                methodId: 'admin-meeting-minutes',
                relationship: 'follows',
                role: 'Escalated variances become action items in the monthly review minutes',
                roleAr: 'تتحول الانحرافات الجوهرية إلى مهام في محضر المراجعة الشهرية',
            },
        ],
        uploadGuide: {
            label: 'Upload the variance table with a short driver note per line',
            labelAr: 'ارفع جدول الانحرافات مع ملاحظة مسبّب موجزة لكل بند',
            allowedFormats: ['.xlsx', '.csv'],
            exampleFilename: 'variance-table.csv',
        },
    },

    'data-sql-from-question': {
        sampleInput: {
            title: 'Business Question & Schema Definition',
            titleAr: 'السؤال التحليلي وتعريف مخطط البيانات',
            format: 'Text / SQL DDL (.txt / .sql)',
            filename: 'question-and-schema-repeat-buyers.txt',
            content: `Dialect: PostgreSQL

Question:
"How many customers placed more than one completed order in Q1 2025, and what share of total Q1 revenue did they generate?"

Schema:
orders(order_id PK, customer_id FK, status TEXT, order_date DATE, total_sar NUMERIC)
  -- status in ('completed','cancelled','refunded')
customers(customer_id PK, signup_date DATE, segment TEXT)`,
        },
        sampleOutput: {
            title: 'Documented SQL Query with Assumptions',
            titleAr: 'استعلام SQL موثّق مع الافتراضات',
            format: 'SQL (.sql)',
            filename: 'repeat-buyers-q1-2025.sql',
            content: `-- Assumptions:
--  1. "completed order" = orders.status = 'completed' (cancelled/refunded excluded).
--  2. Q1 2025 = order_date between 2025-01-01 and 2025-03-31 inclusive.
--  3. "revenue" = SUM(total_sar) over completed Q1 orders.
--  4. Repeat customer = >= 2 completed orders within Q1.

WITH q1_completed AS (
    SELECT customer_id, total_sar
    FROM orders
    WHERE status = 'completed'
      AND order_date BETWEEN DATE '2025-01-01' AND DATE '2025-03-31'
),
repeat_customers AS (
    SELECT customer_id
    FROM q1_completed
    GROUP BY customer_id
    HAVING COUNT(*) > 1
)
SELECT
    (SELECT COUNT(*) FROM repeat_customers)                          AS repeat_customer_count,
    ROUND(
        100.0 * SUM(CASE WHEN q.customer_id IN (SELECT customer_id FROM repeat_customers)
                         THEN q.total_sar ELSE 0 END)
        / NULLIF(SUM(q.total_sar), 0), 1)                            AS repeat_revenue_share_pct
FROM q1_completed q;

-- Verify against the Q1 finance close before acting on these figures.`,
        },
        pipelines: [
            {
                methodId: 'finance-variance-commentary',
                relationship: 'follows',
                role: 'Turns the query results into a written commentary for the management pack',
                roleAr: 'تحويل نتائج الاستعلام إلى سرد مكتوب لحزمة التقارير الإدارية',
            },
        ],
        uploadGuide: {
            label: 'Upload the question and the relevant table/column definitions',
            labelAr: 'ارفع السؤال وتعريفات الجداول والأعمدة ذات الصلة',
            allowedFormats: ['.txt', '.sql'],
            exampleFilename: 'question-and-schema.txt',
        },
    },

    'procurement-rfp-eval': {
        sampleInput: {
            title: 'Evaluation Criteria & Bidder Responses',
            titleAr: 'معايير التقييم وردود المتنافسين',
            format: 'Word / PDF (.docx / .pdf)',
            filename: 'rfp-eval-scada-upgrade.docx',
            content: `Tender: SCADA control-system upgrade — Substation cluster North
Published technical criteria (mandatory unless noted):
C1. Vendor holds IEC 62443 cybersecurity certification.
C2. Proven deployment on ≥ 3 utility substations in the last 5 years.
C3. 24/7 local (in-Kingdom) support with ≤ 4h response SLA.
C4. Migration plan with zero unplanned outage (desirable — weighted).

Bidder A response extract: "Certified to IEC 62443-4-1. Seven utility deployments since 2021. Riyadh support centre, 3h SLA. Phased cutover, one 2h planned maintenance window."
Bidder B response extract: "ISO 27001 certified. Two substation references (2020, 2024). Regional support from Dubai. Migration plan under development."`,
        },
        sampleOutput: {
            title: 'Evaluation Grid (No Scores) with Gaps Flagged',
            titleAr: 'شبكة التقييم (دون درجات) مع إبراز الفجوات',
            format: 'Evaluation Grid (.md / .docx)',
            filename: 'eval-grid-scada-upgrade.md',
            content: `## Evaluation Grid — Criterion × Bidder (evidence only, no scores)

| Criterion | Bidder A | Bidder B |
|---|---|---|
| C1 · IEC 62443 | ✔ Addressed — "Certified to IEC 62443-4-1" | ⚠ GAP — cites ISO 27001, not IEC 62443 (mandatory not met) |
| C2 · ≥3 utility deployments / 5 yrs | ✔ Addressed — "Seven deployments since 2021" | ⚠ GAP — only two references; one (2020) outside 5-year window |
| C3 · In-Kingdom 24/7 ≤4h SLA | ✔ Addressed — "Riyadh centre, 3h SLA" | ⚠ GAP — support from Dubai, not in-Kingdom |
| C4 · Zero-outage migration (desirable) | Addressed — "one 2h planned window" (no unplanned outage) | ⚠ GAP — "migration plan under development" |

**Flagged gaps for the committee:** Bidder B fails three mandatory criteria (C1, C2, C3) on the evidence submitted.

*No scores assigned — scoring and the award decision remain with the evaluation committee.*`,
        },
        pipelines: [
            {
                methodId: 'legal-policy-drafting',
                relationship: 'precedes',
                role: 'Supplies the governing procurement policy the evaluation rubric enforces',
                roleAr: 'توفير سياسة المشتريات الحاكمة التي تطبّقها معايير التقييم',
            },
            {
                methodId: 'professional-rfp-drafting',
                relationship: 'precedes',
                role: 'Defines the testable requirements that become the evaluation criteria',
                roleAr: 'تحديد المتطلبات القابلة للقياس التي تتحول إلى معايير التقييم',
            },
        ],
        uploadGuide: {
            label: 'Upload the published criteria and the bidder responses',
            labelAr: 'ارفع المعايير المعلنة وردود المتنافسين',
            allowedFormats: ['.docx', '.pdf'],
            exampleFilename: 'rfp-responses.docx',
        },
    },

    'cs-complaint-triage': {
        sampleInput: {
            title: 'نص شكوى العميل وقوائم التصنيف والفرق',
            titleAr: 'نص شكوى العميل وقوائم التصنيف والفرق',
            format: 'Text / CRM (.txt / .json)',
            filename: 'complaint-triage-input.txt',
            content: `نص الشكوى:
"حاولت ثلاث مرات تحويل مبلغ عبر التطبيق وتم خصم المبلغ من حسابي دون وصوله للمستفيد، والدعم لم يرد منذ يومين. سأرفع شكوى لمؤسسة النقد إن لم يُحل الأمر اليوم."

الفئات المتاحة: (أعطال تقنية، منازعات مالية، جودة خدمة، استفسار عام)
درجات الإلحاح: (عادية، عالية، حرجة)
الفرق المختصة: (الدعم التقني، العمليات المالية، العناية بالعملاء)`,
        },
        sampleOutput: {
            title: 'سجل التصنيف والتوجيه المنظم',
            titleAr: 'سجل التصنيف والتوجيه المنظم',
            format: 'Structured Record (.json / .md)',
            filename: 'triage-record.md',
            content: `## سجل فرز الشكوى

- **الفئة:** منازعات مالية (خصم دون إتمام التحويل)
- **درجة الإلحاح:** حرجة
- **الجهة المقترحة:** العمليات المالية (مع إشعار العناية بالعملاء)
- **علامة المراجعة البشرية:** ✔ مطلوبة

**سبب رفع العلامة:** الشكوى تتضمن خصماً مالياً متكرراً دون إتمام العملية، وتلويحاً صريحاً بالتصعيد إلى البنك المركزي — يستوجب مراجعة بشرية فورية وعدم الاكتفاء بالتوجيه الآلي.

**ملخص موجز للفريق:** خصم ثلاث محاولات تحويل دون وصول المبلغ، وتأخر استجابة الدعم يومين.`,
        },
        pipelines: [
            {
                methodId: 'telecom-cs-response',
                relationship: 'follows',
                role: 'Drafts the customer-facing reply once the case is classified and routed',
                roleAr: 'صياغة الرد الموجّه للعميل بعد تصنيف الحالة وتوجيهها',
            },
        ],
        uploadGuide: {
            label: 'Upload the complaint text plus the category, urgency, and team lists',
            labelAr: 'ارفع نص الشكوى وقوائم الفئات ودرجات الإلحاح والفرق',
            allowedFormats: ['.txt', '.json'],
            exampleFilename: 'complaint.txt',
        },
    },

    'banking-kyc-narrative': {
        sampleInput: {
            title: 'Corporate Onboarding Document Set',
            titleAr: 'حزمة وثائق فتح الحساب للعميل المؤسسي',
            format: 'Document Bundle (.pdf / .txt)',
            filename: 'kyc-bundle-najd-trading.txt',
            content: `Entity: Najd Trading & Contracting LLC
Legal form: Limited Liability Company (CR No. 1010XXXXXX, issued Riyadh)
Documents collected:
- Commercial Registration — VALID (expires 2026-09)
- Articles of Association — provided
- Ultimate Beneficial Owners: Partner 1 (55%), Partner 2 (30%), Holding Co. (15%)
  -- Holding Co. UBO chain: NOT provided
- National IDs of signatories: [REDACTED BY PRIVACY SENTINEL]
- Board resolution authorising account opening — provided
- Source of funds declaration — provided (trade receivables)
- Tax (ZATCA) certificate — EXPIRED (2024-12)
Business activity: building materials wholesale and contracting.`,
        },
        sampleOutput: {
            title: 'KYC Narrative + Outstanding-Items Checklist',
            titleAr: 'سردية اعرف عميلك وقائمة النواقص',
            format: 'KYC Memo (.md / .docx)',
            filename: 'kyc-narrative-najd-trading.md',
            content: `## KYC Narrative — Najd Trading & Contracting LLC

**Entity & legal form.** LLC registered in Riyadh under a valid commercial registration (expires Sep 2026), supported by Articles of Association and a board resolution authorising account opening.

**Ownership & control.** Direct ownership: Partner 1 (55%), Partner 2 (30%), and a Holding Company (15%). The holding company's ultimate beneficial-owner chain has not been provided and cannot be verified from the current file.

**Business activity & source of funds.** Wholesale of building materials and contracting; declared source of funds is trade receivables, consistent with the stated activity.

## Outstanding Items (must be closed before review)
1. **UBO chain for the 15% Holding Company** — not provided.
2. **ZATCA tax certificate** — expired Dec 2024; current certificate required.

*No risk rating and no onboarding decision are stated — those remain with the financial-crime analyst.*`,
        },
        pipelines: [
            {
                methodId: 'banking-credit-memo',
                relationship: 'follows',
                role: 'Verified ownership and clearance feed the subsequent credit assessment',
                roleAr: 'تغذية الدراسة الائتمانية اللاحقة بهيكل الملكية المعتمد والمطابقة',
            },
        ],
        uploadGuide: {
            label: 'Upload the collected KYC documents and ownership structure',
            labelAr: 'ارفع وثائق اعرف عميلك المجمّعة وهيكل الملكية',
            allowedFormats: ['.pdf', '.txt', '.docx'],
            exampleFilename: 'kyc-bundle.pdf',
        },
    },

    'admin-meeting-minutes': {
        sampleInput: {
            title: 'تسجيل/نقاط الاجتماع وجدول الأعمال والحضور',
            titleAr: 'تسجيل/نقاط الاجتماع وجدول الأعمال والحضور',
            format: 'Transcript / Notes (.txt / .docx)',
            filename: 'meeting-notes-deanship-q2.txt',
            content: `اجتماع: مجلس عمادة القبول والتسجيل — الربع الثاني
الحضور: د. العميد (رئيساً)، أ. وكيل العمادة، أ. مديرة التسجيل، م. ممثل تقنية المعلومات
جدول الأعمال:
1. جاهزية بوابة القبول للفصل القادم.
2. معالجة تأخر إصدار الوثائق.
3. خطة التحول الرقمي لخدمات الطلاب.

نقاط النقاش:
- ذكر ممثل التقنية أن البوابة جاهزة عدا تكامل الدفع، ويحتاج أسبوعين.
- اتُّفق على تكليف مديرة التسجيل بخطة لمعالجة تراكم الوثائق خلال 10 أيام.
- طُلب رفع مقترح ميزانية التحول الرقمي للاجتماع القادم.`,
        },
        sampleOutput: {
            title: 'محضر الاجتماع المنظم بالقرارات والمهام',
            titleAr: 'محضر الاجتماع المنظم بالقرارات والمهام',
            format: 'Minutes (.docx)',
            filename: 'minutes-deanship-q2.docx',
            content: `# محضر اجتماع مجلس عمادة القبول والتسجيل — الربع الثاني

**الحضور:** العميد (رئيساً)، وكيل العمادة، مديرة التسجيل، ممثل تقنية المعلومات.

## البنود والقرارات
1. **جاهزية بوابة القبول:** البوابة جاهزة باستثناء تكامل بوابة الدفع.
   - *القرار:* استكمال التكامل قبل فتح التسجيل.
2. **تأخر إصدار الوثائق:** يوجد تراكم يستوجب خطة معالجة.
   - *القرار:* اعتماد خطة معالجة للتراكم.
3. **التحول الرقمي لخدمات الطلاب:** يتطلب مقترح ميزانية.
   - *القرار:* رفع المقترح في الاجتماع القادم.

## جدول المهام
| المهمة | المسؤول | تاريخ الاستحقاق |
|---|---|---|
| إنهاء تكامل بوابة الدفع | تقنية المعلومات | خلال أسبوعين |
| خطة معالجة تراكم الوثائق | مديرة التسجيل | خلال 10 أيام |
| مقترح ميزانية التحول الرقمي | وكيل العمادة | الاجتماع القادم |`,
        },
        pipelines: [
            {
                methodId: 'gov-arabic-correspondence',
                relationship: 'follows',
                role: 'Action items become official letters addressed to the relevant parties',
                roleAr: 'تتحول مهام المحضر إلى خطابات رسمية موجّهة للجهات المعنية',
            },
        ],
        uploadGuide: {
            label: 'Upload the meeting notes or transcript with the agenda and attendees',
            labelAr: 'ارفع نقاط أو تسجيل الاجتماع مع جدول الأعمال والحضور',
            allowedFormats: ['.txt', '.docx'],
            exampleFilename: 'meeting-notes.txt',
        },
    },

    'professional-rfp-drafting': {
        sampleInput: {
            title: 'Needs Statement & Mandatory Standards',
            titleAr: 'بيان الاحتياج والمعايير الإلزامية',
            format: 'Word / Text (.docx / .txt)',
            filename: 'needs-statement-hr-system.txt',
            content: `Needs statement:
"We need a cloud HR & payroll system for ~2,400 employees that supports Arabic payslips, integrates with GOSI and Mudad, and lets line managers approve leave on mobile."

Mandatory standards: data hosted in-Kingdom; PDPL-compliant; SSO via the corporate IdP.
Evaluation approach: 60% functional fit, 25% integration, 15% support.`,
        },
        sampleOutput: {
            title: 'RFP Requirements Section (Numbered, Testable)',
            titleAr: 'قسم متطلبات كراسة الطرح (مرقّم وقابل للقياس)',
            format: 'Requirements (.md / .docx)',
            filename: 'rfp-requirements-hr-system.md',
            content: `## Section 4 — Functional & Technical Requirements

**Mandatory (M) / Desirable (D)**

- **R1 (M):** The system shall generate payslips in Arabic and English. *Test: produce a sample payslip in both languages.*
- **R2 (M):** The system shall integrate with GOSI for contribution reporting. *Test: demonstrate a GOSI submission in UAT.*
- **R3 (M):** The system shall integrate with Mudad for payroll disbursement. *Test: demonstrate a Mudad payment file.*
- **R4 (M):** All production data shall be hosted within the Kingdom. *Test: evidence of in-Kingdom data-centre region.*
- **R5 (M):** The system shall comply with PDPL for personal-data handling. *Test: data-processing and retention documentation.*
- **R6 (M):** The system shall support SSO via the corporate identity provider. *Test: federated login in UAT.*
- **R7 (D):** Line managers shall approve leave requests on mobile. *Test: mobile approval walkthrough.*

*Each requirement is a single testable obligation; no requirement names or implies a specific vendor product.*`,
        },
        pipelines: [
            {
                methodId: 'procurement-rfp-eval',
                relationship: 'follows',
                role: 'These requirements become the evaluation criteria bidders are measured against',
                roleAr: 'تتحول هذه المتطلبات إلى معايير تقييم تُقاس بها عروض المتنافسين',
            },
        ],
        uploadGuide: {
            label: 'Upload the needs statement and any mandatory standards',
            labelAr: 'ارفع بيان الاحتياج وأي معايير إلزامية',
            allowedFormats: ['.docx', '.txt'],
            exampleFilename: 'needs-statement.txt',
        },
    },

    'marketing-campaign-brief': {
        sampleInput: {
            title: 'Campaign Goal, Offer & Budget Band',
            titleAr: 'هدف الحملة والعرض ونطاق الميزانية',
            format: 'Text (.txt)',
            filename: 'campaign-goal-ramadan-grocery.txt',
            content: `Goal: Grow online grocery orders during Ramadan among existing app users in Riyadh and Jeddah.
Product/offer: free delivery on orders over SAR 150 + a curated "Iftar essentials" bundle.
Budget band: SAR 300k–500k (performance + social).
Market: Saudi Arabia, bilingual audience, mobile-first.`,
        },
        sampleOutput: {
            title: 'One-Page Campaign Brief',
            titleAr: 'موجز حملة من صفحة واحدة',
            format: 'Brief (.md / .docx)',
            filename: 'campaign-brief-ramadan.md',
            content: `## Campaign Brief — Ramadan Grocery Growth

**Audience.** Existing app users in Riyadh and Jeddah who ordered at least once in the last 6 months; mobile-first, bilingual.

**Single-minded proposition.** Get Iftar essentials delivered free, so the table is ready without the last-minute rush.
**الفكرة الأساسية:** مستلزمات الإفطار توصلك مجاناً، فتكون المائدة جاهزة دون عناء اللحظات الأخيرة.

**Supporting messages.** Free delivery over SAR 150 · curated Iftar bundle · order in minutes.

**Channels (for the SAR 300k–500k band).** App push + in-app banner (owned), paid social (Snapchat, TikTok, Instagram), and search retargeting. No new-channel experiments at this budget.

**Success measures.** Orders per active user vs. pre-Ramadan baseline; bundle attach rate; cost per incremental order; delivery-threshold uplift.

*Creative idea and final channel split remain the team's call.*`,
        },
        pipelines: [
            {
                methodId: 'retail-product-description',
                relationship: 'follows',
                role: 'Generates the on-brand descriptions for the bundle items promoted in the campaign',
                roleAr: 'توليد أوصاف المنتجات للباقة المروّجة ضمن الحملة',
            },
        ],
        uploadGuide: {
            label: 'Upload the campaign goal, the offer, and the budget band',
            labelAr: 'ارفع هدف الحملة والعرض ونطاق الميزانية',
            allowedFormats: ['.txt', '.docx'],
            exampleFilename: 'campaign-goal.txt',
        },
    },

    'energy-technical-doc-search': {
        sampleInput: {
            title: 'Engineering Question + Technical Document Set',
            titleAr: 'سؤال هندسي مع حزمة الوثائق الفنية',
            format: 'PDF bundle + question (.pdf / .txt)',
            filename: 'pump-datasheet-query.txt',
            content: `Equipment in scope: Boiler Feed Water Pump P-2101 (Unit 2)

Question:
"What is the maximum allowable operating temperature for the mechanical seal of P-2101, and what is the required minimum flow?"

Provided documents:
- Pump datasheet Rev C (P-2101)
- Mechanical seal API 682 spec sheet
- Operating manual, Section 5 (limits)
(No thermal-performance appendix was provided.)`,
        },
        sampleOutput: {
            title: 'Grounded Answer with Source Citation',
            titleAr: 'إجابة موثّقة بالمصدر المقتبَس',
            format: 'Answer (.md)',
            filename: 'answer-p-2101-seal-limits.md',
            content: `## Answer — P-2101 seal limits & minimum flow

**Maximum allowable seal temperature.** 180 °C.
> Source: *Mechanical seal API 682 spec sheet, "Operating envelope" table* — "Max. continuous seal-face temperature: 180 °C."

**Required minimum flow.** 30% of BEP flow (i.e. 45 m³/h).
> Source: *Operating manual, Section 5.2 (Minimum flow)* — "Do not operate continuously below 30% of best-efficiency-point flow (45 m³/h)."

**Not found in the provided documents.** The transient/upset temperature allowance is referenced in the thermal-performance appendix, which was **not** supplied — this figure cannot be confirmed from the documents provided.

*A document lookup is not an engineering sign-off — confirm against the controlled master before acting.*`,
        },
        pipelines: [
            {
                methodId: 'energy-hse-report',
                relationship: 'complements',
                role: 'Supplies verified equipment limits referenced in incident investigations',
                roleAr: 'توفير حدود تشغيل المعدات الموثّقة المشار إليها في تحقيقات الحوادث',
            },
        ],
        uploadGuide: {
            label: 'Upload the technical documents and state the question and equipment',
            labelAr: 'ارفع الوثائق الفنية مع تحديد السؤال والمعدة',
            allowedFormats: ['.pdf', '.txt', '.docx'],
            exampleFilename: 'technical-docs.pdf',
        },
    },

    'construction-tender-docs': {
        sampleInput: {
            title: 'Tender Instructions & Project Scope',
            titleAr: 'تعليمات المناقصة ونطاق المشروع',
            format: 'Word / PDF (.docx / .pdf)',
            filename: 'tender-instructions-school-package.docx',
            content: `Tender: Construction of a 24-classroom school — Package SCH-07
Required submission documents (per instructions to bidders):
- Valid Contractor Classification certificate (grade 3+ buildings)
- GOSI certificate & ZATCA certificate
- Technical methodology statement
- HSE plan aligned to the project's safety requirements
- Organisation chart & key personnel CVs
- Priced BoQ (commercial envelope — separate)

Project scope: RC-frame two-storey school, 5,800 m² GFA, 14-month programme, prefabricated partitions, full MEP.
Company standard credentials: Classification grade 2 buildings; 11 completed school projects; ISO 45001 certified.`,
        },
        sampleOutput: {
            title: 'Submission Checklist + Technical Narrative',
            titleAr: 'قائمة تحقق التقديم والسرد الفني',
            format: 'Checklist + Narrative (.docx)',
            filename: 'tender-submission-sch-07.docx',
            content: `## Submission Checklist — Package SCH-07

- [x] Contractor Classification certificate — READY (grade 2 buildings)  ⚠ *Note: instructions ask grade 3+; verify eligibility before bid.*
- [x] GOSI certificate — READY
- [x] ZATCA certificate — READY
- [ ] Technical methodology statement — DRAFTED BELOW
- [ ] HSE plan — DRAFTED BELOW (ISO 45001 referenced)
- [x] Organisation chart & key personnel CVs — READY
- [ ] Priced BoQ — WITH ESTIMATOR (commercial envelope)

## Technical Methodology (draft)
RC-frame two-storey structure delivered in a bottom-up sequence: foundations and ground slab, frame and decks, envelope and prefabricated partitions, then MEP first/second fix and finishes. Prefabricated partitions are scheduled off the critical path to protect the 14-month programme.

## Quality & HSE Approach (draft)
Quality managed under the company ISO-certified system with hold points at each concrete pour and MEP rough-in. HSE plan aligned to ISO 45001 with daily toolbox talks and a permit-to-work system for high-risk activities.

*Price and programme dates intentionally left blank for the estimator.*`,
        },
        pipelines: [
            {
                methodId: 'professional-rfp-drafting',
                relationship: 'complements',
                role: 'Aligns the submission against each numbered tender requirement',
                roleAr: 'مواءمة التقديم مع كل متطلب مرقّم في كراسة الطرح',
            },
        ],
        uploadGuide: {
            label: 'Upload the tender instructions and the project scope',
            labelAr: 'ارفع تعليمات المناقصة ونطاق المشروع',
            allowedFormats: ['.docx', '.pdf'],
            exampleFilename: 'tender-instructions.docx',
        },
    },

    'logistics-incident-report': {
        sampleInput: {
            title: 'Raw Driver/Dispatcher Incident Report',
            titleAr: 'تقرير الحادثة الأولي من السائق/المُرسِل',
            format: 'Text / CRM (.txt / .json)',
            filename: 'raw-incident-order-7731.txt',
            content: `Order: #SA-7731 | Route: RUH-Z4-evening | Driver report time: 19:42
Raw note: "الطلب رقم 7731 وصل متأخر ساعتين. الزحام كان شديد وبعدها تعطلت المركبة نص ساعة. العميل غاضب ويطالب بتعويض. الطلب فيه مواد مبردة ويمكن بعضها تأثر."
Resolution taken: replacement delivery dispatched same night at 21:10; cold items flagged for quality check at depot.`,
        },
        sampleOutput: {
            title: 'Internal Record + Customer-Facing Summary',
            titleAr: 'سجل داخلي وملخص موجّه للعميل',
            format: 'Two-part Report (.md / .docx)',
            filename: 'incident-report-7731.md',
            content: `## Internal Incident Record — Order #SA-7731

- **Sequence:** Delivery on route RUH-Z4 delayed ~2 hours; heavy congestion followed by a ~30-minute vehicle breakdown. Replacement delivery dispatched 21:10 the same night.
- **Cause (as reported):** traffic congestion + vehicle breakdown (unconfirmed mechanical cause).
- **Affected goods:** order included chilled items; flagged for quality check at depot.
- **Resolution:** replacement delivery completed; cold-chain check pending.

## Customer-Facing Summary (neutral)
نعتذر عن تأخر وصول طلبكم رقم 7731 مساء اليوم نتيجة ظروف طريق خارجة عن المعتاد. وقد بادرنا بإرسال توصيلة بديلة في نفس الليلة، كما تم فحص العناصر المبردة في المستودع للتأكد من مطابقتها. فريق الخدمة سيتواصل معكم لمتابعة الطلب.

*The customer summary states facts only — it makes no admission of liability and offers no compensation; any goodwill gesture is the team's decision.*`,
        },
        pipelines: [
            {
                methodId: 'telecom-cs-response',
                relationship: 'follows',
                role: 'Turns the neutral summary into the finished customer reply with the approved gesture',
                roleAr: 'تحويل الملخص المحايد إلى رد نهائي للعميل مع المبادرة المعتمدة',
            },
        ],
        uploadGuide: {
            label: 'Upload the raw report with the order/route reference and resolution',
            labelAr: 'ارفع التقرير الأولي مع رقم الطلب/المسار والإجراء المتخذ',
            allowedFormats: ['.txt', '.json'],
            exampleFilename: 'raw-incident.txt',
        },
    },

    'teaching-lesson-plan': {
        sampleInput: {
            title: 'المادة والمرحلة وموضوع الدرس وزمن الحصة',
            titleAr: 'المادة والمرحلة وموضوع الدرس وزمن الحصة',
            format: 'Text (.txt)',
            filename: 'lesson-request-science-g6.txt',
            content: `المادة: العلوم
الصف/المرحلة: السادس الابتدائي
موضوع الدرس: دورة الماء في الطبيعة
زمن الحصة: 45 دقيقة
ملاحظات: يتوفر جهاز عرض وأدوات تجربة بسيطة (ماء، كوب، صحن بارد).
الإطار المعتمد: وثيقة منهج العلوم للمرحلة الابتدائية.`,
        },
        sampleOutput: {
            title: 'خطة الدرس المنظمة بالأهداف والأنشطة والتقويم',
            titleAr: 'خطة الدرس المنظمة بالأهداف والأنشطة والتقويم',
            format: 'Lesson Plan (.docx)',
            filename: 'lesson-plan-water-cycle.docx',
            content: `# خطة درس: دورة الماء في الطبيعة — الصف السادس (45 دقيقة)

## الأهداف التعليمية
بنهاية الحصة يكون الطالب قادراً على أن:
1. يسمّي مراحل دورة الماء (التبخر، التكاثف، الهطول، الجريان).
2. يفسّر دور حرارة الشمس في عملية التبخر.
3. يربط دورة الماء بأمثلة من بيئته المحلية.

## تسلسل الأنشطة (موزّعة على الزمن)
- **تهيئة (5 د):** سؤال محفّز — "أين يذهب ماء المطر؟"
- **النشاط الرئيسي (25 د):** تجربة التكاثف بالكوب والصحن البارد مع عرض توضيحي ورسم مخطط الدورة.
- **الخاتمة (10 د):** ربط المفهوم بأمثلة محلية ومناقشة جماعية قصيرة.

## التقويم التكويني (5 د)
ورقة خروج من سؤالين: رتّب مراحل الدورة، واذكر مثالاً للتبخر من حياتك اليومية.

*ملاحظة مواءمة: الأهداف مبنية على مستوى الصف السادس وفق الإطار المعتمد؛ يُكيّف المعلم النشاط حسب طبيعة الفصل.*`,
        },
        pipelines: [
            {
                methodId: 'education-exam-bank',
                relationship: 'follows',
                role: 'Generates graded assessment questions aligned to the lesson objectives',
                roleAr: 'توليد أسئلة تقويم متدرجة مواءمة لأهداف الدرس',
            },
        ],
        uploadGuide: {
            label: 'Upload the subject, grade, lesson topic, and class duration',
            labelAr: 'ارفع المادة والصف وموضوع الدرس وزمن الحصة',
            allowedFormats: ['.txt', '.docx'],
            exampleFilename: 'lesson-request.txt',
        },
    },

    'retail-product-description': {
        sampleInput: {
            title: 'Product Spec Sheet & Brand Tone',
            titleAr: 'بطاقة مواصفات المنتج ونبرة العلامة',
            format: 'Text / CSV (.txt / .csv)',
            filename: 'spec-sheet-air-fryer.txt',
            content: `Product: 5.5L Digital Air Fryer — Model AF-550
Listed features (use ONLY these):
- 5.5-litre non-stick basket
- 8 preset programmes
- Digital touch panel, 60-min timer
- 1700W, auto shut-off
- Dishwasher-safe basket
Brand tone: friendly, practical, no hype.
Target length: ~45 words per language.`,
        },
        sampleOutput: {
            title: 'Parallel Arabic + English Descriptions',
            titleAr: 'وصفان متكافئان بالعربية والإنجليزية',
            format: 'Copy (.md)',
            filename: 'product-copy-af-550.md',
            content: `## English (46 words)
Cook family-sized meals the easy way. The AF-550 Digital Air Fryer holds 5.5 litres in a non-stick, dishwasher-safe basket, with 8 presets and a digital touch panel. Its 1700W element and 60-minute timer handle everything from fries to roast chicken, with auto shut-off for peace of mind.

## العربية (44 كلمة)
حضّر وجبات العائلة بسهولة مع قلاية AF-550 الرقمية بسعة 5.5 لتر وسلة مانعة للالتصاق وقابلة للغسل في الجلاية. تمنحك 8 برامج جاهزة ولوحة لمس رقمية، مع عنصر تسخين 1700 واط ومؤقّت 60 دقيقة وإيقاف تلقائي للأمان — من البطاطس إلى الدجاج المشوي.

*Only listed features used; no unsubstantiated superlatives; both versions written natively, not translated.*`,
        },
        pipelines: [
            {
                methodId: 'marketing-campaign-brief',
                relationship: 'precedes',
                role: 'Campaign brief defines the tone and audience these descriptions serve',
                roleAr: 'موجز الحملة يحدد النبرة والجمهور اللذين يخدمهما الوصف',
            },
        ],
        uploadGuide: {
            label: 'Upload the product spec sheet and the brand tone',
            labelAr: 'ارفع بطاقة مواصفات المنتج ونبرة العلامة',
            allowedFormats: ['.txt', '.csv'],
            exampleFilename: 'spec-sheet.txt',
        },
    },

    'legal-contract-clauses': {
        sampleInput: {
            title: 'نوع العقد والطرف والمخاطرة المطلوب تغطيتها',
            titleAr: 'نوع العقد والطرف والمخاطرة المطلوب تغطيتها',
            format: 'Text (.txt)',
            filename: 'clause-request-liability-cap.txt',
            content: `نوع العقد: عقد تقديم خدمات تقنية (SaaS)
الطرف الذي نمثله: مزوّد الخدمة
البند المطلوب: تحديد سقف المسؤولية
المخاطرة: الحد من التعويضات المطالب بها حال الإخلال
ملاحظة: يجب أن يكون البند من مكتبة بنود المكتب القياسية، لا صياغة جديدة.`,
        },
        sampleOutput: {
            title: 'البند القياسي مع المتغيرات وبيان الانحياز',
            titleAr: 'البند القياسي مع المتغيرات وبيان الانحياز',
            format: 'Clause (.docx)',
            filename: 'clause-liability-cap.docx',
            content: `## بند تحديد سقف المسؤولية (من مكتبة البنود — مرجع LC-07)

"مع عدم الإخلال بالأحكام الآمرة، لا تتجاوز المسؤولية الإجمالية لمزوّد الخدمة الناشئة عن هذا العقد أو المتعلقة به — أياً كان سببها — مبلغاً إجمالياً قدره [القيمة: يُدرج المبلغ أو ما يعادل رسوم [عدد] أشهر السابقة]. ولا يُسأل مزوّد الخدمة بأي حال عن الأضرار غير المباشرة أو التبعية أو فوات الكسب."

**لصالح أي طرف ينحاز:** هذا البند يميل لصالح **مزوّد الخدمة** (يحدّ من تعرضه).

**المتغيرات الواجب تعبئتها:**
- [القيمة]: سقف المبلغ أو معادل عدد الأشهر.
- [عدد] الأشهر المرجعية لحساب السقف.

*ملاحظة: البند مسترجَع من مكتبة المكتب ولم يُصَغ من الصفر. المشورة القانونية وموقف التفاوض يبقيان بمسؤولية المحامي.*`,
        },
        pipelines: [
            {
                methodId: 'legal-policy-drafting',
                relationship: 'complements',
                role: 'Clauses are assembled under the governing internal policy framework',
                roleAr: 'تُجمّع البنود ضمن إطار السياسة الداخلية الحاكمة',
            },
        ],
        uploadGuide: {
            label: 'State the contract type, the party you act for, and the risk to allocate',
            labelAr: 'حدّد نوع العقد والطرف الذي تمثله والمخاطرة المطلوب توزيعها',
            allowedFormats: ['.txt', '.docx'],
            exampleFilename: 'clause-request.txt',
        },
    },

    'education-exam-bank': {
        sampleInput: {
            title: 'محتوى الدرس وتوزيع الصعوبة وأنواع الأسئلة',
            titleAr: 'محتوى الدرس وتوزيع الصعوبة وأنواع الأسئلة',
            format: 'Text (.txt)',
            filename: 'exam-request-water-cycle.txt',
            content: `محتوى الدرس: دورة الماء في الطبيعة (التبخر، التكاثف، الهطول، الجريان ودور حرارة الشمس).
عدد الأسئلة: 5
توزيع الصعوبة: 2 سهل، 2 متوسط، 1 صعب
أنواع الأسئلة المسموحة: اختيار من متعدد، صح/خطأ، سؤال مقالي قصير.
المرحلة: السادس الابتدائي.`,
        },
        sampleOutput: {
            title: 'بنك الأسئلة مع مفتاح الإجابة وجدول المواصفات',
            titleAr: 'بنك الأسئلة مع مفتاح الإجابة وجدول المواصفات',
            format: 'Question Bank (.docx)',
            filename: 'exam-bank-water-cycle.docx',
            content: `# بنك أسئلة: دورة الماء في الطبيعة

1. (سهل · اختيار من متعدد) العملية التي يتحول بها الماء من سائل إلى بخار تسمى:
   أ) التكاثف  ب) التبخر  ج) الهطول  د) الجريان
2. (سهل · صح/خطأ) حرارة الشمس هي المحرّك الأساسي لعملية التبخر. ( )
3. (متوسط · اختيار من متعدد) تكوّن الغيوم ينتج عن عملية:
   أ) التبخر  ب) التكاثف  ج) الترشيح  د) التجمد
4. (متوسط · صح/خطأ) الهطول يشمل المطر والثلج والبرَد. ( )
5. (صعب · مقالي قصير) اشرح بأسلوبك كيف تتكرر دورة الماء، مستعيناً بمثال من بيئتك.

## مفتاح الإجابة
1-ب | 2-صح | 3-ب | 4-صح | 5- إجابة نموذجية: تبخر بفعل الشمس ← تكاثف وتكوّن غيوم ← هطول ← جريان وعودة للمسطحات، وتتكرر.

## جدول المواصفات
| السؤال | الهدف | الصعوبة |
|---|---|---|
| 1 | تسمية مراحل الدورة | سهل |
| 2 | دور حرارة الشمس | سهل |
| 3 | تفسير التكاثف | متوسط |
| 4 | التعرف على أشكال الهطول | متوسط |
| 5 | الربط والاستنتاج | صعب |

*جميع الأسئلة مبنية على محتوى الدرس فقط.*`,
        },
        pipelines: [
            {
                methodId: 'teaching-lesson-plan',
                relationship: 'precedes',
                role: 'The lesson plan defines the objectives these questions are mapped against',
                roleAr: 'خطة الدرس تحدد الأهداف التي تُربط بها الأسئلة',
            },
        ],
        uploadGuide: {
            label: 'Upload the lesson content with the difficulty split and question types',
            labelAr: 'ارفع محتوى الدرس مع توزيع الصعوبة وأنواع الأسئلة',
            allowedFormats: ['.txt', '.docx'],
            exampleFilename: 'exam-request.txt',
        },
    },

    'sales-outreach-sequence': {
        sampleInput: {
            title: 'Prospect Segment, Value Proposition & Proof Point',
            titleAr: 'شريحة العملاء والقيمة المقدمة ونقطة الإثبات',
            format: 'Text (.txt)',
            filename: 'outreach-input-fleet-telematics.txt',
            content: `Prospect segment: Operations managers at mid-size logistics firms (50–200 vehicles) in KSA.
Value proposition: a telematics platform that cuts fuel spend and improves on-time delivery.
Single proof point: "A Riyadh distributor cut fuel cost per km by 11% in the first quarter."
Constraints: no false urgency, clear opt-out, three messages.`,
        },
        sampleOutput: {
            title: 'Three-Touch Outreach Sequence',
            titleAr: 'سلسلة تواصل من ثلاث رسائل',
            format: 'Sequence (.md)',
            filename: 'outreach-sequence-telematics.md',
            content: `## Message 1 — Opener
Subject: Fuel cost per km for a 50–200 vehicle fleet
Hi [Name], most operations managers we speak with are under pressure on fuel spend and on-time delivery at once. A Riyadh distributor using our telematics platform cut fuel cost per km by 11% in their first quarter. Worth a 15-minute look for [Company]?

## Message 2 — Follow-up (if no reply)
Hi [Name], following up briefly. The 11% fuel-per-km reduction came from routing and idling insights, not new hardware contracts. Happy to share how that maps to a fleet your size — no prep needed.

## Message 3 — Close
Hi [Name], I'll leave it here so I'm not cluttering your inbox. If fuel and on-time delivery move up the priority list, just reply and I'll send the one-pager. If you'd rather not hear from me, reply "stop" and I'll close this out.

*No false urgency, no fabricated personalisation, clear opt-out in the final message.*`,
        },
        pipelines: [
            {
                methodId: 'marketing-campaign-brief',
                relationship: 'precedes',
                role: 'The campaign brief sets the positioning the outreach sequence echoes',
                roleAr: 'موجز الحملة يحدد التموضع الذي تعكسه رسائل التواصل',
            },
        ],
        uploadGuide: {
            label: 'Upload the segment, value proposition, and one proof point',
            labelAr: 'ارفع الشريحة والقيمة المقدمة ونقطة إثبات واحدة',
            allowedFormats: ['.txt'],
            exampleFilename: 'outreach-input.txt',
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

export function getCliExecution(method: IMethod, modelSlug?: string): ICliExecution {
    const inputExample = getSampleInput(method);
    const filename = inputExample.filename || 'input.txt';
    const agents = getAgentsForMethod(method)
        .map((agent) => agent.id)
        .join(',');
    const model = modelSlug || 'anthropic/claude-sonnet-4.5';
    const outName = `output-${method.id}.md`;

    return {
        command: `maktaba run --method "${method.id}" \\\n  --model "${model}" \\\n  --input ./${filename} \\\n  --agents "${agents}" \\\n  --output ./${outName}`,
        inputFlag: `--input ./${filename}`,
        notes: `Runs the workflow on the Al-Maktaba CLI — a model-agnostic runner — attaching the shared quality gates and streaming the verified output to ${outName}.`,
        notesAr: `يشغّل الأسلوب عبر واجهة Al-Maktaba CLI، وهي مشغّل محايد للنماذج، مع إرفاق بوابات الجودة المشتركة وحفظ المخرج المعتمد في ${outName}.`,
    };
}
