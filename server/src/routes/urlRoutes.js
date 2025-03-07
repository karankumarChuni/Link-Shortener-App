import express from 'express';
import { createShortUrl, getUrlStats, redirectToUrl } from '../controllers/urlController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/shorten', auth, createShortUrl);
router.get('/stats', auth, getUrlStats);
router.get('/:shortUrl', redirectToUrl);

export default router;