import type { ISharedAgent, IMethod } from '@/data/types';

/**
 * Shared Agents addressing cross-cutting concerns across Saudi enterprise
 * and government AI workflows.
 *
 * Instead of overloading individual prompts with verification, compliance,
 * style enforcement, and PII masking, these specialized subagents run as
 * quality gates in multi-agent pipelines.
 */
export const SHARED_AGENTS: ISharedAgent[] = [
    {
        id: 'quality-auditor',
        name: 'Quality & Fact Auditor',
        nameAr: 'مدقق الجودة والتحقق من الحقائق',
        role: 'Fact verification & hallucination prevention',
        roleAr: 'مطابقة الحقائق والتحقق من صحة المخرجات',
        badge: 'Quality Check',
        badgeAr: 'فحص الجودة',
        description:
            'Cross-examines model outputs against uploaded source materials to ensure complete factual fidelity, instruction compliance, and zero fabricated claims.',
        descriptionAr:
            'يطابق مسودات المخرجات مع الوثائق المصدرية المدخلة، ويتحقق من دقة الأرقام والبيانات المستخلصة، مانعاً الهلوسة أو اختلاق حقائق غير موجودة.',
        tools: ['source_diff', 'assertion_verifier', 'reconcile_numbers'],
        toolsAr: ['مطابقة المصدر', 'فاحص الادعاءات', 'مطابقة الأرقام'],
        color: '#0F5450',
    },
    {
        id: 'arabic-stylist',
        name: 'Arabic Stylistic & Register Reviewer',
        nameAr: 'مراجع الصياغة والتدقيق اللغوي الحكومي',
        role: 'Official Arabic register & vocabulary audit',
        roleAr: 'تدقيق الأسلوب اللغوي والصياغة الرسمية',
        badge: 'Arabic Style',
        badgeAr: 'التدقيق اللغوي',
        description:
            'Polishes Arabic terminology, grammatical agreement, honorific salutations, and tone to match official Saudi government correspondence and corporate manuals.',
        descriptionAr:
            'يراجع التراكيب اللغوية والتشكيل وضبط الألقاب والترويسات الرسمية وفق دليل التراسل الحكومي المعتمد بالمملكة وأعراف المخاطبات التنفيذية.',
        tools: ['grammar_lexicon', 'honorifics_matcher', 'styleguide_linter'],
        toolsAr: ['معجم النحو العربي', 'مطابقة الألقاب الرسمية', 'فاحص أسلوب الصياغة'],
        color: '#8A6516',
    },
    {
        id: 'privacy-sentinel',
        name: 'Data Privacy & Redaction Sentinel',
        nameAr: 'حارس خصوصية البيانات وسرية المعلومات',
        role: 'Saudi PII masking & NDMO compliance',
        roleAr: 'حجب البيانات الشخصية والتصنيف الأمني',
        badge: 'Privacy & Security',
        badgeAr: 'حماية الخصوصية',
        description:
            'Detects and masks Saudi National IDs (الهوية الوطنية), phone numbers, IBANs, and classified commercial identifiers before inference or external dispatch.',
        descriptionAr:
            'يرصد ويحجب أرقام الهوية الوطنية والإقامة، والحسابات البنكية (IBAN)، وأرقام الهواتف، والبيانات المصنفة وفق ضوابط مكتب إدارة البيانات الوطنية (NDMO).',
        tools: ['saudi_pii_scanner', 'iban_scrubber', 'classification_marker'],
        toolsAr: ['فاحص الهويات الوطنية', 'منقح الآيبان', 'محدد التصنيف الأمني'],
        color: '#264653',
    },
    {
        id: 'compliance-guard',
        name: 'Regulatory & Governance Guardrail',
        nameAr: 'فاحص الالتزام التنظيمي والسياسات',
        role: 'Sector policy & regulatory guardrail verification',
        roleAr: 'التحقق من اللوائح والسياسات القطاعية',
        badge: 'Compliance',
        badgeAr: 'الالتزام الرقابي',
        description:
            'Evaluates outputs against statutory regulations and regulatory mandates (SDAIA, SAMA, NDMO, ZATCA, CMA) to flag governance or legal exposure.',
        descriptionAr:
            'يقارن المخرجات باللوائح المنظمة والسياسات المعتمدة من الجهات الإشرافية (سدايا، البنك المركزي، الزكاة والضريبة، هيئة السوق المالية) لمنع المخالفات.',
        tools: ['regulatory_matrix', 'policy_rulebook', 'audit_logger'],
        toolsAr: ['مصفوفة التنظيمات', 'قواعد السياسات', 'سجل التدقيق الرقابي'],
        color: '#2A9D8F',
    },
    {
        id: 'evidence-anchor',
        name: 'Evidence & Citation Anchor',
        nameAr: 'موثق المصادر والاستشهادات',
        role: 'Citation linking & traceable evidence footnotes',
        roleAr: 'ربط الاستنتاجات بالوثائق المرجعية',
        badge: 'Traceability',
        badgeAr: 'التوثيق المرجعي',
        description:
            'Injects traceable citation footnotes, paragraph anchors, and source timestamps so every analytical claim can be audited back to specific source uploads.',
        descriptionAr:
            'يولد حواشي مرجعية وروابط مباشرة بين كل رقم أو خلاصة واردة في التقرير والفقرة المصدرية الدقيقة في الوثائق المرفوعة لسهولة المراجعة والتدقيق.',
        tools: ['document_indexer', 'anchor_linker', 'footnote_builder'],
        toolsAr: ['مفهرس المستندات', 'رابط الفقرات', 'منشئ الحواشي المرجعية'],
        color: '#4A5568',
    },
];

export function getSharedAgent(id: string): ISharedAgent | undefined {
    return SHARED_AGENTS.find((agent) => agent.id === id);
}

/**
 * Returns suggested shared agents for a method. If the method explicitly
 * lists suggestedAgents, returns those; otherwise assigns default contextual
 * agents based on language, sector, and sensitivity.
 */
export function getAgentsForMethod(method: IMethod): ISharedAgent[] {
    if (method.suggestedAgents && method.suggestedAgents.length > 0) {
        const found = method.suggestedAgents
            .map((id) => getSharedAgent(id))
            .filter((agent): agent is ISharedAgent => Boolean(agent));
        if (found.length > 0) return found;
    }

    const agents: ISharedAgent[] = [];

    // Always include quality auditor
    const quality = getSharedAgent('quality-auditor');
    if (quality) agents.push(quality);

    // If Arabic or Bilingual, suggest Arabic Stylist
    if (method.language === 'Arabic' || method.language === 'Bilingual') {
        const stylist = getSharedAgent('arabic-stylist');
        if (stylist) agents.push(stylist);
    }

    // If Internal or Confidential, or banking/gov, suggest Privacy Sentinel
    if (
        method.sensitivity === 'Confidential' ||
        method.sectorId === 'government' ||
        method.sectorId === 'banking' ||
        method.sectorId === 'healthcare'
    ) {
        const privacy = getSharedAgent('privacy-sentinel');
        if (privacy) agents.push(privacy);
    }

    // If banking or healthcare or energy, suggest Compliance Guard
    if (
        method.sectorId === 'banking' ||
        method.sectorId === 'healthcare' ||
        method.sectorId === 'energy'
    ) {
        const compliance = getSharedAgent('compliance-guard');
        if (compliance) agents.push(compliance);
    }

    return agents;
}
