// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Allow CORS only when needed (optional)
app.use(cors());

// --- Your API routes here ---
// example:
app.get("/api/hello", (req, res) => res.json({ ok: true, msg: "hello from backend" }));

// Serve frontend build when available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(staticPath));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
