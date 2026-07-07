const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    // Jalur menuju file .so
    const filePath = path.join(process.cwd(), 'libVVIPCODM56.so');

    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File tidak ditemukan di server Vercel' });
    }

    // Ambil ukuran file
    const stat = fs.statSync(filePath);

    // Set Header agar APK tahu ini adalah file binary/stream silen
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', 'attachment; filename=libVVIPCODM56.so');

    // Stream file langsung ke APK
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}
