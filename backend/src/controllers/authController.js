import * as authService from '../services/authService.js';

/**
 * Controller Layer: Authentication
 */

/**
 * POST /api/admin/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin(email, password);

    return res.status(200).json({
      success: true,
      message: 'Admin signed in successfully',
      token: result.token,
      admin: result.admin,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Authentication failed',
    });
  }
}

/**
 * GET /api/admin/me
 * Returns authenticated admin profile
 */
export async function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
}
