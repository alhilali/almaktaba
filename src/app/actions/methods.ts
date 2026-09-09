'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { MODELS } from '@/data/models';
import { tokenize } from '@/lib/prompt';
import type { MethodInputType, Sensitivity, Language } from '@/data/types';

export interface IPublishInput {
    name: string;
    label: string;
    type: MethodInputType;
    description: string;
    required: boolean;
}

export interface IPublishPayload {
    title: string;
    titleLang: 'ar' | 'en';
    description: string;
    roleId: string;
    sectorId: string;
    language: Language;
    methodBody: string;
    outputFormat: string;
    inputs: IPublishInput[];
    agentIds: string[];
    modelId: string;
    sensitivity: Sensitivity;
}

export interface IPublishResult {
    ok: boolean;
    demo?: boolean;
    needsAuth?: boolean;
    slug?: string;
    error?: string;
}

/** Persist a published method (and its inputs, agents, first version) to Supabase. */
export async function publishMethod(payload: IPublishPayload): Promise<IPublishResult> {
    if (!isSupabaseConfigured()) {
        return { ok: false, demo: true };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ok: false, needsAuth: true };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, organisation')
        .eq('id', user.id)
        .maybeSingle();

    const authorName = profile?.display_name || user.email || 'Anonymous';
    const builtOn = MODELS.find((m) => m.id === payload.modelId)?.label ?? payload.modelId;
    const slug = `${tokenize(payload.title) || 'method'}-${Date.now().toString(36)}`;

    const { data: method, error } = await supabase
        .from('methods')
        .insert({
            slug,
            title: payload.title,
            title_lang: payload.titleLang,
            description: payload.description,
            author_id: user.id,
            author_name: authorName,
            organisation: profile?.organisation ?? null,
            version: 'v1',
            sector_id: payload.sectorId,
            role_id: payload.roleId,
            language: payload.language,
            sensitivity: payload.sensitivity,
            method_body: payload.methodBody,
            output_format: payload.outputFormat,
            built_on: builtOn,
            is_published: true,
        })
        .select('id, slug')
        .single();

    if (error || !method) {
        return { ok: false, error: error?.message ?? 'Insert failed' };
    }

    if (payload.inputs.length > 0) {
        await supabase.from('method_inputs').insert(
            payload.inputs.map((input, index) => ({
                method_id: method.id,
                name: input.name || tokenize(input.label),
                label: input.label,
                type: input.type,
                description: input.description,
                required: input.required,
                position: index,
            })),
        );
    }

    if (payload.agentIds.length > 0) {
        await supabase
            .from('method_agents')
            .insert(payload.agentIds.map((agentId) => ({ method_id: method.id, agent_id: agentId })));
    }

    await supabase.from('method_versions').insert({
        method_id: method.id,
        version: 'v1',
        note: 'First published.',
        author_name: authorName,
        is_current: true,
    });

    revalidatePath('/library');
    return { ok: true, slug: method.slug };
}

/** Record a run (reuse) for the signed-in user. Safe no-op in demo mode. */
export async function recordRun(methodSlug: string, modelSlug: string): Promise<{ ok: boolean }> {
    if (!isSupabaseConfigured()) {
        return { ok: false };
    }
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { ok: false };
    }
    const { data: method } = await supabase.from('methods').select('id').eq('slug', methodSlug).maybeSingle();
    if (!method) {
        return { ok: false };
    }
    await supabase.from('method_runs').insert({ method_id: method.id, user_id: user.id, model_slug: modelSlug });
    return { ok: true };
}
