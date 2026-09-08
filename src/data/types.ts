/**
 * Domain types for the Al-Maktaba catalogue.
 * All content is sample data — see the disclosure rules in the build spec (§2).
 */

export type Language = 'Arabic' | 'English' | 'Bilingual';

export type Sensitivity = 'Public' | 'Internal' | 'Confidential';

export type DataSensitivity = 'Low' | 'Medium' | 'High' | 'Very high';

export type ArabicIntensity = 'Low' | 'Medium' | 'High' | 'Very high';

export type Maturity = 'New' | 'Proven' | 'Established';

/** A CSS custom-property name for a sector's muted shelf marker. */
export type SectorColorVar = `var(--color-sector-${string})`;

export interface ISector {
    id: string;
    name: string;
    nameAr: string;
    dataSensitivity: DataSensitivity;
    /** Shelf-marker hue — used only as a 3px left edge and index dot. */
    color: SectorColorVar;
}

export interface IRoleFamily {
    id: string;
    name: string;
    nameAr: string;
    /** Share of this role's work that AI can realistically address. */
    aiAddressable: number;
    arabicIntensity: ArabicIntensity;
}

export interface IProvenance {
    builtOn: string;
    alsoReported: string[];
}

export interface IPerformance {
    /** Number of recorded runs contributing to the figures below. */
    runs: number;
    accuracyNote: string;
}

export interface IReuseTrail {
    people: number;
    organisations: number;
    sectorBreakdown: { sectorId: string; count: number }[];
}

export interface IRating {
    score: number;
    count: number;
    /** Distribution across 5..1 stars, highest first. */
    distribution: [number, number, number, number, number];
}

export interface IMethodVersion {
    version: string;
    date: string;
    note: string;
    author: string;
    isCurrent: boolean;
}

export interface ISampleExample {
    title: string;
    titleAr?: string;
    format: string;
    filename?: string;
    content: string;
}

export interface ISharedAgent {
    id: string;
    name: string;
    nameAr: string;
    role: string;
    roleAr: string;
    badge: string;
    badgeAr: string;
    description: string;
    descriptionAr: string;
    tools: string[];
    toolsAr?: string[];
    color: string;
}

export interface IPipelineCombination {
    methodId: string;
    relationship: 'precedes' | 'follows' | 'complements';
    role: string;
    roleAr: string;
}

export interface ICliExecution {
    command: string;
    inputFlag: string;
    notes?: string;
    notesAr?: string;
}

export interface IUploadGuide {
    label: string;
    labelAr: string;
    allowedFormats: string[];
    exampleFilename: string;
}

export interface IMethod {
    id: string;
    title: string;
    titleAr?: string;
    /** Language of the title/description strings, for dir + font parity. */
    titleLang: 'ar' | 'en';
    description: string;
    descriptionAr?: string;
    author: string;
    organisation: string;
    version: string;
    publishDate: string;
    sectorId: string;
    roleId: string;
    language: Language;
    sensitivity: Sensitivity;
    reuseCount: number;
    /** Typical minutes before and after the method. */
    timeBeforeMin: number;
    timeAfterMin: number;
    rating: IRating;
    whatItDoes: string;
    inputsRequired: string[];
    whatStaysHuman: string;
    /** The method body itself — prompt or instructions. */
    methodBody: string;
    outputFormat: string;
    qualityChecklist: string[];
    provenance: IProvenance;
    performance: IPerformance;
    reuseTrail: IReuseTrail;
    versionHistory: IMethodVersion[];
    /** Concrete input & output examples for execution reference. */
    sampleInput?: ISampleExample;
    sampleOutput?: ISampleExample;
    /** Suggested shared agents addressing cross-cutting concerns. */
    suggestedAgents?: string[];
    /** Complementary workflows that form multi-step agentic pipelines. */
    pipelineCombinations?: IPipelineCombination[];
    /** CLI execution snippet (e.g. agy run). */
    cliExecution?: ICliExecution;
    /** File upload guidelines for running the method. */
    uploadGuide?: IUploadGuide;
}

export interface IMethodRequest {
    id: string;
    task: string;
    taskAr?: string;
    roleId: string;
    sectorId: string;
    language: Language;
    votes: number;
    status: 'Open' | 'Claimed';
    claimedByOrg?: string;
}
