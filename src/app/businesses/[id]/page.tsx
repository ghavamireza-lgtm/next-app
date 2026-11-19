import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import type { Business } from '@/types';

async function getBusiness(id: string): Promise<Business | null> {
  const result = await pool.query(
    `SELECT b.*, c.name as category_name, c.slug as category_slug
     FROM businesses b
     LEFT JOIN categories c ON b.category_id = c.id
     WHERE b.id = $1 AND b.is_active = true`,
    [id]
  );
  return result.rows[0] ?? null;
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const biz = await getBusiness(id);
  if (!biz) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{biz.name}</h1>
      <p className="text-gray-500 mb-6">
        طبقه {biz.floor ?? '—'} — {biz.category_name ?? 'بدون دسته'}
      </p>

      {biz.description && (
        <p className="mb-4 leading-relaxed">{biz.description}</p>
      )}

      <div className="space-y-2 text-sm">
        {biz.phone && <p>📞 {biz.phone}</p>}
        {biz.instagram && (
          <p>
            📷{' '}
            <a
              href={`https://instagram.com/${biz.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {biz.instagram}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}