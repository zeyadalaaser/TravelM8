import express from 'express';
import {
    AddtoBookmarks, 
    getAllTourBookmarks,
    removeBookmark,
} from '../controllers/bookmarkController.js'
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();
router.post('/bookmarks', verifyToken, AddtoBookmarks);  // Changed from /add-bookmark/:touristId
router.get('/bookmarks', verifyToken, getAllTourBookmarks); // Changed from /get-allBookmarks
router.delete('/bookmarks/:id', verifyToken, removeBookmark); // Changed to include bookmark ID


export default router;
