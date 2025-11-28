import { Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';
import { Transaction } from '../types';

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { date, kg, price } = req.body;
    const proveImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (!kg || !price) {
      return res.status(400).json({ error: 'kg and price are required' });
    }

    const transactionDate = date || new Date().toISOString();

    // Insert transaction
    const insertTx = db.prepare(
      'INSERT INTO transactions (user_id, date, kg, price, prove_image) VALUES (?, ?, ?, ?, ?)'
    );
    const result = insertTx.run(userId, transactionDate, kg, price, proveImage);

    // Update user's last_buy_date
    db.prepare('UPDATE users SET last_buy_date = ? WHERE id = ?').run(transactionDate, userId);

    // Get created transaction
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT ? OFFSET ?'
    ).all(userId, limit, offset);

    const countResult = db.prepare(
      'SELECT COUNT(*) as count FROM transactions WHERE user_id = ?'
    ).get(userId) as { count: number };

    res.json({
      transactions,
      total: countResult.count,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const transaction = db.prepare(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?'
    ).get(id, userId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to get transaction' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = db.prepare(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?'
    ).run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
