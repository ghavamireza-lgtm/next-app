import Link from 'next/link';
import pool from '@/lib/db';
import type { Business, Category } from '@/types';

async function getData(category?: string) {
  'use cache'
  let query = `
    SELECT b.*, c.name as category_name, c.slug as category_slug
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.is_active = true
  `;
  const params: any[] = [];
  if (category) {
    params.push(category);
    query += ` AND c.slug = $${params.length}`;
  }
  query += ' ORDER BY b.floor, b.name';

  const [bizRes, catRes] = await Promise.all([
    pool.query(query, params),
    pool.query('SELECT id, name, slug FROM categories ORDER BY id'),
  ]);

  return {
    businesses: bizRes.rows as Business[],
    categories: catRes.rows as Category[],
  };
}

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { businesses, categories } = await getData(category);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">کسبه</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/businesses"
          className={`px-3 py-1 rounded-full border text-sm ${
            !category ? 'bg-black text-white' : 'bg-white'
          }`}
        >
          همه
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/businesses?category=${cat.slug}`}
            className={`px-3 py-1 rounded-full border text-sm ${
              category === cat.slug ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

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
          </Link>
        ))}
      </div>
    </main>
  );
}