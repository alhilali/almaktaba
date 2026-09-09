/**
 * One-off direct-connection seed (used when the Management API token lacks
 * privileges to fetch the service_role key). Connects to Postgres with the DB
 * password and upserts the typed catalogue. Run:
 *   PGHOST=db.<ref>.supabase.co PGPW='<db-password>' npx tsx scripts/seed-direct.ts
 */
import { Client } from 'pg';

import { SECTORS } from '@/data/sectors';
import { ROLE_FAMILIES } from '@/data/roles';
import { SHARED_AGENTS } from '@/data/agents';
import { MODELS } from '@/data/models';
import { METHODS } from '@/data/methods';
import { getMethodInputs } from '@/lib/prompt';

const client = new Client({
    host: process.env.PGHOST,
    port: 5432,
    user: 'postgres',
    password: process.env.PGPW,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
});

async function main(): Promise<void> {
    await client.connect();
    console.log('Connected. Seeding reference tables…');

    for (const s of SECTORS) {
        await client.query(
            `insert into sectors (id,name,name_ar,data_sensitivity,color) values ($1,$2,$3,$4,$5)
             on conflict (id) do update set name=$2,name_ar=$3,data_sensitivity=$4,color=$5`,
            [s.id, s.name, s.nameAr, s.dataSensitivity, s.color],
        );
    }
    for (const r of ROLE_FAMILIES) {
        await client.query(
            `insert into role_families (id,name,name_ar,ai_addressable,arabic_intensity) values ($1,$2,$3,$4,$5)
             on conflict (id) do update set name=$2,name_ar=$3,ai_addressable=$4,arabic_intensity=$5`,
            [r.id, r.name, r.nameAr, r.aiAddressable, r.arabicIntensity],
        );
    }
    for (const a of SHARED_AGENTS) {
        await client.query(
            `insert into shared_agents (id,name,name_ar,role,role_ar,badge,badge_ar,description,description_ar,tools,tools_ar,color)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             on conflict (id) do update set name=$2,name_ar=$3,role=$4,role_ar=$5,badge=$6,badge_ar=$7,description=$8,description_ar=$9,tools=$10,tools_ar=$11,color=$12`,
            [a.id, a.name, a.nameAr, a.role, a.roleAr, a.badge, a.badgeAr, a.description, a.descriptionAr, a.tools, a.toolsAr ?? [], a.color],
        );
    }
    for (const m of MODELS) {
        await client.query(
            `insert into models (id,label,label_ar,slug,vendor,note,note_ar,is_local) values ($1,$2,$3,$4,$5,$6,$7,$8)
             on conflict (id) do update set label=$2,label_ar=$3,slug=$4,vendor=$5,note=$6,note_ar=$7,is_local=$8`,
            [m.id, m.label, m.labelAr, m.slug, m.vendor, m.note ?? null, m.noteAr ?? null, Boolean(m.isLocal)],
        );
    }

    console.log(`Seeding ${METHODS.length} methods…`);
    for (const method of METHODS) {
        const res = await client.query(
            `insert into methods (slug,title,title_ar,title_lang,description,author_name,organisation,version,sector_id,role_id,language,sensitivity,method_body,output_format,built_on,time_before_min,time_after_min,reuse_count,is_published,created_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,true,$19)
             on conflict (slug) do update set title=$2,description=$5,method_body=$13,output_format=$14,built_on=$15,reuse_count=$18,updated_at=now()
             returning id`,
            [
                method.id, method.title, method.titleAr ?? null, method.titleLang, method.description,
                method.author, method.organisation, method.version, method.sectorId, method.roleId,
                method.language, method.sensitivity, method.methodBody, method.outputFormat,
                method.provenance.builtOn, method.timeBeforeMin, method.timeAfterMin, method.reuseCount,
                new Date(method.publishDate).toISOString(),
            ],
        );
        const methodId = res.rows[0].id as string;

        await client.query('delete from method_inputs where method_id=$1', [methodId]);
        await client.query('delete from method_agents where method_id=$1', [methodId]);
        await client.query('delete from method_versions where method_id=$1', [methodId]);

        const inputs = getMethodInputs(method);
        for (let i = 0; i < inputs.length; i += 1) {
            const inp = inputs[i];
            await client.query(
                `insert into method_inputs (method_id,name,label,label_ar,type,description,required,position)
                 values ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [methodId, inp.name, inp.label, inp.labelAr ?? null, inp.type, inp.description, inp.required, i],
            );
        }
        for (const agentId of method.suggestedAgents ?? []) {
            await client.query(
                'insert into method_agents (method_id,agent_id) values ($1,$2) on conflict do nothing',
                [methodId, agentId],
            );
        }
        for (const v of method.versionHistory) {
            await client.query(
                'insert into method_versions (method_id,version,note,author_name,is_current) values ($1,$2,$3,$4,$5)',
                [methodId, v.version, v.note, v.author, v.isCurrent],
            );
        }
    }

    console.log('Done.');
    await client.end();
}

main().catch(async (err) => {
    console.error(err);
    await client.end().catch(() => undefined);
    process.exit(1);
});
