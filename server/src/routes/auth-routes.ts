import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Middleware to handle method not allowed
const methodNotAllowed = (req: Request, res: Response) => {
  res.status(405).json({ 
    message: 'Method Not Allowed',
    allowed: ['POST']
  });
};

// POST /login - Login a user
router.route('/login')
  .post(async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username, password }); // Log login attempts

      // Find user by username
      const user = await User.findOne({ where: { username } });
      console.log('User found:', user ? 'yes' : 'no'); // Log if user was found

      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Verify password using the model's method
      const isValidPassword = await user.comparePassword(password);
      console.log('Password valid:', isValidPassword); // Log password validation result

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET not found in environment variables');
        throw new Error('JWT_SECRET is not defined');
      }

      const token = jwt.sign(
        { username: user.username, id: user.id },
        secret,
        { expiresIn: '24h' }
      );

      console.log('Login successful for user:', username); // Log successful login
      res.json({ token, user: { username: user.username, id: user.id } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ 
        message: 'Error logging in',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  })
  .all(methodNotAllowed);

// GET /verify - Verify JWT token
router.route('/verify')
  .get(authenticateToken, (req: Request, res: Response) => {
    res.json({ valid: true });
  })
  .all(methodNotAllowed);

export default router;
