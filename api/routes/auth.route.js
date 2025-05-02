import express from 'express'
import { signin, signup, signout, google } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/google', google)
router.post('/sign-out', signout)

export default router;