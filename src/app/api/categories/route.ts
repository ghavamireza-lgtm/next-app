import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name, slug FROM categories ORDER BY id'
    );
    return NextResponse.json({ categories: result.rows });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'خطا در دریافت دسته‌بندی‌ها' }, { status: 500 });
  }
}