import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { METHODS, getMethod } from '@/data/methods';
import { getMethodBySlug } from '@/data/repository';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { MethodDetailView } from '@/components/method/method-detail-view';

// Allow database-published methods (not in the static seed) to render on demand.
export const dynamicParams = true;

export function generateStaticParams(): { id: string }[] {
    return METHODS.map((method) => ({ id: method.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const method = getMethod(id);
    if (!method) {
        return { title: 'Method not found · Al-Maktaba' };
    }
    return { title: `${method.title} · Al-Maktaba`, description: method.description };
}

export default async function MethodDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
    const { id } = await params;
    const method = getMethod(id) ?? (await getMethodBySlug(id));
    if (!method) {
        notFound();
    }

    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);

    return <MethodDetailView method={method} sector={sector} role={role} />;
}
