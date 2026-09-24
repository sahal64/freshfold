import * as planService from '../services/planService.js';

/**
 * Controller Layer: Plans
 * Translates HTTP requests to planService operations.
 */

/**
 * GET /api/plans (Public)
 */
export async function getActivePlans(req, res) {
  try {
    const plans = await planService.getActivePlans();
    return res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch services and plans',
    });
  }
}

/**
 * GET /api/admin/plans (Protected)
 */
export async function getAllPlans(req, res) {
  try {
    const plans = await planService.getAllPlans();
    return res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve admin plans',
    });
  }
}

/**
 * POST /api/admin/plans (Protected)
 */
export async function createPlan(req, res) {
  try {
    const plan = await planService.createPlan(req.body);
    return res.status(201).json({
      success: true,
      message: 'Laundry plan created successfully',
      plan,
    });
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create plan',
    });
  }
}

/**
 * PUT /api/admin/plans/:id (Protected)
 */
export async function updatePlan(req, res) {
  try {
    const { id } = req.params;
    const updated = await planService.updatePlan(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      plan: updated,
    });
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update plan',
    });
  }
}

/**
 * PATCH /api/admin/plans/:id/status (Protected)
 */
export async function togglePlanStatus(req, res) {
  try {
    const { id } = req.params;
    const plan = await planService.togglePlanStatus(id);
    return res.status(200).json({
      success: true,
      message: `Plan "${plan.name}" is now ${plan.isActive ? 'Active' : 'Inactive'}`,
      plan,
    });
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to toggle plan status',
    });
  }
}

/**
 * DELETE /api/admin/plans/:id (Protected)
 */
export async function deletePlan(req, res) {
  try {
    const { id } = req.params;
    const result = await planService.deletePlan(id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to delete plan',
    });
  }
}
