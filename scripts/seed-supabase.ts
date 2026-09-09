/**
 * Seed Supabase from the app's typed catalogue (single source of truth).
 * Run once the database exists:  npm run seed
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env.
 */
import { createClient } from '@supabase/supabase-js';

import { SECTORS } from '@/data/sectors';
import { ROLE_FAMILIES } from '@/data/roles';
import { SHARED_AGENTS } from '@/data/agents';
import { MODELS } from '@/data/models';
import { METHODS } from '@/data/methods';
import { getMethodInputs } from '@/lib/prompt';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main(): Promise<void> {
    console.log('Seeding reference tables…');

    await supabase.from('sectors').upsert(
        SECTORS.map((s) => ({
            id: s.id,
            name: s.name,
            name_ar: s.nameAr,
            data_sensitivity: s.dataSensitivity,
            color: s.color,
        })),
    );

    await supabase.from('role_families').upsert(
        ROLE_FAMILIES.map((r) => ({
            id: r.id,
            name: r.name,
            name_ar: r.nameAr,
            ai_addressable: r.aiAddressable,
            arabic_intensity: r.arabicIntensity,
        })),
    );

    await supabase.from('shared_agents').upsert(
        SHARED_AGENTS.map((a) => ({
            id: a.id,
            name: a.name,
            name_ar: a.nameAr,
            role: a.role,
            role_ar: a.roleAr,
            badge: a.badge,
            badge_ar: a.badgeAr,
            description: a.description,
            description_ar: a.descriptionAr,
            tools: a.tools,
            tools_ar: a.toolsAr ?? [],
            color: a.color,
        })),
    );

    await supabase.from('models').upsert(
        MODELS.map((m) => ({
            id: m.id,
            label: m.label,
            label_ar: m.labelAr,
            slug: m.slug,
            vendor: m.vendor,
            note: m.note,
            note_ar: m.noteAr,
            is_local: Boolean(m.isLocal),
        })),
    );

    console.log(`Seeding ${METHODS.length} methods…`);
    for (const method of METHODS) {
        const { data: row, error } = await supabase
            .from('methods')
            .upsert(
                {
                    slug: method.id,
                    title: method.title,
                    title_ar: method.titleAr ?? null,
                    title_lang: method.titleLang,
                    description: method.description,
                    author_name: method.author,
                    organisation: method.organisation,
                    version: method.version,
                    sector_id: method.sectorId,
                    role_id: method.roleId,
                    language: method.language,
                    sensitivity: method.sensitivity,
                    method_body: method.methodBody,
                    output_format: method.outputFormat,
                    built_on: method.provenance.builtOn,
                    time_before_min: method.timeBeforeMin,
                    time_after_min: method.timeAfterMin,
                    reuse_count: method.reuseCount,
                    is_published: true,
                    created_at: new Date(method.publishDate).toISOString(),
                },
                { onConflict: 'slug' },
            )
            .select('id')
            .single();

        if (error || !row) {
            console.error(`  ✗ ${method.id}: ${error?.message}`);
            continue;
        }
        const methodId = row.id as string;

        // Replace children idempotently.
        await supabase.from('method_inputs').delete().eq('method_id', methodId);
        await supabase.from('method_agents').delete().eq('method_id', methodId);
        await supabase.from('method_versions').delete().eq('method_id', methodId);

        const inputs = getMethodInputs(method);
        if (inputs.length > 0) {
            await supabase.from('method_inputs').insert(
                inputs.map((input, index) => ({
                    method_id: methodId,
                    name: input.name,
                    label: input.label,
                    label_ar: input.labelAr ?? null,
                    type: input.type,
                    description: input.description,
                    required: input.required,
                    position: index,
                })),
            );
        }

        if (method.suggestedAgents && method.suggestedAgents.length > 0) {
            await supabase
                .from('method_agents')
                .insert(method.suggestedAgents.map((agentId) => ({ method_id: methodId, agent_id: agentId })));
        }

        await supabase.from('method_versions').insert(
            method.versionHistory.map((v) => ({
                method_id: methodId,
                version: v.version,
                note: v.note,
                author_name: v.author,
                is_current: v.isCurrent,
            })),
        );

        console.log(`  ✓ ${method.id}`);
    }

    console.log('Done.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
