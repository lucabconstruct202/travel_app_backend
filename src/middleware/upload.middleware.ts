import multer from 'multer'

export const upload = multer({
  storage: multer.memoryStorage(), // Datei bleibt im RAM
  limits: { fileSize: 30 * 1024 * 1024 } // max 10MB
})
