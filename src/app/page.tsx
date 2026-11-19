import Link from 'next/link';
import pool from '@/lib/db';
import type { Business } from '@/types';

async function getBusinesses(): Promise<Business[]> {
  const result = await pool.query(`
    SELECT b.*, c.name as category_name, c.slug as category_slug
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.is_active = true
    ORDER BY b.floor, b.name
  `);
  return result.rows;
}

export default async function Home() {
  const businesses = await getBusinesses();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">راهنمای کسبه مرکز تجاری</h1>
      <p className="text-gray-500 mb-6">{businesses.length} کسبه ثبت شده</p>

      {businesses.length === 0 ? (
        <p className="text-gray-500">هنوز کسبه‌ای ثبت نشده است.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz) => (
            <Link
              key={biz.id}
              href={`/businesses/${biz.id}`}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{biz.name}</h2>
              <p className="text-sm text-gray-500">
                طبقه {biz.floor ?? '—'} — {biz.category_name ?? 'بدون دسته'}
              </p>
              {biz.description && (
                <p className="text-sm mt-2 line-clamp-2">{biz.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}