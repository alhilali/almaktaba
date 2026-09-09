import type { IMethod, IMethodVersion } from '@/data/types';

/**
 * Seed catalogue — 24 methods. All figures are illustrative sample data.
 * Distribution is deliberately uneven: a few heavily reused, most lightly,
 * several never reused. A library where everything is popular reads as fake.
 */

type Seed = Pick<
    IMethod,
    | 'id'
    | 'title'
    | 'titleLang'
    | 'description'
    | 'author'
    | 'organisation'
    | 'version'
    | 'publishDate'
    | 'sectorId'
    | 'roleId'
    | 'language'
    | 'sensitivity'
    | 'reuseCount'
    | 'timeBeforeMin'
    | 'timeAfterMin'
    | 'whatItDoes'
    | 'inputsRequired'
    | 'whatStaysHuman'
    | 'methodBody'
    | 'outputFormat'
    | 'qualityChecklist'
> &
    Partial<
        Pick<IMethod, 'provenance' | 'performance' | 'reuseTrail' | 'versionHistory' | 'rating'>
    >;

const DEFAULT_MODELS = ['GPT-5', 'Gemini 2.5 Pro'];

function ratingFor(score: number, count: number): IMethod['rating'] {
    // Illustrative distribution weighted toward the mean score.
    const distribution: [number, number, number, number, number] =
        count === 0
            ? [0, 0, 0, 0, 0]
            : score >= 4.5
              ? [
                    Math.round(count * 0.72),
                    Math.round(count * 0.2),
                    Math.round(count * 0.06),
                    Math.round(count * 0.02),
                    0,
                ]
              : [
                    Math.round(count * 0.45),
                    Math.round(count * 0.3),
                    Math.round(count * 0.15),
                    Math.round(count * 0.07),
                    Math.round(count * 0.03),
                ];
    return { score, count, distribution };
}

function completeMethod(seed: Seed): IMethod {
    const provenance = seed.provenance ?? {
        builtOn: 'Claude Sonnet 4.5',
        alsoReported: DEFAULT_MODELS,
    };
    const performance = seed.performance ?? {
        runs: seed.reuseCount === 0 ? 1 : seed.reuseCount + 2,
        accuracyNote:
            'Author reports output is usable as a first draft with light editing. Not independently measured.',
    };
    const reuseTrail = seed.reuseTrail ?? {
        people: seed.reuseCount,
        organisations: seed.reuseCount === 0 ? 0 : Math.max(1, Math.min(4, Math.ceil(seed.reuseCount / 6))),
        sectorBreakdown:
            seed.reuseCount === 0 ? [] : [{ sectorId: seed.sectorId, count: seed.reuseCount }],
    };
    const versionHistory: IMethodVersion[] = seed.versionHistory ?? [
        {
            version: seed.version,
            date: seed.publishDate,
            note: 'First published.',
            author: seed.author,
            isCurrent: true,
        },
    ];
    const rating = seed.rating ?? ratingFor(0, 0);
    return { ...seed, provenance, performance, reuseTrail, versionHistory, rating };
}

const SEEDS: Seed[] = [
    // ---- Heavily reused (20+) ----
    {
        id: 'gov-arabic-correspondence',
        title: 'صياغة المراسلات الرسمية الحكومية',
        titleLang: 'ar',
        description:
            'توليد مسودة خطاب رسمي مطابق لدليل التراسل الحكومي من نقاط موجزة، مع ضبط الترويسة والصياغة والخاتمة.',
        author: 'نورة القحطاني',
        organisation: 'Ministry programme office',
        version: 'v3',
        publishDate: '2025-02-11',
        sectorId: 'government',
        roleId: 'admin',
        language: 'Arabic',
        sensitivity: 'Internal',
        reuseCount: 41,
        timeBeforeMin: 45,
        timeAfterMin: 12,
        rating: ratingFor(4.8, 22),
        whatItDoes:
            'Turns a few bullet points into a formal Arabic letter that follows the government correspondence guide — correct salutation, register, structure and closing.',
        inputsRequired: [
            'The recipient and their title',
            'Three to five bullet points of what the letter must say',
            'The desired tone: routine, urgent, or ceremonial',
        ],
        whatStaysHuman:
            'The decision the letter communicates, and the final sign-off. The method drafts; a person owns the message and approves it before it leaves.',
        methodBody:
            'أنت تصيغ مراسلة حكومية رسمية باللغة العربية وفق دليل التراسل الحكومي الموحد. ابدأ بالبسملة ثم الترويسة والرقم والتاريخ الهجري، واستخدم الألقاب والصيغة المناسبة لرتبة المستلم، واذكر الغرض في الفقرة الأولى، ثم التفاصيل في المتن، واختم بالصيغة الرسمية المعتمدة. حافظ على أسلوب رسمي وقور وغير شخصي، ولا تختلق أي معلومة خارج النقاط المزودة.',
        outputFormat:
            'A complete letter with header block, body, and closing, ready to paste into the official template.',
        qualityChecklist: [
            'Salutation matches the recipient\'s rank',
            'No facts beyond the supplied bullet points',
            'Formal register held throughout',
            'Closing follows the standard form',
        ],
        versionHistory: [
            { version: 'v3', date: '2025-02-11', note: 'Added ceremonial-tone variant.', author: 'نورة القحطاني', isCurrent: true },
            { version: 'v2', date: '2024-11-03', note: 'Tightened the closing formulas.', author: 'نورة القحطاني', isCurrent: false },
            { version: 'v1', date: '2024-08-19', note: 'First published.', author: 'نورة القحطاني', isCurrent: false },
        ],
        reuseTrail: {
            people: 41,
            organisations: 4,
            sectorBreakdown: [
                { sectorId: 'government', count: 29 },
                { sectorId: 'education', count: 7 },
                { sectorId: 'healthcare', count: 5 },
            ],
        },
    },
    {
        id: 'banking-credit-memo',
        title: 'Credit memo first draft',
        titleLang: 'en',
        description:
            'Drafts the narrative sections of a credit memo from the deal facts and spreads, leaving the numbers and the recommendation to the analyst.',
        author: 'Faisal Al-Otaibi',
        organisation: 'Corporate bank, credit risk',
        version: 'v2',
        publishDate: '2025-01-22',
        sectorId: 'banking',
        roleId: 'finance',
        language: 'English',
        sensitivity: 'Confidential',
        reuseCount: 34,
        timeBeforeMin: 120,
        timeAfterMin: 40,
        rating: ratingFor(4.6, 19),
        whatItDoes:
            'Produces the business-description, industry-context and risk-narrative sections of a credit memo from structured deal inputs, in the house style.',
        inputsRequired: [
            'Borrower profile and sector',
            'Key financial spreads (revenue, EBITDA, leverage)',
            'The facility being requested',
        ],
        whatStaysHuman:
            'The credit judgement and the recommendation. This method never states a rating or an approve/decline — those remain the analyst\'s call.',
        methodBody:
            'Draft the narrative sections of a corporate credit memo. Describe the borrower\'s business and sector position, summarise the financial trend from the spreads provided, and lay out the principal risks with a neutral framing. Do not state a credit rating, a recommendation, or a probability of default. Flag any figure that looks internally inconsistent rather than smoothing over it.',
        outputFormat:
            'Three labelled sections — Business & sector, Financial summary, Key risks — as editable prose.',
        qualityChecklist: [
            'No rating or recommendation stated',
            'Every figure traces to a supplied input',
            'Inconsistent figures flagged, not hidden',
            'House risk-language conventions followed',
        ],
        versionHistory: [
            { version: 'v2', date: '2025-01-22', note: 'Added the inconsistency-flagging rule.', author: 'Faisal Al-Otaibi', isCurrent: true },
            { version: 'v1', date: '2024-10-30', note: 'First published.', author: 'Faisal Al-Otaibi', isCurrent: false },
        ],
        performance: {
            runs: 36,
            accuracyNote:
                'Author reports the narrative is usable after a review pass; the analyst still writes the recommendation. Not independently measured.',
        },
        reuseTrail: {
            people: 34,
            organisations: 3,
            sectorBreakdown: [
                { sectorId: 'banking', count: 30 },
                { sectorId: 'professional', count: 4 },
            ],
        },
    },
    {
        id: 'telecom-cs-response',
        title: 'صياغة ردود خدمة العملاء',
        titleLang: 'ar',
        description:
            'توليد رد مهذب ودقيق على استفسار العميل بالعربية، مع الالتزام بنبرة العلامة التجارية وسياسات الاسترجاع.',
        author: 'ريم الدوسري',
        organisation: 'Telecom operator, care centre',
        version: 'v2',
        publishDate: '2025-03-04',
        sectorId: 'telecom',
        roleId: 'customer-service',
        language: 'Arabic',
        sensitivity: 'Internal',
        reuseCount: 27,
        timeBeforeMin: 9,
        timeAfterMin: 3,
        rating: ratingFor(4.4, 15),
        whatItDoes:
            'Drafts a courteous, on-policy Arabic reply to a customer message, matching brand tone and citing the relevant policy without over-promising.',
        inputsRequired: [
            'The customer message',
            'The relevant policy or account fact',
            'Tone: standard, apologetic, or firm',
        ],
        whatStaysHuman:
            'Any promise of compensation or exception to policy. The agent decides what to offer; the method only phrases it.',
        methodBody:
            'اكتب رداً على العميل باللغة العربية الفصحى بنبرة ودودة ومهنية. أقرّ بالمشكلة المحددة، واذكر السياسة المطبّقة بوضوح، ثم حدّد الخطوة التالية. لا تَعِد باسترجاع أو رصيد أو استثناء ما لم يزوّدك الموظف بذلك كمُدخل.',
        outputFormat: 'A ready-to-send reply, plus a one-line internal note on which policy was applied.',
        qualityChecklist: [
            'Addresses the specific issue raised',
            'No unauthorised promises',
            'Brand tone held',
            'Next step is concrete',
        ],
        versionHistory: [
            { version: 'v2', date: '2025-03-04', note: 'Added the firm-tone variant for repeated contacts.', author: 'ريم الدوسري', isCurrent: true },
            { version: 'v1', date: '2024-12-15', note: 'First published.', author: 'ريم الدوسري', isCurrent: false },
        ],
        reuseTrail: {
            people: 27,
            organisations: 2,
            sectorBreakdown: [
                { sectorId: 'telecom', count: 22 },
                { sectorId: 'retail', count: 5 },
            ],
        },
    },
    // ---- Moderately reused (9-19) ----
    {
        id: 'legal-policy-drafting',
        title: 'صياغة السياسات واللوائح الداخلية',
        titleLang: 'ar',
        description:
            'تحويل قرار إداري موجز إلى مسودة سياسة داخلية منظمة بالبنود والتعريفات والنطاق.',
        author: 'خالد العمري',
        organisation: 'Public authority, legal affairs',
        version: 'v1',
        publishDate: '2025-04-18',
        sectorId: 'government',
        roleId: 'legal',
        language: 'Bilingual',
        sensitivity: 'Internal',
        reuseCount: 16,
        timeBeforeMin: 180,
        timeAfterMin: 70,
        rating: ratingFor(4.5, 11),
        whatItDoes:
            'Expands a short administrative decision into a structured internal policy draft: purpose, scope, definitions, provisions and responsibilities.',
        inputsRequired: [
            'The administrative decision or intent',
            'Who the policy applies to',
            'Any existing policy it amends or replaces',
        ],
        whatStaysHuman:
            'Legal review and the binding interpretation. The draft is a starting structure, not counsel.',
        methodBody:
            'اصُغ مسودة سياسة داخلية باللغة العربية انطلاقاً من القرار الإداري المزود. أنتج أقساماً مرقمة: الغرض، النطاق، التعريفات، الأحكام، المسؤوليات، وتاريخ النفاذ. اجعل كل حكم التزاماً واحداً فقط. ضع أي نقطة تحتاج قراراً قانونياً بين أقواس كملاحظة بدلاً من التخمين.',
        outputFormat: 'A numbered policy document with a bracketed list of open legal questions at the end.',
        qualityChecklist: [
            'One obligation per provision',
            'Open legal questions bracketed, not guessed',
            'Scope and definitions present',
            'Effective date included',
        ],
    },
    {
        id: 'professional-proposal',
        title: 'Consulting proposal first draft',
        titleLang: 'en',
        description:
            'Builds the approach, workplan and team sections of a consulting proposal from the brief and a past engagement, in firm style.',
        author: 'Sara Al-Harbi',
        organisation: 'Advisory firm',
        version: 'v2',
        publishDate: '2025-02-27',
        sectorId: 'professional',
        roleId: 'executive',
        language: 'English',
        sensitivity: 'Internal',
        reuseCount: 14,
        timeBeforeMin: 150,
        timeAfterMin: 55,
        rating: ratingFor(4.3, 9),
        whatItDoes:
            'Drafts the understanding, approach, workplan and team sections of a proposal, reusing the shape of a comparable past engagement.',
        inputsRequired: ['The client brief or RFP', 'A comparable past engagement', 'Available team profiles'],
        whatStaysHuman:
            'Pricing, commercial terms and the win themes. The method drafts the method, not the deal.',
        methodBody:
            'Draft a consulting proposal from the brief. Produce four sections: our understanding of the problem, proposed approach, workplan with phases and deliverables, and proposed team. Reuse the structure of the comparable engagement supplied but do not copy client-specific facts from it. Leave pricing out entirely.',
        outputFormat: 'Four proposal sections as editable prose, with a phased workplan table.',
        qualityChecklist: [
            'No pricing included',
            'No facts copied from the reference client',
            'Workplan has phases and deliverables',
            'Team maps to the brief',
        ],
        versionHistory: [
            { version: 'v2', date: '2025-02-27', note: 'Added the workplan table format.', author: 'Sara Al-Harbi', isCurrent: true },
            { version: 'v1', date: '2024-12-01', note: 'First published.', author: 'Sara Al-Harbi', isCurrent: false },
        ],
    },
    {
        id: 'energy-hse-report',
        title: 'HSE incident report draft',
        titleLang: 'en',
        description:
            'Turns field notes from a safety observation into a structured HSE report with a factual sequence and a corrective-action list.',
        author: 'Abdullah Al-Ghamdi',
        organisation: 'Petrochemical operator, HSE',
        version: 'v1',
        publishDate: '2025-05-09',
        sectorId: 'energy',
        roleId: 'operations',
        language: 'Bilingual',
        sensitivity: 'Internal',
        reuseCount: 11,
        timeBeforeMin: 60,
        timeAfterMin: 22,
        rating: ratingFor(4.2, 8),
        whatItDoes:
            'Converts raw field notes into a structured HSE report: what happened, contributing factors, immediate actions, and recommended corrective actions.',
        inputsRequired: ['Field notes from the observation', 'Location and asset', 'Severity classification'],
        whatStaysHuman:
            'The root-cause determination and the severity call. The method organises; the HSE lead judges.',
        methodBody:
            'Write an HSE report from the field notes. Give a neutral, time-ordered sequence of what happened, list contributing factors as observations rather than conclusions, record the immediate actions taken, and propose corrective actions. Do not assign blame to a named person. Keep root cause tentative unless the notes state it.',
        outputFormat: 'A four-part report: sequence, contributing factors, immediate actions, corrective actions.',
        qualityChecklist: [
            'No named blame',
            'Sequence is time-ordered and factual',
            'Root cause left tentative unless stated',
            'Corrective actions are specific',
        ],
    },
    {
        id: 'hr-job-description',
        title: 'كتابة الوصف الوظيفي',
        titleLang: 'ar',
        description:
            'إعداد وصف وظيفي متوازن من المسمى والمهام الأساسية، مع فصل المتطلبات الإلزامية عن المفضلة.',
        author: 'هند الشمري',
        organisation: 'Retail group, HR',
        version: 'v1',
        publishDate: '2025-03-30',
        sectorId: 'retail',
        roleId: 'hr',
        language: 'Arabic',
        sensitivity: 'Internal',
        reuseCount: 9,
        timeBeforeMin: 40,
        timeAfterMin: 12,
        rating: ratingFor(4.1, 7),
        whatItDoes:
            'Produces a balanced Arabic job description from a title and core duties, cleanly separating essential from preferred requirements.',
        inputsRequired: ['Job title and grade', 'Three to six core duties', 'Team and reporting line'],
        whatStaysHuman:
            'The grade, the salary band and any exclusionary requirement. The method drafts; HR owns fairness.',
        methodBody:
            'اكتب وصفاً وظيفياً باللغة العربية يتضمن: الغرض من الوظيفة، المهام الرئيسية، المتطلبات الإلزامية، والمتطلبات المفضلة كقوائم منفصلة. استخدم لغة شاملة وتجنّب اشتراط متطلبات غير ضرورية فعلاً للدور. لا تذكر الراتب.',
        outputFormat: 'A structured job description with essential and preferred requirements kept separate.',
        qualityChecklist: [
            'Essential and preferred kept separate',
            'No unnecessary exclusionary requirements',
            'Inclusive language',
            'No salary stated',
        ],
    },
    // ---- Lightly reused (1-8) ----
    {
        id: 'finance-variance-commentary',
        title: 'Monthly variance commentary',
        titleLang: 'en',
        description:
            'Writes the narrative that explains month-on-month P&L variances from the figures and a few driver notes.',
        author: 'Yousef Al-Nasser',
        organisation: 'Logistics group, FP&A',
        version: 'v1',
        publishDate: '2025-06-02',
        sectorId: 'logistics',
        roleId: 'finance',
        language: 'English',
        sensitivity: 'Internal',
        reuseCount: 8,
        timeBeforeMin: 50,
        timeAfterMin: 18,
        rating: ratingFor(4.0, 6),
        whatItDoes:
            'Drafts the commentary explaining each material variance in a monthly management pack, grounded only in the figures and driver notes supplied.',
        inputsRequired: ['The variance table', 'Short driver notes per line', 'Materiality threshold'],
        whatStaysHuman: 'The judgement of what is material and what to escalate.',
        methodBody:
            'Write variance commentary for the lines above the materiality threshold. For each, state the movement, attribute it to the driver note supplied, and avoid speculating beyond the notes. Keep each explanation to two sentences.',
        outputFormat: 'One short commentary paragraph per material line.',
        qualityChecklist: [
            'Only lines above threshold covered',
            'No speculation beyond driver notes',
            'Two sentences per line',
            'Figures match the table',
        ],
    },
    {
        id: 'data-sql-from-question',
        title: 'SQL from a plain-language question',
        titleLang: 'en',
        description:
            'Turns a business question into a documented SQL query against a described schema, with its assumptions stated.',
        author: 'Tariq Al-Zahrani',
        organisation: 'E-commerce platform, analytics',
        version: 'v1',
        publishDate: '2025-05-21',
        sectorId: 'retail',
        roleId: 'data',
        language: 'English',
        sensitivity: 'Internal',
        reuseCount: 8,
        timeBeforeMin: 25,
        timeAfterMin: 8,
        rating: ratingFor(4.3, 5),
        whatItDoes:
            'Writes a SQL query answering a business question against a provided schema, and lists the assumptions it made so they can be checked.',
        inputsRequired: ['The question in plain language', 'The relevant table and column definitions', 'The SQL dialect'],
        whatStaysHuman: 'Verifying the result against known numbers before anyone acts on it.',
        methodBody:
            'Given the schema and the question, write a single SQL query in the stated dialect. List every assumption you made about joins, filters and date ranges as comments above the query. Do not invent columns that are not in the schema.',
        outputFormat: 'A commented SQL query with an assumptions block at the top.',
        qualityChecklist: [
            'Only schema columns used',
            'Assumptions stated as comments',
            'Correct dialect',
            'Query is a single statement',
        ],
    },
    {
        id: 'procurement-rfp-eval',
        title: 'RFP response evaluation grid',
        titleLang: 'en',
        description:
            'Builds a scoring grid that maps each bidder response to the stated evaluation criteria, with gaps flagged.',
        author: 'Mansour Al-Qahtani',
        organisation: 'Utility, procurement',
        version: 'v1',
        publishDate: '2025-04-07',
        sectorId: 'energy',
        roleId: 'procurement',
        language: 'English',
        sensitivity: 'Confidential',
        reuseCount: 7,
        timeBeforeMin: 90,
        timeAfterMin: 35,
        rating: ratingFor(4.1, 5),
        whatItDoes:
            'Maps each bidder\'s response against the published evaluation criteria and flags where a response is missing or non-compliant.',
        inputsRequired: ['The evaluation criteria', 'The bidder responses', 'The compliance requirements'],
        whatStaysHuman:
            'The scores themselves and the award decision. The method organises evidence; the committee scores.',
        methodBody:
            'Build an evaluation grid with one row per criterion and one column per bidder. In each cell, quote or summarise the relevant part of the response and note whether it addresses the criterion. Do not assign a score. Flag any criterion a bidder did not address as a gap.',
        outputFormat: 'A criterion-by-bidder grid with gaps flagged, no scores.',
        qualityChecklist: [
            'No scores assigned',
            'Every cell cites the response',
            'Gaps explicitly flagged',
            'All criteria covered',
        ],
    },
    {
        id: 'cs-complaint-triage',
        title: 'تصنيف شكاوى العملاء وتوجيهها',
        titleLang: 'ar',
        description:
            'قراءة شكوى العميل وتحديد فئتها ودرجة إلحاحها واقتراح الجهة المختصة للمعالجة.',
        author: 'عبدالعزيز المطيري',
        organisation: 'Bank, customer care',
        version: 'v1',
        publishDate: '2025-06-14',
        sectorId: 'banking',
        roleId: 'customer-service',
        language: 'Arabic',
        sensitivity: 'Internal',
        reuseCount: 7,
        timeBeforeMin: 6,
        timeAfterMin: 2,
        rating: ratingFor(4.0, 4),
        whatItDoes:
            'Reads an Arabic complaint, classifies its category and urgency, and suggests the right team to handle it.',
        inputsRequired: ['The complaint text', 'The list of teams and their remits', 'The urgency bands'],
        whatStaysHuman: 'The final routing when a case is ambiguous or sensitive.',
        methodBody:
            'اقرأ الشكوى باللغة العربية. أخرِج فئتها من القائمة المزودة، ودرجة إلحاحها، والجهة التي ينبغي توجيهها إليها. إذا أشارت الشكوى إلى جهة رقابية أو احتيال أو عميل من الفئات الهشّة، ضَع علامة "مراجعة بشرية" بصرف النظر عن الفئة.',
        outputFormat: 'A short structured record: category, urgency, suggested team, review flag.',
        qualityChecklist: [
            'Category drawn from the supplied list',
            'Regulator/fraud/vulnerable cases flagged for review',
            'Urgency band assigned',
            'Suggested team named',
        ],
    },
    {
        id: 'banking-kyc-narrative',
        title: 'KYC narrative summary',
        titleLang: 'en',
        description:
            'Assembles the KYC narrative for a corporate onboarding from the collected documents, listing what is still missing.',
        author: 'Latifah Al-Dosari',
        organisation: 'Bank, financial crime',
        version: 'v1',
        publishDate: '2025-05-30',
        sectorId: 'banking',
        roleId: 'legal',
        language: 'English',
        sensitivity: 'Confidential',
        reuseCount: 6,
        timeBeforeMin: 75,
        timeAfterMin: 28,
        rating: ratingFor(4.2, 4),
        whatItDoes:
            'Writes the KYC narrative for a corporate customer from the collected documents, and produces a checklist of outstanding items.',
        inputsRequired: ['The collected KYC documents', 'The ownership structure', 'The risk-rating criteria'],
        whatStaysHuman:
            'The risk rating and the decision to onboard. The method summarises evidence; it never rates the customer.',
        methodBody:
            'Summarise the KYC file into a narrative: entity, ownership and control, business activity, and source of funds as documented. List every required item that is missing or expired. Do not state a risk rating or an onboarding decision.',
        outputFormat: 'A KYC narrative plus an outstanding-items checklist.',
        qualityChecklist: [
            'No risk rating stated',
            'Ownership and control covered',
            'Missing items listed',
            'Only documented facts used',
        ],
    },
    {
        id: 'admin-meeting-minutes',
        title: 'تدوين محاضر الاجتماعات',
        titleLang: 'ar',
        description:
            'تحويل تسجيل أو نقاط اجتماع إلى محضر منظم بالقرارات والمهام والمسؤول عنها.',
        author: 'منى العنزي',
        organisation: 'University, dean\'s office',
        version: 'v1',
        publishDate: '2025-06-20',
        sectorId: 'education',
        roleId: 'admin',
        language: 'Arabic',
        sensitivity: 'Internal',
        reuseCount: 6,
        timeBeforeMin: 35,
        timeAfterMin: 10,
        rating: ratingFor(4.3, 4),
        whatItDoes:
            'Turns meeting notes or a transcript into structured Arabic minutes: decisions taken, actions, and who owns each.',
        inputsRequired: ['The meeting notes or transcript', 'The attendee list', 'The agenda'],
        whatStaysHuman: 'Confirming decisions were captured correctly before circulation.',
        methodBody:
            'أنتج محضر اجتماع باللغة العربية. اذكر الحضور، ثم لكل بند من جدول الأعمال دوّن المناقشة في سطر أو سطرين، والقرار المتخذ، وأي مهمة مع المسؤول عنها وتاريخ الاستحقاق. لا تنسب أقوالاً لأشخاص بأسمائهم ما لم تفعل الملاحظات ذلك.',
        outputFormat: 'Minutes with a decisions list and an action table (owner, due date).',
        qualityChecklist: [
            'Every action has an owner',
            'Decisions separated from discussion',
            'No invented attributions',
            'Follows the agenda order',
        ],
    },
    {
        id: 'professional-rfp-drafting',
        title: 'RFP requirements drafting',
        titleLang: 'en',
        description:
            'Drafts a structured requirements section for an RFP from a needs statement, keeping each requirement testable.',
        author: 'Omar Al-Shehri',
        organisation: 'Advisory firm, public sector practice',
        version: 'v1',
        publishDate: '2025-04-25',
        sectorId: 'professional',
        roleId: 'procurement',
        language: 'English',
        sensitivity: 'Internal',
        reuseCount: 6,
        timeBeforeMin: 110,
        timeAfterMin: 45,
        rating: ratingFor(4.0, 3),
        whatItDoes:
            'Expands a needs statement into a numbered RFP requirements section where each requirement is singular and testable.',
        inputsRequired: ['The needs statement', 'Any mandatory standards', 'The evaluation approach'],
        whatStaysHuman: 'Deciding which requirements are mandatory versus desirable.',
        methodBody:
            'Draft the requirements section of an RFP from the needs statement. Number each requirement, keep it to a single testable obligation, and mark it mandatory or desirable per the input. Avoid requirements that lock in a single vendor.',
        outputFormat: 'A numbered requirements list marked mandatory/desirable.',
        qualityChecklist: [
            'One obligation per requirement',
            'Each requirement is testable',
            'No single-vendor lock-in',
            'Mandatory/desirable marked',
        ],
    },
    {
        id: 'marketing-campaign-brief',
        title: 'Campaign brief from a goal',
        titleLang: 'en',
        description:
            'Turns a marketing goal into a structured campaign brief — audience, message, channels and success measures.',
        author: 'Dana Al-Faris',
        organisation: 'Retail group, marketing',
        version: 'v1',
        publishDate: '2025-07-01',
        sectorId: 'retail',
        roleId: 'marketing',
        language: 'Bilingual',
        sensitivity: 'Internal',
        reuseCount: 5,
        timeBeforeMin: 45,
        timeAfterMin: 15,
        rating: ratingFor(4.1, 4),
        whatItDoes:
            'Expands a one-line goal into a campaign brief: audience, single-minded message, channels, and how success will be measured.',
        inputsRequired: ['The campaign goal', 'The product or offer', 'The budget band'],
        whatStaysHuman: 'The creative idea and the final channel mix.',
        methodBody:
            'Write a campaign brief from the goal. Include: audience, single-minded proposition, supporting messages, suggested channels for the budget band, and success measures. Keep the proposition to one sentence.',
        outputFormat: 'A one-page brief with a single-sentence proposition.',
        qualityChecklist: [
            'Proposition is one sentence',
            'Success measures are concrete',
            'Channels fit the budget band',
            'Audience is specific',
        ],
    },
    {
        id: 'energy-technical-doc-search',
        title: 'Technical document Q&A',
        titleLang: 'en',
        description:
            'Answers an engineering question strictly from a supplied set of technical documents, with the source cited or the gap admitted.',
        author: 'Nasser Al-Mutairi',
        organisation: 'Refinery, engineering',
        version: 'v1',
        publishDate: '2025-06-08',
        sectorId: 'energy',
        roleId: 'engineering',
        language: 'English',
        sensitivity: 'Internal',
        reuseCount: 5,
        timeBeforeMin: 30,
        timeAfterMin: 6,
        rating: ratingFor(4.4, 3),
        whatItDoes:
            'Answers a specific engineering question using only the technical documents provided, quoting the source or stating that the answer is not in the documents.',
        inputsRequired: ['The question', 'The relevant technical documents', 'The equipment or system in scope'],
        whatStaysHuman: 'Acting on the answer — a document lookup is not an engineering sign-off.',
        methodBody:
            'Answer the question using only the supplied documents. Quote the exact clause or table you relied on. If the documents do not contain the answer, say so plainly rather than inferring. Never rely on general knowledge for a safety-relevant figure.',
        outputFormat: 'A direct answer with the source clause quoted, or an explicit "not in these documents".',
        qualityChecklist: [
            'Answer traces to a quoted source',
            'Gaps admitted, not inferred',
            'No general-knowledge safety figures',
            'Equipment scope respected',
        ],
    },
    {
        id: 'construction-tender-docs',
        title: 'Tender documentation checklist',
        titleLang: 'en',
        description:
            'Assembles the tender submission checklist for a construction package and drafts the covering technical narrative.',
        author: 'Bandar Al-Amri',
        organisation: 'Contractor, bids',
        version: 'v1',
        publishDate: '2025-05-16',
        sectorId: 'construction',
        roleId: 'operations',
        language: 'Bilingual',
        sensitivity: 'Public',
        reuseCount: 4,
        timeBeforeMin: 70,
        timeAfterMin: 30,
        rating: ratingFor(3.9, 3),
        whatItDoes:
            'Builds the document checklist a tender requires and drafts the technical narrative sections from the project scope.',
        inputsRequired: ['The tender instructions', 'The project scope', 'The company\'s standard credentials'],
        whatStaysHuman: 'Pricing, programme commitments and the final compliance sign-off.',
        methodBody:
            'From the tender instructions, list every required submission document with a ready/not-ready marker. Then draft the technical narrative sections — methodology, quality, HSE approach — from the project scope. Leave price and programme dates blank for the estimator.',
        outputFormat: 'A submission checklist plus draft technical-narrative sections.',
        qualityChecklist: [
            'Checklist matches the tender instructions',
            'Price and programme left blank',
            'Narrative maps to the scope',
            'Credentials inserted correctly',
        ],
    },
    {
        id: 'logistics-incident-report',
        title: 'Delivery incident write-up',
        titleLang: 'en',
        description:
            'Turns a driver or dispatcher report into a clean incident record with a customer-facing summary drafted separately.',
        author: 'Hessa Al-Subaie',
        organisation: 'Last-mile logistics',
        version: 'v1',
        publishDate: '2025-07-08',
        sectorId: 'logistics',
        roleId: 'operations',
        language: 'Bilingual',
        sensitivity: 'Internal',
        reuseCount: 4,
        timeBeforeMin: 20,
        timeAfterMin: 7,
        rating: ratingFor(3.8, 3),
        whatItDoes:
            'Produces a structured internal incident record and a separate, neutral customer-facing summary from a raw report.',
        inputsRequired: ['The raw incident report', 'The order and route reference', 'The resolution taken'],
        whatStaysHuman: 'Any goodwill gesture or liability admission to the customer.',
        methodBody:
            'From the raw report, produce two outputs: an internal record (sequence, cause if stated, resolution) and a customer summary that is factual and neutral. The customer summary must not admit liability or offer compensation.',
        outputFormat: 'An internal record and a separate customer-facing summary.',
        qualityChecklist: [
            'Customer summary admits no liability',
            'Internal record has a clear sequence',
            'No compensation offered automatically',
            'Order reference carried through',
        ],
    },
    {
        id: 'teaching-lesson-plan',
        title: 'إعداد خطة الدرس',
        titleLang: 'ar',
        description:
            'بناء خطة درس بالأهداف والأنشطة والتقويم لمادة ومرحلة محددة وفق الإطار المعتمد.',
        author: 'أحمد الحربي',
        organisation: 'Education, secondary school',
        version: 'v1',
        publishDate: '2025-06-25',
        sectorId: 'education',
        roleId: 'teaching',
        language: 'Arabic',
        sensitivity: 'Public',
        reuseCount: 3,
        timeBeforeMin: 50,
        timeAfterMin: 18,
        rating: ratingFor(4.2, 3),
        whatItDoes:
            'Builds an Arabic lesson plan with objectives, activities and assessment for a given subject and stage, following the approved framework.',
        inputsRequired: ['The subject and grade', 'The lesson topic', 'The class duration'],
        whatStaysHuman: 'Adapting the plan to the specific class and its needs.',
        methodBody:
            'اكتب خطة درس باللغة العربية تتضمن: الأهداف التعليمية، تهيئة افتتاحية، نشاطاً رئيسياً، خاتمة، وتقويماً تكوينياً قصيراً. واءم الأهداف مع المرحلة الدراسية المحددة، واجعل الأنشطة قابلة للتنفيذ ضمن زمن الحصة.',
        outputFormat: 'A lesson plan with objectives, timed activities, and an assessment.',
        qualityChecklist: [
            'Objectives match the stage',
            'Activities fit the duration',
            'A formative assessment is included',
            'Framework alignment noted',
        ],
    },
    {
        id: 'retail-product-description',
        title: 'Product description writer',
        titleLang: 'en',
        description:
            'Writes an on-brand product description from a spec sheet, without inventing features the spec does not list.',
        author: 'Reem Al-Juhani',
        organisation: 'E-commerce, catalogue',
        version: 'v1',
        publishDate: '2025-07-14',
        sectorId: 'retail',
        roleId: 'marketing',
        language: 'Bilingual',
        sensitivity: 'Public',
        reuseCount: 2,
        timeBeforeMin: 15,
        timeAfterMin: 4,
        rating: ratingFor(3.9, 2),
        whatItDoes:
            'Produces a short, on-brand product description in Arabic and English from a spec sheet, using only listed features.',
        inputsRequired: ['The product spec sheet', 'The brand tone', 'The target length'],
        whatStaysHuman: 'Fact-checking any claim that could be a regulated statement.',
        methodBody:
            'Write a product description from the spec sheet in the brand tone. Use only features present in the spec. Provide an Arabic and an English version at parity — neither a translation of the other in feel. Avoid superlatives that cannot be substantiated.',
        outputFormat: 'Parallel Arabic and English descriptions at the target length.',
        qualityChecklist: [
            'Only spec features used',
            'No unsubstantiated superlatives',
            'Arabic and English at parity',
            'Within target length',
        ],
    },
    // ---- Never reused (0) — kept honestly in the catalogue ----
    {
        id: 'clinical-discharge-summary',
        title: 'Discharge summary structuring',
        titleLang: 'en',
        description:
            'Restructures clinician notes into the standard discharge-summary sections. Runs inside the hospital tenancy only.',
        author: 'Dr. Maha Al-Rashid',
        organisation: 'Tertiary hospital, internal medicine',
        version: 'v1',
        publishDate: '2025-08-05',
        sectorId: 'healthcare',
        roleId: 'clinical',
        language: 'English',
        sensitivity: 'Confidential',
        reuseCount: 0,
        timeBeforeMin: 30,
        timeAfterMin: 12,
        whatItDoes:
            'Reorganises free-text clinician notes into the standard discharge-summary structure. It never adds clinical content.',
        inputsRequired: ['The clinician notes', 'The admission and discharge dates', 'The standard summary template'],
        whatStaysHuman:
            'All clinical content, diagnoses and medication instructions. The method only reorganises what the clinician wrote.',
        methodBody:
            'Reorganise the clinician notes into the standard discharge-summary sections: reason for admission, course, diagnoses as recorded, medications on discharge, and follow-up. Do not add, infer or correct any clinical fact. If a section has no source content, mark it as blank for the clinician.',
        outputFormat: 'A structured discharge summary, blanks marked, no added clinical content.',
        qualityChecklist: [
            'No clinical content added or inferred',
            'Diagnoses copied as recorded',
            'Empty sections marked blank',
            'Runs inside the hospital tenancy',
        ],
        performance: {
            runs: 1,
            accuracyNote:
                'New — not yet reused. Author reports internal testing on de-identified notes only. Not independently measured.',
        },
    },
    {
        id: 'legal-contract-clauses',
        title: 'مكتبة بنود العقود',
        titleLang: 'ar',
        description:
            'استرجاع صياغة بند تعاقدي قياسي بالعربية حسب نوع العقد والطرف والمخاطر.',
        author: 'سلطان الغامدي',
        organisation: 'Law firm, commercial',
        version: 'v1',
        publishDate: '2025-08-12',
        sectorId: 'professional',
        roleId: 'legal',
        language: 'Arabic',
        sensitivity: 'Confidential',
        reuseCount: 0,
        timeBeforeMin: 40,
        timeAfterMin: 15,
        whatItDoes:
            'Returns a standard Arabic contract clause matched to the contract type, party and risk profile, from the firm\'s own clause bank.',
        inputsRequired: ['The contract type', 'Which party you act for', 'The risk to allocate'],
        whatStaysHuman: 'Legal advice and the negotiation position. The clause is a starting draft only.',
        methodBody:
            'من مكتبة بنود المكتب، أعد البند القياسي المطابق لنوع العقد والطرف والمخاطرة. اعرضه باللغة العربية، ووضّح لأي طرف ينحاز، واذكر المتغيرات الواجب تعبئتها. لا تصُغ بنداً من الصفر غير موجود في المكتبة.',
        outputFormat: 'A standard clause with its variables marked and its bias noted.',
        qualityChecklist: [
            'Clause drawn from the firm bank',
            'Party bias stated',
            'Variables marked',
            'Not drafted from scratch',
        ],
        performance: {
            runs: 1,
            accuracyNote: 'New — not yet reused. Author testing only. Not independently measured.',
        },
    },
    {
        id: 'education-exam-bank',
        title: 'بنك أسئلة الاختبارات',
        titleLang: 'ar',
        description:
            'توليد أسئلة اختبار متدرجة الصعوبة من محتوى الدرس مع مفتاح الإجابة وجدول المواصفات.',
        author: 'ليلى الزهراني',
        organisation: 'Education, curriculum unit',
        version: 'v1',
        publishDate: '2025-08-19',
        sectorId: 'education',
        roleId: 'teaching',
        language: 'Arabic',
        sensitivity: 'Internal',
        reuseCount: 0,
        timeBeforeMin: 60,
        timeAfterMin: 20,
        whatItDoes:
            'Generates a graded set of Arabic exam questions from lesson content, with an answer key and a specification table.',
        inputsRequired: ['The lesson content', 'The number of questions and their split by difficulty', 'The question types allowed'],
        whatStaysHuman: 'Reviewing questions for fairness and curriculum fit before use.',
        methodBody:
            'ولّد أسئلة اختبار باللغة العربية من محتوى الدرس وفق توزيع الصعوبة المطلوب. زوّد بمفتاح إجابة وجدول مواصفات يربط كل سؤال بهدف تعليمي ومستوى صعوبة. استخدم فقط المحتوى الوارد في الدرس.',
        outputFormat: 'A question set, an answer key, and a specification table.',
        qualityChecklist: [
            'Difficulty split respected',
            'Every question maps to an objective',
            'Answer key provided',
            'Only lesson content used',
        ],
        performance: {
            runs: 1,
            accuracyNote: 'New — not yet reused. Author testing only. Not independently measured.',
        },
    },
    {
        id: 'sales-outreach-sequence',
        title: 'B2B outreach sequence',
        titleLang: 'en',
        description:
            'Drafts a short, non-pushy outreach sequence for a named prospect segment from the value proposition.',
        author: 'Ziad Al-Harthy',
        organisation: 'Technology vendor, sales',
        version: 'v1',
        publishDate: '2025-08-26',
        sectorId: 'telecom',
        roleId: 'sales',
        language: 'English',
        sensitivity: 'Internal',
        reuseCount: 0,
        timeBeforeMin: 35,
        timeAfterMin: 12,
        whatItDoes:
            'Writes a three-touch B2B outreach sequence for a defined segment, grounded in the value proposition, without false urgency.',
        inputsRequired: ['The prospect segment', 'The value proposition', 'The one relevant proof point'],
        whatStaysHuman: 'Choosing who to contact and honouring their preferences.',
        methodBody:
            'Write a three-message outreach sequence for the segment. Each message is short, references the segment\'s likely priority, and uses the single proof point. No false urgency, no fabricated personalisation, and a clear opt-out in the final message.',
        outputFormat: 'Three short messages with a clear opt-out.',
        qualityChecklist: [
            'No false urgency',
            'No fabricated personalisation',
            'Opt-out included',
            'Grounded in the proof point',
        ],
        performance: {
            runs: 1,
            accuracyNote: 'New — not yet reused. Author testing only. Not independently measured.',
        },
    },
];

export const METHODS: IMethod[] = SEEDS.map(completeMethod);

const METHOD_BY_ID = new Map(METHODS.map((method) => [method.id, method]));

export function getMethod(id: string): IMethod | undefined {
    return METHOD_BY_ID.get(id);
}
