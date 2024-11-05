import express from 'express';
import multer from 'multer';
import imageDetailsModel from '../models/imageDetailsModel.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post('/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const imageName = req.file.filename;
    try {
      const { username, type } = req.body;
        const imagePath = req.file.path;  // Path of the uploaded image

        // Create a new image record with the username, type, and image path
        const imageDetails = new imageDetailsModel({
            image: imagePath,
            username: username,  // Store the username
            type: type,          // Store the type
        });
        await imageDetails.save();
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
