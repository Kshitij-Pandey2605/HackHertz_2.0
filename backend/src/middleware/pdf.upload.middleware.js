const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads/pdfs directory exists
const PDF_UPLOAD_DIR = process.env.PDF_UPLOAD_DIR
  ? path.resolve(process.env.PDF_UPLOAD_DIR)
  : path.resolve(__dirname, '../../uploads/pdfs');

if (!fs.existsSync(PDF_UPLOAD_DIR)) {
  fs.mkdirSync(PDF_UPLOAD_DIR, { recursive: true });
}

/**
 * Disk storage — saves PDFs to uploads/pdfs/ with sanitized unique filename.
 * We need disk storage (not memory) so pdf-parse can read from the file path.
 */
const pdfStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PDF_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

/**
 * Accept only PDF files.
 */
const pdfFileFilter = (_req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdfMime && isPdfExt) {
    cb(null, true);
  } else {
    const err = new Error('Invalid file type. Only PDF files (.pdf) are accepted.');
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

const PDF_MAX_SIZE_MB = parseInt(process.env.PDF_MAX_SIZE_MB, 10) || 20;

const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: PDF_MAX_SIZE_MB * 1024 * 1024,
    files: 1,
  },
});

/** Single PDF upload (field name: "file") */
const uploadPdfSingle = pdfUpload.single('file');

module.exports = { uploadPdfSingle, PDF_UPLOAD_DIR };
