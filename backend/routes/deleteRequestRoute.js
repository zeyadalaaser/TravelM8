import express from 'express';
import { createDeletionRequest, getAllDeletionRequests,deleteDeletionRequest } from '../controllers/deleteRequestController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/deleteRequests', createDeletionRequest);
router.get('/Allrequests', getAllDeletionRequests);
router.delete('/delete-request', deleteDeletionRequest);

export default router;
