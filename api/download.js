import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const userAgent = req.headers["user-agent"] || "";
  const accept = req.headers["accept"] || "";

  const looksLikeBrowser =
    accept.includes("text/html") ||
    userAgent.includes("Mozilla") ||
    userAgent.includes("Chrome") ||
    userAgent.includes("Safari") ||
    userAgent.includes("Firefox");

  if (looksLikeBrowser) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nothing here</title>
          <style>
            body {
              font-family: sans-serif;
              background: #111;
              color: #fff;
              display: flex;
              height: 100vh;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            h1 { font-size: 48px; }
          </style>
        </head>
        <body>
          <div>
            <h1>404?</h1>
            <p>Nothing to see here.</p>
          </div>
        </body>
      </html>
    `);
  }

  const filePath = path.join(process.cwd(), "public", "libVVIPCODM56.so");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: false,
      reason: "File not found"
    });
  }

  const stat = fs.statSync(filePath);
  const file = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", "attachment; filename=libVVIPCODM56.so");
  res.setHeader("Content-Length", stat.size);

  // Penting supaya downloader tidak menganggap last_modified = 0
  res.setHeader("Last-Modified", stat.mtime.toUTCString());

  // Hindari cache aneh-aneh
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  return res.status(200).send(file);
}
