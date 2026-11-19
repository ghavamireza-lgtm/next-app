import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
    try {
        const result = await pool.query('SELECT NOW()');
        return NextResponse.json({
            success: true,
            message: " Next.js connected to PostgreSQL successfully!",
            time: result.rows[0].now
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });   
    }
}