import express from 'express';
import multer from 'multer';
import path from 'path'; // Importing the path module
import { generateVideo } from '../controller/songs.js'; // Importing the controller function

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store the uploaded file in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename using timestamp
  },
});

const upload = multer({ storage: storage });

// POST route to handle video generation
router.post('/generate-video', upload.single('songFile'), generateVideo);

export default router;
