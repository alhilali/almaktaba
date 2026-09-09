import type { IMethod, IMethodInput, MethodInputType } from '@/data/types';

/** A value supplied for one input at run time (kept entirely client-side). */
export interface IInputValue {
    text?: string;
    filename?: string;
}

/** Turn a human label into a stable snake_case token for {{name}} references. */
export function tokenize(label: string): string {
    const token = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 40);
    return token || 'input';
}

/** Heuristic input type from a free-text "inputs required" line. */
function guessType(label: string): MethodInputType {
    const s = label.toLowerCase();
    if (/(photo|image|scan|picture|screenshot)/.test(s)) {
        return 'image';
    }
    if (/(pdf)/.test(s)) {
        return 'pdf';
    }
    if (
        /(document|file|spreadsheet|excel|csv|notes|transcript|table|report|statement|bundle|records|memo|letter|\bcv\b|resume|contract|log|dataset|attachment|datasheet|ledger|payslip)/.test(
            s,
        )
    ) {
        return 'file';
    }
    return 'text';
}

/** Build structured inputs from a method's free-text inputsRequired list. */
export function deriveInputs(inputsRequired: string[]): IMethodInput[] {
    const seen = new Set<string>();
    return inputsRequired.map((label, index) => {
        let token = tokenize(label);
        if (seen.has(token)) {
            token = `${token}_${index + 1}`;
        }
        seen.add(token);
        return {
            id: `in-${index}`,
            name: token,
            label,
            type: guessType(label),
            description: '',
            required: true,
        };
    });
}

/** The method's structured inputs, deriving them from the legacy list if needed. */
export function getMethodInputs(method: IMethod): IMethodInput[] {
    if (method.inputs && method.inputs.length > 0) {
        return method.inputs;
    }
    return deriveInputs(method.inputsRequired);
}

function renderValue(input: IMethodInput, value: IInputValue | undefined): string {
    if (value?.text && value.text.trim().length > 0) {
        return value.text.trim();
    }
    if (value?.filename) {
        if (input.type === 'image') {
            return `[attached image: ${value.filename} — attach this file in your AI tool]`;
        }
        if (input.type === 'pdf') {
            return `[attached PDF: ${value.filename} — attach this file in your AI tool]`;
        }
        return `[attached file: ${value.filename}]`;
    }
    return input.required
        ? `[${input.label} — REQUIRED, not provided]`
        : `[${input.label} — not provided]`;
}

/**
 * Assemble a ready-to-paste prompt: substitute {{token}} references inline where
 * the author placed them, append any remaining inputs under an INPUTS heading,
 * and add the expected output format. The result is what a runner copies into
 * their own AI tool.
 */
export function assemblePrompt(method: IMethod, values: Record<string, IInputValue>): string {
    const inputs = getMethodInputs(method);
    const original = method.methodBody;
    let body = original;
    const appended: string[] = [];

    for (const input of inputs) {
        const token = `{{${input.name}}}`;
        const rendered = renderValue(input, values[input.name]);
        if (original.includes(token)) {
            body = body.split(token).join(rendered);
        } else {
            appended.push(`${input.label}:\n${rendered}`);
        }
    }

    let out = body.trim();
    if (appended.length > 0) {
        out += `\n\n--- INPUTS ---\n${appended.join('\n\n')}`;
    }
    if (method.outputFormat && method.outputFormat.trim().length > 0) {
        out += `\n\n--- EXPECTED OUTPUT FORMAT ---\n${method.outputFormat.trim()}`;
    }
    return out.trim();
}

/** Does the method's prompt reference {{tokens}} explicitly? */
export function promptHasTokens(method: IMethod): boolean {
    return /\{\{\s*[a-z0-9_]+\s*\}\}/i.test(method.methodBody);
}
