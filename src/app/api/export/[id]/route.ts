import { getMethod } from '@/data/methods';
import { methodToMarkdown } from '@/lib/export-markdown';

/** GET /api/export/[id] — downloads a method as a self-contained markdown file. */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
    const { id } = await params;
    const method = getMethod(id);

    if (!method) {
        return new Response('Method not found', { status: 404 });
    }

    return new Response(methodToMarkdown(method), {
        status: 200,
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': `attachment; filename="al-maktaba-${method.id}.md"`,
        },
    });
}
