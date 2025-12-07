import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get user purchases
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ purchases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
});

// Record a purchase
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { courseId, txHash, amount } = req.body;

        if (!courseId || !txHash || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if purchase already exists
        const existing = await prisma.purchase.findFirst({
            where: { userId: req.userId!, courseId }
        });

        if (existing) {
            return res.status(400).json({ error: 'Course already purchased' });
        }

        const purchase = await prisma.purchase.create({
            data: {
                userId: req.userId!,
                courseId,
                txHash,
                amount
            }
        });

        res.json({ purchase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to record purchase' });
    }
});

export default router;
