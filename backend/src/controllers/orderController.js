import * as orderService from '../services/orderService.js';

/**
 * Controller Layer (Clean Architecture)
 * Handles HTTP requests, delegates work to the orderService, and sends HTTP responses.
 */

/**
 * POST /api/orders
 * Create a new pickup order
 */
export async function createOrder(req, res, next) {
  try {
    const orderData = req.body;
    const newOrder = await orderService.createOrder(orderData);

    return res.status(201).json({
      success: true,
      message: 'Pickup order scheduled successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order in controller:', error.message);
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to place order',
    });
  }
}

/**
 * GET /api/orders/:trackingId
 * Look up an existing order by tracking ID
 */
export async function getOrderByTrackingId(req, res, next) {
  try {
    const { trackingId } = req.params;
    const order = await orderService.findOrderByTrackingId(trackingId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No order found with tracking number "${trackingId}". Please check the ID and try again.`,
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order in controller:', error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Error looking up order',
    });
  }
}

/**
 * GET /api/admin/orders (Protected)
 * Retrieve orders for admin dashboard with filtering and search
 */
export async function getAllOrdersAdmin(req, res) {
  try {
    const { search, status } = req.query;
    const orders = await orderService.getAllOrdersAdmin({ search, status });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customer bookings',
    });
  }
}

/**
 * PATCH /api/admin/orders/:id/status (Protected)
 * Update order status
 */
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(id, status);

    return res.status(200).json({
      success: true,
      message: `Order ${updatedOrder.trackingId} status updated to ${updatedOrder.status}`,
      order: updatedOrder,
    });
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update order status',
    });
  }
}

/**
 * GET /api/orders
 * Verification helper: Get list of recent orders
 */
export async function getRecentOrders(req, res) {
  try {
    const orders = await orderService.listRecentOrders(10);
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
