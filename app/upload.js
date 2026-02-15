module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: 'No image provided' });

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `cvc-valentine-${Date.now()}.jpg`;

        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) throw new Error("ไม่พบ Token ของ Vercel Blob ในระบบ");

        // ยิงข้อมูลเข้า Vercel Storage แบบตรงๆ
        const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${token}`,
                'x-api-version': '7',
                'content-type': 'image/jpeg',
            },
            body: buffer
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }

        const blob = await response.json();
        
        return res.status(200).json({ url: blob.url });
        
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: error.message });
    }
};
