import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

const JWT_EXPIRES_IN = '24h';

/**
 * Clean Architecture Auth Service
 * Encapsulates authentication business rules, hashing, and token signing.
 */

/**
 * Automatically seeds initial admin user if none exists in MongoDB
 */
export async function seedAdminIfNoneExists() {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@freshfold.in';
      const rawPassword = process.env.ADMIN_PASSWORD || 'FreshFold@Admin2026';
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      await Admin.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: 'FreshFold Admin',
        role: 'admin',
      });

      console.log(`👤 Admin account seeded: ${email}`);
    }
  } catch (error) {
    console.error('Error seeding admin account:', error.message);
  }
}

/**
 * Authenticates admin and returns a signed JWT token
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} { token, admin }
 */
export async function loginAdmin(email, password) {
  if (!email || !password) {
    const err = new Error('Both email and password are required');
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const secret = process.env.JWT_SECRET || 'fallback_development_secret_2026';
  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

/**
 * Verify and decode a JWT token
 * @param {string} token 
 * @returns {Object} decoded token payload
 */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_2026';
  return jwt.verify(token, secret);
}
