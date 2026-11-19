import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const floor = searchParams.get('floor');

    let query = `
      SELECT b.*, c.name as category_name, c.slug as category_slug
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = true
    `;
    const params: any[] = [];

    if (categorySlug) {
      params.push(categorySlug);
      query += ` AND c.slug = $${params.length}`;
    }
    if (floor) {
      params.push(Number(floor));
      query += ` AND b.floor = $${params.length}`;
    }

    query += ' ORDER BY b.floor, b.name';

    const result = await pool.query(query, params);
    return NextResponse.json({ businesses: result.rows });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'خطا در دریافت کسبه' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, floor, phone, instagram, category_id } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'نام کسبه الزامی است' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO businesses (name, description, floor, phone, instagram, category_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description || null, floor || null, phone || null, instagram || null, category_id || null]
    );

    return NextResponse.json({ business: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'خطا در ایجاد کسبه' }, { status: 500 });
  }
}