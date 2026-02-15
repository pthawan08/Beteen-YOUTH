const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: 'No image provided' });

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const filename = `cvc-valentine-${Date.now()}.png`;
        const blob = await put(filename, buffer, {
            access: 'public',
            contentType: 'image/png'
        });

        return res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
