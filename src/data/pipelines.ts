/**
 * End-to-end agentic pipelines: named examples of how several library methods
 * chain into one continuous workflow, with shared agents running as quality
 * gates across every step. These show that methods are composable, not silos.
 * All figures are illustrative.
 */
export interface IPipelineStep {
    methodId: string;
    note: string;
    noteAr: string;
}

export interface IEndToEndPipeline {
    id: string;
    title: string;
    titleAr: string;
    summary: string;
    summaryAr: string;
    sectorId: string;
    steps: IPipelineStep[];
    /** Shared agents that gate every step of the chain. */
    agentIds: string[];
    outcome: string;
    outcomeAr: string;
}

export const END_TO_END_PIPELINES: IEndToEndPipeline[] = [
    {
        id: 'gov-correspondence-chain',
        title: 'From committee meeting to signed letter',
        titleAr: 'من اجتماع اللجنة إلى خطاب معتمد',
        summary:
            'A government office turns a committee meeting into an official letter — capturing decisions, drafting the supporting policy, then composing the formal correspondence.',
        summaryAr:
            'جهة حكومية تحوّل اجتماع لجنة إلى خطاب رسمي: توثيق القرارات، ثم إعداد السياسة المساندة، ثم صياغة المراسلة الرسمية.',
        sectorId: 'government',
        steps: [
            {
                methodId: 'admin-meeting-minutes',
                note: 'Capture decisions and action items from the committee meeting.',
                noteAr: 'توثيق القرارات والمهام من اجتماع اللجنة.',
            },
            {
                methodId: 'legal-policy-drafting',
                note: 'Draft the internal policy the decision requires.',
                noteAr: 'صياغة السياسة الداخلية التي يتطلبها القرار.',
            },
            {
                methodId: 'gov-arabic-correspondence',
                note: 'Compose the formal letter conveying the decision.',
                noteAr: 'صياغة الخطاب الرسمي الذي ينقل القرار.',
            },
        ],
        agentIds: ['privacy-sentinel', 'arabic-stylist', 'quality-auditor'],
        outcome: '≈ 2 days of drafting → under 2 hours',
        outcomeAr: '≈ يومان من الصياغة ← أقل من ساعتين',
    },
    {
        id: 'banking-credit-chain',
        title: 'From onboarding to a credit memo',
        titleAr: 'من فتح الحساب إلى مذكرة ائتمانية',
        summary:
            'A corporate bank moves a new borrower from KYC clearance to a drafted credit memo, reconciling the financial variances along the way.',
        summaryAr:
            'بنك يتحرك بالعميل الجديد من مطابقة اعرف عميلك إلى مسودة مذكرة ائتمانية، مع مطابقة الانحرافات المالية.',
        sectorId: 'banking',
        steps: [
            {
                methodId: 'banking-kyc-narrative',
                note: 'Assemble the KYC narrative and flag missing items.',
                noteAr: 'إعداد سردية اعرف عميلك وإبراز النواقص.',
            },
            {
                methodId: 'finance-variance-commentary',
                note: 'Explain the borrower’s financial movements.',
                noteAr: 'تفسير حركة القوائم المالية للعميل.',
            },
            {
                methodId: 'banking-credit-memo',
                note: 'Draft the narrative sections of the credit memo.',
                noteAr: 'صياغة الأقسام السردية لمذكرة الائتمان.',
            },
        ],
        agentIds: ['privacy-sentinel', 'compliance-guard', 'quality-auditor', 'evidence-anchor'],
        outcome: '≈ 4 hours → ≈ 70 minutes',
        outcomeAr: '≈ 4 ساعات ← ≈ 70 دقيقة',
    },
    {
        id: 'procurement-chain',
        title: 'From policy to evaluated bids',
        titleAr: 'من السياسة إلى تقييم العروض',
        summary:
            'A procurement team drafts the governing policy, turns a need into testable requirements, then evaluates bidder responses against them.',
        summaryAr:
            'فريق مشتريات يصيغ السياسة الحاكمة، ثم يحوّل الاحتياج إلى متطلبات قابلة للقياس، ثم يقيّم ردود المتنافسين وفقها.',
        sectorId: 'energy',
        steps: [
            {
                methodId: 'legal-policy-drafting',
                note: 'Draft the procurement policy that governs the tender.',
                noteAr: 'صياغة سياسة المشتريات الحاكمة للمنافسة.',
            },
            {
                methodId: 'professional-rfp-drafting',
                note: 'Turn the need into numbered, testable requirements.',
                noteAr: 'تحويل الاحتياج إلى متطلبات مرقّمة وقابلة للقياس.',
            },
            {
                methodId: 'procurement-rfp-eval',
                note: 'Map each bid to the criteria and flag gaps.',
                noteAr: 'مطابقة كل عرض بالمعايير وإبراز الفجوات.',
            },
        ],
        agentIds: ['compliance-guard', 'quality-auditor', 'evidence-anchor'],
        outcome: '≈ 6 hours → ≈ 2.5 hours',
        outcomeAr: '≈ 6 ساعات ← ≈ 2.5 ساعة',
    },
];

export function getPipeline(id: string): IEndToEndPipeline | undefined {
    return END_TO_END_PIPELINES.find((pipeline) => pipeline.id === id);
}
