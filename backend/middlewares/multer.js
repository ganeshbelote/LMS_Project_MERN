import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    // Generate a unique suffix using the current timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Extract the file extension from the original file name
    const ext = path.extname(file.originalname);
    // Create the new filename
    cb(null, uniqueSuffix + ext);
  }
});

export const upload = multer({ storage });
