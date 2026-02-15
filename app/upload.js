import { put } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: 'No image provided' });

        // แปลง Base64 เป็นไฟล์รูปภาพ
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const filename = `cvc-valentine-${Date.now()}.png`;
        const blob = await put(filename, buffer, {
            access: 'public',
            contentType: 'image/png'
        });

        // ส่ง URL ของรูปที่อัปโหลดเสร็จแล้วกลับไป
        return res.status(200).json({ url: blob.url });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
