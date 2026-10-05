import multer from "multer";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  filename: function (_req, file, callback) {
    const ext = path.extname(file.originalname);
    callback(null, `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Only JPEG, PNG, WebP, and GIF images are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 6,
  },
});

export default upload;
