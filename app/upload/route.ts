import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // 1. อัปโหลดรูปไปที่ Vercel Blob
    const blob = await put(`cvc-valentine-${Date.now()}.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    // 2. บันทึกข้อมูลลง Postgres (ต้องสร้าง Table ก่อน)
    await sql`INSERT INTO photo_logs (url, created_at) VALUES (${blob.url}, NOW());`;

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
