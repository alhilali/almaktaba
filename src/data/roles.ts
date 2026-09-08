import type { IRoleFamily } from '@/data/types';

/** Fifteen role families with their AI-addressable share (spec §4.2). */
export const ROLE_FAMILIES: IRoleFamily[] = [
    { id: 'marketing', name: 'Marketing & Communications', aiAddressable: 85, arabicIntensity: 'High' },
    { id: 'data', name: 'Data & Analytics', aiAddressable: 80, arabicIntensity: 'Low' },
    { id: 'software', name: 'Software Engineering', aiAddressable: 75, arabicIntensity: 'Low' },
    { id: 'customer-service', name: 'Customer Service', aiAddressable: 70, arabicIntensity: 'Very high' },
    { id: 'sales', name: 'Sales & Business Development', aiAddressable: 65, arabicIntensity: 'Medium' },
    { id: 'admin', name: 'Admin & Support', aiAddressable: 65, arabicIntensity: 'High' },
    { id: 'hr', name: 'HR & People', aiAddressable: 60, arabicIntensity: 'High' },
    { id: 'executive', name: 'Executive & Strategy', aiAddressable: 60, arabicIntensity: 'Medium' },
    { id: 'finance', name: 'Finance & Accounting', aiAddressable: 55, arabicIntensity: 'Medium' },
    { id: 'teaching', name: 'Teaching & Academic', aiAddressable: 55, arabicIntensity: 'High' },
    { id: 'legal', name: 'Legal & Compliance', aiAddressable: 50, arabicIntensity: 'High' },
    { id: 'procurement', name: 'Procurement & Supply Chain', aiAddressable: 50, arabicIntensity: 'Medium' },
    { id: 'engineering', name: 'Engineering (non-software)', aiAddressable: 40, arabicIntensity: 'Low' },
    { id: 'clinical', name: 'Healthcare Clinical', aiAddressable: 30, arabicIntensity: 'High' },
    { id: 'operations', name: 'Operations & Field', aiAddressable: 25, arabicIntensity: 'Medium' },
];

const ROLE_BY_ID = new Map(ROLE_FAMILIES.map((role) => [role.id, role]));

export function getRole(id: string): IRoleFamily | undefined {
    return ROLE_BY_ID.get(id);
}
