import type { ISector } from '@/data/types';

/** The ten sectors, taken verbatim from the team's scoring model (spec §4.1). */
export const SECTORS: ISector[] = [
    {
        id: 'telecom',
        name: 'Telecom & Technology',
        nameAr: 'الاتصالات والتقنية',
        dataSensitivity: 'Medium',
        color: 'var(--color-sector-telecom)',
    },
    {
        id: 'professional',
        name: 'Professional Services',
        nameAr: 'الخدمات المهنية والاستشارية',
        dataSensitivity: 'High',
        color: 'var(--color-sector-professional)',
    },
    {
        id: 'banking',
        name: 'Banking & Finance',
        nameAr: 'البنوك والقطاع المالي',
        dataSensitivity: 'Very high',
        color: 'var(--color-sector-banking)',
    },
    {
        id: 'energy',
        name: 'Energy & Petrochemicals',
        nameAr: 'الطاقة والبتروكيماويات',
        dataSensitivity: 'High',
        color: 'var(--color-sector-energy)',
    },
    {
        id: 'retail',
        name: 'Retail & E-commerce',
        nameAr: 'التجزئة والتجارة الإلكترونية',
        dataSensitivity: 'Medium',
        color: 'var(--color-sector-retail)',
    },
    {
        id: 'logistics',
        name: 'Logistics & Transport',
        nameAr: 'النقل والخدمات اللوجستية',
        dataSensitivity: 'Medium',
        color: 'var(--color-sector-logistics)',
    },
    {
        id: 'government',
        name: 'Government & Public Sector',
        nameAr: 'القطاع الحكومي والعام',
        dataSensitivity: 'Very high',
        color: 'var(--color-sector-government)',
    },
    {
        id: 'education',
        name: 'Education',
        nameAr: 'التعليم والتدريب',
        dataSensitivity: 'High',
        color: 'var(--color-sector-education)',
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        nameAr: 'الرعاية الصحية',
        dataSensitivity: 'Very high',
        color: 'var(--color-sector-healthcare)',
    },
    {
        id: 'construction',
        name: 'Construction & Real Estate',
        nameAr: 'التشييد والبناء والعقارات',
        dataSensitivity: 'Low',
        color: 'var(--color-sector-construction)',
    },
];

const SECTOR_BY_ID = new Map(SECTORS.map((sector) => [sector.id, sector]));

export function getSector(id: string): ISector | undefined {
    return SECTOR_BY_ID.get(id);
}
