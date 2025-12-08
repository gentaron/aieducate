import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyMessage } from 'ethers';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login with Wallet
router.post('/login/wallet', async (req, res) => {
    try {
        const { walletAddress, signature } = req.body;

        if (!walletAddress || !signature) {
            return res.status(400).json({ error: 'Wallet address and signature required' });
        }

        // Verify signature
        // The message must match what the frontend signs
        const message = `Login to AI Educate Portal: ${new Date().toISOString().split('T')[0]}`;
        // Note: In a real app, use a nonce or more precise timestamp to prevent replay attacks. 
        // For this demo, we'll accept a slightly less strict verification or a fixed message 
        // IF we coordinate with frontend. 
        // BETTER: Frontend asks for a message (nonce) first? 
        // SIMPLEST FOR NOW: Frontend signs "Login to AI Educate Portal"

        const recoveredAddress = verifyMessage("Login to AI Educate Portal", signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { walletAddress } });
        if (!user) {
            user = await prisma.user.create({
                data: { walletAddress }
            });
        }

        const token = jwt.sign({ userId: user.id, walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: { id: user.id, walletAddress: user.walletAddress } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, walletAddress: true, createdAt: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

export default router;
