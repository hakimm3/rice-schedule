import { Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all users sorted by last buy date (queue list)
export const getUserQueue = async (req: AuthRequest, res: Response) => {
  try {
    const users = db.prepare(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.last_buy_date,
        u.created_at,
        CASE 
          WHEN u.last_buy_date IS NULL THEN 999999
          ELSE CAST((julianday('now') - julianday(u.last_buy_date)) AS INTEGER)
        END as days_since_last_buy,
        COUNT(t.id) as total_transactions
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id
      ORDER BY 
        CASE 
          WHEN u.last_buy_date IS NULL THEN 1
          ELSE 0
        END,
        u.last_buy_date ASC NULLS FIRST
    `).all();

    res.json({ 
      queue: users,
      total: users.length 
    });
  } catch (error) {
    console.error('Get user queue error:', error);
    res.status(500).json({ error: 'Failed to get user queue' });
  }
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(kg) as total_kg,
        SUM(price) as total_spent,
        AVG(price) as avg_price,
        MIN(date) as first_purchase,
        MAX(date) as last_purchase
      FROM transactions
      WHERE user_id = ?
    `).get(userId);

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};
