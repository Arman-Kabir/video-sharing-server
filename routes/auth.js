import express from 'express';
import { googleAuth, signin, signup } from '../controllers/auth.js';
const router = express.Router();

// Create a User
router.post("/signup",signup)

// Sign IN
router.post("/signin",signin)
// router.post("/signin",)

// Google Authentication
router.post("/google",googleAuth)


export default router;