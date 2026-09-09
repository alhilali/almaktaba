import type { IMethod } from '@/data/types';

/**
 * Invokable models for the Al-Maktaba CLI. The runner is model-agnostic: a
 * method is published once and can be executed against any of these. On-prem
 * is the route for Confidential data that must not leave the tenancy.
 */
export interface IModelOption {
    id: string;
    label: string;
    labelAr: string;
    /** Vendor-prefixed slug passed to `maktaba run --model`. */
    slug: string;
    vendor: string;
    note?: string;
    noteAr?: string;
    /** Runs inside the organisation's own infrastructure. */
    isLocal?: boolean;
}

export const MODELS: IModelOption[] = [
    {
        id: 'claude-sonnet-4-5',
        label: 'Claude Sonnet 4.5',
        labelAr: 'Claude Sonnet 4.5',
        slug: 'anthropic/claude-sonnet-4.5',
        vendor: 'Anthropic',
    },
    {
        id: 'gpt-5',
        label: 'GPT-5',
        labelAr: 'GPT-5',
        slug: 'openai/gpt-5',
        vendor: 'OpenAI',
    },
    {
        id: 'gemini-2-5-pro',
        label: 'Gemini 2.5 Pro',
        labelAr: 'Gemini 2.5 Pro',
        slug: 'google/gemini-2.5-pro',
        vendor: 'Google',
    },
    {
        id: 'allam',
        label: 'ALLaM (Arabic-first)',
        labelAr: 'علّام (عربي أولاً)',
        slug: 'sdaia/allam',
        vendor: 'SDAIA',
        note: 'National Arabic model',
        noteAr: 'النموذج الوطني العربي',
    },
    {
        id: 'on-prem',
        label: 'On-prem / self-hosted',
        labelAr: 'استضافة داخلية معتمدة',
        slug: 'local/on-prem',
        vendor: 'Your tenancy',
        note: 'Keeps confidential data in-house',
        noteAr: 'تبقي البيانات السرية داخل المنظمة',
        isLocal: true,
    },
];

export function getModel(id: string): IModelOption | undefined {
    return MODELS.find((model) => model.id === id);
}

/**
 * The default model to preselect for a method. Confidential methods default to
 * on-prem; otherwise match the model the method was built on, falling back to
 * the first option.
 */
export function defaultModelFor(method: IMethod): IModelOption {
    if (method.sensitivity === 'Confidential') {
        return getModel('on-prem') ?? MODELS[0];
    }
    const builtOn = method.provenance.builtOn.toLowerCase();
    const match = MODELS.find(
        (model) => builtOn.includes(model.label.toLowerCase()) || model.label.toLowerCase().includes(builtOn),
    );
    return match ?? MODELS[0];
}
