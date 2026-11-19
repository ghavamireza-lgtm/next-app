import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      `SELECT b.*, c.name as category_name, c.slug as category_slug
       FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'کسبه یافت نشد' }, { status: 404 });
    }
    return NextResponse.json({ business: result.rows[0] });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'خطا در دریافت کسبه' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allowed = ['name', 'description', 'floor', 'phone', 'instagram', 'category_id', 'is_active'];
    const fields: string[] = [];
    const values: any[] = [];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        values.push(body[key]);
        fields.push(`${key} = $${values.length}`);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'هیچ فیلدی برای به‌روزرسانی ارسال نشده' }, { status: 400 });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE businesses SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'کسبه یافت نشد' }, { status: 404 });
    }
    return NextResponse.json({ business: result.rows[0] });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      'DELETE FROM businesses WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'کسبه یافت نشد' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'خطا در حذف' }, { status: 500 });
  }
}