import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all users sorted by last buy date (queue list)
export const getUserQueue = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.last_buy_date,
        u.created_at,
        CASE 
          WHEN u.last_buy_date IS NULL THEN 999999
          ELSE EXTRACT(DAY FROM (CURRENT_TIMESTAMP - u.last_buy_date))
        END as days_since_last_buy,
        COUNT(t.id) as total_transactions
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id, u.name, u.email, u.last_buy_date, u.created_at
      ORDER BY 
        CASE 
          WHEN u.last_buy_date IS NULL THEN 1
          ELSE 0
        END,
        u.last_buy_date ASC NULLS FIRST
    `);

    res.json({ 
      queue: result.rows,
      total: result.rows.length 
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

    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(kg) as total_kg,
        SUM(price) as total_spent,
        AVG(price) as avg_price,
        MIN(date) as first_purchase,
        MAX(date) as last_purchase
      FROM transactions
      WHERE user_id = $1
    `, [userId]);

    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};
