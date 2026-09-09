import type { IMethod, IMethodInput, MethodInputType } from '@/data/types';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Read layer for database-backed methods. Reads are additive to the static
 * seed catalogue: when Supabase is configured, methods published through the
 * app resolve here. Demo mode (no env) returns null and the static data is used.
 */

interface IMethodRow {
    slug: string;
    title: string;
    title_ar: string | null;
    title_lang: string | null;
    description: string | null;
    author_name: string | null;
    organisation: string | null;
    version: string | null;
    sector_id: string | null;
    role_id: string | null;
    language: string | null;
    sensitivity: string | null;
    method_body: string;
    output_format: string | null;
    built_on: string | null;
    time_before_min: number | null;
    time_after_min: number | null;
    reuse_count: number | null;
    created_at: string;
}

interface IInputRow {
    name: string;
    label: string;
    label_ar: string | null;
    type: string;
    description: string | null;
    description_ar: string | null;
    required: boolean;
    position: number;
}

function mapInput(row: IInputRow, index: number): IMethodInput {
    return {
        id: `db-in-${index}`,
        name: row.name,
        label: row.label,
        labelAr: row.label_ar ?? undefined,
        type: (row.type as MethodInputType) ?? 'text',
        description: row.description ?? '',
        descriptionAr: row.description_ar ?? undefined,
        required: row.required,
    };
}

function toMethod(row: IMethodRow, inputRows: IInputRow[], agentIds: string[]): IMethod {
    const inputs = inputRows
        .sort((a, b) => a.position - b.position)
        .map((row, index) => mapInput(row, index));
    return {
        id: row.slug,
        title: row.title,
        titleAr: row.title_ar ?? undefined,
        titleLang: (row.title_lang as 'ar' | 'en') ?? 'en',
        description: row.description ?? '',
        author: row.author_name ?? 'Anonymous',
        organisation: row.organisation ?? '',
        version: row.version ?? 'v1',
        publishDate: row.created_at.slice(0, 10),
        sectorId: row.sector_id ?? '',
        roleId: row.role_id ?? '',
        language: (row.language as IMethod['language']) ?? 'English',
        sensitivity: (row.sensitivity as IMethod['sensitivity']) ?? 'Internal',
        reuseCount: row.reuse_count ?? 0,
        timeBeforeMin: row.time_before_min ?? 0,
        timeAfterMin: row.time_after_min ?? 0,
        rating: { score: 0, count: 0, distribution: [0, 0, 0, 0, 0] },
        whatItDoes: row.description ?? '',
        inputsRequired: inputs.map((input) => input.label),
        inputs,
        whatStaysHuman: '',
        methodBody: row.method_body,
        outputFormat: row.output_format ?? '',
        qualityChecklist: [],
        provenance: { builtOn: row.built_on ?? 'Not specified', alsoReported: [] },
        performance: {
            runs: row.reuse_count ?? 0,
            accuracyNote: 'Community-published method. Not independently measured.',
        },
        reuseTrail: { people: row.reuse_count ?? 0, organisations: 0, sectorBreakdown: [] },
        versionHistory: [
            {
                version: row.version ?? 'v1',
                date: row.created_at.slice(0, 10),
                note: 'Published.',
                author: row.author_name ?? 'Anonymous',
                isCurrent: true,
            },
        ],
        suggestedAgents: agentIds,
    };
}

/** Fetch a database-backed method by its slug, or null in demo mode / if absent. */
export async function getMethodBySlug(slug: string): Promise<IMethod | null> {
    if (!isSupabaseConfigured()) {
        return null;
    }
    try {
        const supabase = await createClient();
        const { data: row } = await supabase
            .from('methods')
            .select(
                'id,slug,title,title_ar,title_lang,description,author_name,organisation,version,sector_id,role_id,language,sensitivity,method_body,output_format,built_on,time_before_min,time_after_min,reuse_count,created_at',
            )
            .eq('slug', slug)
            .maybeSingle();

        if (!row) {
            return null;
        }

        const methodId = (row as { id: string }).id;

        const { data: inputRows } = await supabase
            .from('method_inputs')
            .select('name,label,label_ar,type,description,description_ar,required,position')
            .eq('method_id', methodId)
            .order('position');

        const { data: agentRows } = await supabase
            .from('method_agents')
            .select('agent_id')
            .eq('method_id', methodId);

        const agentIds = (agentRows ?? []).map((r: { agent_id: string }) => r.agent_id);
        return toMethod(row as unknown as IMethodRow, (inputRows ?? []) as IInputRow[], agentIds);
    } catch {
        return null;
    }
}
