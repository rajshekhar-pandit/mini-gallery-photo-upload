const express = require("express");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const images = new Map();

// multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG and PNG allowed"));
  },
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const id = crypto.randomUUID();
  images.set(id, {
    id,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    data: req.file.buffer,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
  });

  res.status(201).json({
    id,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
  });
});

app.get("/images", (req, res) => {
  const arr = Array.from(images.values()).map((i) => ({
    id: i.id,
    filename: i.filename,
    mimeType: i.mimeType,
    size: i.size,
    uploadedAt: i.uploadedAt,
  }));
  res.json(arr);
});

app.get("/images/:id", (req, res) => {
  const img = images.get(req.params.id);
  if (!img) return res.status(404).json({ error: "Not found" });
  res.set("Content-Type", img.mimeType);
  res.send(img.data);
});

app.delete("/images/:id", (req, res) => {
  if (!images.has(req.params.id)) return res.status(404).json({ error: "Not found" });
  images.delete(req.params.id);
  res.json({ message: "Deleted", id: req.params.id });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
