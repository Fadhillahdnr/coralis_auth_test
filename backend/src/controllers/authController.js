const db = require('../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.json({ message: 'Register success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login success',
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const [rows] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = crypto.randomBytes(16).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await db.query(
      `UPDATE users 
       SET reset_token = ?, 
           reset_token_expired = DATE_ADD(NOW(), INTERVAL 1 HOUR)
       WHERE email = ?`,
      [hashedToken, email]
    );

    console.log('==============================');
    console.log('RESET TOKEN (DEMO MODE)');
    console.log('Email :', email);
    console.log('Token :', resetToken);
    console.log('==============================');

    res.json({ message: 'Reset token generated (demo mode)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const [rows] = await db.query(
      `SELECT id FROM users
       WHERE reset_token = ?
       AND reset_token_expired > NOW()`,
      [hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    res.json({ message: 'Token valid' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token and new password required' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const [rows] = await db.query(
      `SELECT id FROM users
       WHERE reset_token = ?
       AND reset_token_expired > NOW()`,
      [hashedToken]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: 'Token invalid or expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users
       SET password = ?,
           reset_token = NULL,
           reset_token_expired = NULL
       WHERE id = ?`,
      [hashedPassword, rows[0].id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
