import type { IRoleFamily } from '@/data/types';

/** Fifteen role families with their AI-addressable share (spec §4.2). */
export const ROLE_FAMILIES: IRoleFamily[] = [
    {
        id: 'marketing',
        name: 'Marketing & Communications',
        nameAr: 'التسويق والاتصال المؤسسي',
        aiAddressable: 85,
        arabicIntensity: 'High',
    },
    {
        id: 'data',
        name: 'Data & Analytics',
        nameAr: 'البيانات والتحليلات',
        aiAddressable: 80,
        arabicIntensity: 'Low',
    },
    {
        id: 'software',
        name: 'Software Engineering',
        nameAr: 'هندسة البرمجيات والحلول',
        aiAddressable: 75,
        arabicIntensity: 'Low',
    },
    {
        id: 'customer-service',
        name: 'Customer Service',
        nameAr: 'خدمة العملاء ورعاية المستفيدين',
        aiAddressable: 70,
        arabicIntensity: 'Very high',
    },
    {
        id: 'sales',
        name: 'Sales & Business Development',
        nameAr: 'المبيعات وتطوير الأعمال',
        aiAddressable: 65,
        arabicIntensity: 'Medium',
    },
    {
        id: 'admin',
        name: 'Admin & Support',
        nameAr: 'الإدارة والمساندة المؤسسية',
        aiAddressable: 65,
        arabicIntensity: 'High',
    },
    {
        id: 'hr',
        name: 'HR & People',
        nameAr: 'الموارد البشرية ورأس المال البشري',
        aiAddressable: 60,
        arabicIntensity: 'High',
    },
    {
        id: 'executive',
        name: 'Executive & Strategy',
        nameAr: 'الإدارة التنفيذية والاستراتيجية',
        aiAddressable: 60,
        arabicIntensity: 'Medium',
    },
    {
        id: 'finance',
        name: 'Finance & Accounting',
        nameAr: 'المالية والمحاسبة والميزانية',
        aiAddressable: 55,
        arabicIntensity: 'Medium',
    },
    {
        id: 'teaching',
        name: 'Teaching & Academic',
        nameAr: 'التعليم والتدريب الأكاديمي',
        aiAddressable: 55,
        arabicIntensity: 'High',
    },
    {
        id: 'legal',
        name: 'Legal & Compliance',
        nameAr: 'الشؤون القانونية والالتزام',
        aiAddressable: 50,
        arabicIntensity: 'High',
    },
    {
        id: 'procurement',
        name: 'Procurement & Supply Chain',
        nameAr: 'المشتريات وسلاسل الإمداد',
        aiAddressable: 50,
        arabicIntensity: 'Medium',
    },
    {
        id: 'engineering',
        name: 'Engineering (non-software)',
        nameAr: 'الهندسة والعمليات الفنية',
        aiAddressable: 40,
        arabicIntensity: 'Low',
    },
    {
        id: 'clinical',
        name: 'Healthcare Clinical',
        nameAr: 'الممارسة الإكلينيكية والصحية',
        aiAddressable: 30,
        arabicIntensity: 'High',
    },
    {
        id: 'operations',
        name: 'Operations & Field',
        nameAr: 'العمليات والتشغيل الميداني',
        aiAddressable: 25,
        arabicIntensity: 'Medium',
    },
];

const ROLE_BY_ID = new Map(ROLE_FAMILIES.map((role) => [role.id, role]));

export function getRole(id: string): IRoleFamily | undefined {
    return ROLE_BY_ID.get(id);
}
