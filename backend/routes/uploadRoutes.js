import express from 'express';
import multer from 'multer';
import { uploadFile2,uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/upload-files', upload.fields([
    { name: 'image', maxCount: 1 },  
    { name: 'idfile', maxCount: 1 },  
    { name: 'taxfile', maxCount: 1 }   
]), uploadFile);

router.post('/upload-files2', upload.fields([
  { name: 'image', maxCount: 1 },  
  { name: 'idfile', maxCount: 1 },  
  { name: 'certificatesfile', maxCount: 1 }   
]), uploadFile2);


export default router;
