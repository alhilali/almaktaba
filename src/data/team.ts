export interface TeamMember {
    id: string;
    nameEn: string;
    nameAr: string;
    roleEn: string;
    roleAr: string;
    initials: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
    {
        id: 'abdullah-alqunabit',
        nameEn: 'Abdullah Alqunabit',
        nameAr: 'عبدالله القنيبط',
        roleEn: 'Executive Leadership Fellow',
        roleAr: 'زميل البرنامج القيادي',
        initials: 'AA',
    },
    {
        id: 'ibrahim-alsowayigh',
        nameEn: 'Ibrahim Alsowayigh',
        nameAr: 'إبراهيم الصويغ',
        roleEn: 'Executive Leadership Fellow',
        roleAr: 'زميل البرنامج القيادي',
        initials: 'IA',
    },
    {
        id: 'saud-alhelali',
        nameEn: 'Saud Alhelali',
        nameAr: 'سعود الهلالي',
        roleEn: 'Executive Leadership Fellow',
        roleAr: 'زميل البرنامج القيادي',
        initials: 'SH',
    },
    {
        id: 'hassan-alawad',
        nameEn: 'Hassan Alawad',
        nameAr: 'حسن العواد',
        roleEn: 'Executive Leadership Fellow',
        roleAr: 'زميل البرنامج القيادي',
        initials: 'HA',
    },
    {
        id: 'manaf-alanazi',
        nameEn: 'Manaf Alanazi',
        nameAr: 'مناف العنزي',
        roleEn: 'Executive Leadership Fellow',
        roleAr: 'زميل البرنامج القيادي',
        initials: 'MA',
    },
    {
        id: 'akram-ragaban',
        nameEn: 'Akram Ragaban',
        nameAr: 'أكرم رجبان',
        roleEn: 'Executive Leadership Fellow',
        roleAr: 'زميل البرنامج القيادي',
        initials: 'AR',
    },
];

export interface PartnerOrg {
    key: string;
    acronym: string;
    nameAr: string;
    nameEn: string;
    descAr: string;
    descEn: string;
    badgeAr: string;
    badgeEn: string;
    url: string;
}

export const PROGRAM_PARTNERS: PartnerOrg[] = [
    {
        key: 'sda',
        acronym: 'SDA',
        nameAr: 'الأكاديمية السعودية الرقمية',
        nameEn: 'Saudi Digital Academy',
        descAr:
            'إحدى مبادرات وزارة الاتصالات وتقنية المعلومات، الرامية إلى بناء كوادر وطنية متقدمة وصناعة قيادات رقمية متميزة تقود التحول الرقمي لتحقيق مستهدفات رؤية 2030.',
        descEn:
            'A flagship initiative of the Ministry of Communications and Information Technology (MCIT), empowering high-calibre national tech talent and executive digital leaders.',
        badgeAr: 'المملكة العربية السعودية',
        badgeEn: 'Kingdom of Saudi Arabia',
        url: 'https://sda.edu.sa',
    },
    {
        key: 'nus',
        acronym: 'NUS',
        nameAr: 'جامعة سنغافورة الوطنية',
        nameEn: 'National University of Singapore',
        descAr:
            'صرح أكاديمي رائد عالمياً في التعليم التنفيذي والابتكار التكنولوجي والحوكمة الرقمية، مصنف ضمن نخبة الجامعات على مستوى العالم في إعداد القيادات.',
        descEn:
            'A world-renowned academic and executive institution leading in technological innovation, digital governance, and transformative leadership development.',
        badgeAr: 'جمهورية سنغافورة',
        badgeEn: 'Republic of Singapore',
        url: 'https://nus.edu.sg',
    },
];
