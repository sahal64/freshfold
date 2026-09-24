import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Package,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Power,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  TrendingUp,
  MapPin,
  Phone,
  Calendar,
  IndianRupee
} from 'lucide-react';
import {
  adminFetchPlans,
  adminCreatePlan,
  adminUpdatePlan,
  adminTogglePlanStatus,
  adminDeletePlan,
  adminFetchOrders,
  adminUpdateOrderStatus,
  adminLogout,
} from '../../services/api';
import { formatINR } from '../../data/servicesData';
import PlanModal from './PlanModal';

const STATUS_OPTIONS = [
  { value: 'PLACED', label: 'Order Placed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'IN_WASH', label: 'In Wash & Care', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'IRONED_PACKED', label: 'Steam Ironed', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function AdminDashboard({ adminUser, onExitAdmin, onPlansUpdated }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'plans'

  // Plans State
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlanToEdit, setSelectedPlanToEdit] = useState(null);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Notifications
  const [actionNotice, setActionNotice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadPlans();
    loadOrders();
  }, []);

  // Reload orders when filters change
  useEffect(() => {
    loadOrders();
  }, [orderStatusFilter]);

  const loadPlans = async () => {
    setIsLoadingPlans(true);
    setErrorMessage(null);
    try {
      const data = await adminFetchPlans();
      setPlans(data);
      if (onPlansUpdated) {
        onPlansUpdated();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    setErrorMessage(null);
    try {
      const data = await adminFetchOrders({
        search: orderSearch,
        status: orderStatusFilter,
      });
      setOrders(data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch customer bookings');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCopyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Plan Handlers
  const handleOpenCreateModal = () => {
    setSelectedPlanToEdit(null);
    setPlanModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setSelectedPlanToEdit(plan);
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (payload) => {
    setIsSavingPlan(true);
    setErrorMessage(null);
    try {
      if (selectedPlanToEdit) {
        await adminUpdatePlan(selectedPlanToEdit._id, payload);
        showNotification(`Plan "${payload.name}" updated successfully.`);
      } else {
        await adminCreatePlan(payload);
        showNotification(`Plan "${payload.name}" created successfully.`);
      }
      setPlanModalOpen(false);
      await loadPlans();
    } catch (err) {
      setErrorMessage(err.message || 'Error saving plan');
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      await adminTogglePlanStatus(plan._id);
      showNotification(`"${plan.name}" is now ${plan.isActive ? 'Inactive' : 'Active'}.`);
      await loadPlans();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to toggle status');
    }
  };

  const handleDeletePlan = async (plan) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${plan.name}"? Past customer bookings will remain intact.`
    );
    if (!confirmDelete) return;

    try {
      await adminDeletePlan(plan._id);
      showNotification(`Plan "${plan.name}" deleted.`);
      await loadPlans();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete plan');
    }
  };

  // Order Handlers
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await adminUpdateOrderStatus(orderId, newStatus);
      showNotification(`Booking ${response.order.trackingId} status updated to ${newStatus.replace(/_/g, ' ')}!`);
      // Update local state directly for snappy UI response
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleSignOut = () => {
    adminLogout();
    onExitAdmin();
  };

  // Metrics calculations
  const totalOrdersCount = orders.length;
  const inProgressCount = orders.filter((o) => o.status !== 'DELIVERED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalValueINR = orders.reduce((sum, o) => sum + (o.estimatedPrice || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">FreshFold</span>
                <span className="text-[10px] font-mono uppercase bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30">
                  Operations Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Signed in: <strong className="text-slate-200">{adminUser?.email || 'admin@freshfold.in'}</strong>
            </span>

            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Site</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Alerts & Notifications */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-2.5 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="font-bold text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Management Console</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live customer pickup management, status progression, and public service catalog control.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs self-start">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Customer Bookings ({totalOrdersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'plans'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Plans & Pricing ({plans.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CUSTOMER BOOKINGS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Total Orders</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalOrdersCount}</span>
                <span className="text-[11px] text-slate-400">All customer bookings</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">In-Progress</span>
                <span className="text-2xl font-extrabold text-brand-600 mt-1 block">{inProgressCount}</span>
                <span className="text-[11px] text-slate-400">Scheduled, wash, packing, delivery</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Delivered</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{deliveredCount}</span>
                <span className="text-[11px] text-slate-400">Successfully returned</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Total Est. Value</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{formatINR(totalValueINR)}</span>
                <span className="text-[11px] text-emerald-600 font-medium">All prices in INR (₹)</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ID, Customer Name, Phone, Address..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter Status:</span>
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PLACED">Placed</option>
                  <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
                  <option value="IN_WASH">In Wash & Care</option>
                  <option value="IRONED_PACKED">Steam Ironed</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>

                <button
                  onClick={loadOrders}
                  disabled={isLoadingOrders}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Tracking ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service & Load</th>
                      <th className="py-3.5 px-4">Pickup Schedule</th>
                      <th className="py-3.5 px-4">Est. Amount (₹)</th>
                      <th className="py-3.5 px-4">Status (Click to Advance)</th>
                      <th className="py-3.5 px-4">Booked On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p>No customer bookings match your filter criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        const statusConfig = STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];
                        const isUpdating = updatingOrderId === order._id;

                        return (
                          <tr key={order._id} className="hover:bg-slate-50/70 transition">
                            
                            {/* Tracking ID with copy */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200/50">
                                  {order.trackingId}
                                </span>
                                <button
                                  onClick={() => handleCopyTrackingId(order.trackingId)}
                                  className="text-slate-400 hover:text-brand-600 transition"
                                  title="Copy Tracking ID"
                                >
                                  {copiedId === order.trackingId ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Customer details */}
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-800">{order.customerName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">+91 {order.phone}</p>
                              <p className="text-[11px] text-slate-400 truncate max-w-xs" title={order.address}>
                                {order.address}
                              </p>
                            </td>

                            {/* Service and Load */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-semibold text-slate-800">{order.service}</span>
                              <span className="text-slate-500 block text-[11px]">
                                ~{order.quantity} {order.unit || 'kg'}
                              </span>
                            </td>

                            {/* Pickup Schedule */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-slate-700 font-medium">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{order.pickupDate}</span>
                              </div>
                              <span className="text-[11px] text-slate-400 block">{order.pickupTimeSlot}</span>
                            </td>

                            {/* Estimated Amount */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {formatINR(order.estimatedPrice)}
                              </span>
                              <span className="text-[10px] text-emerald-600 block">Pay on Delivery</span>
                            </td>

                            {/* Status with interactive dropdown */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="relative inline-block">
                                <select
                                  disabled={isUpdating}
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border appearance-none pr-7 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 ${statusConfig.color}`}
                                >
                                  {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-white text-slate-800 normal-case font-medium">
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
                                  {isUpdating ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <span className="text-[10px]">▼</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Created At */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                              {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PLANS & SERVICES */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Laundry Plans Catalog</h2>
                <p className="text-xs text-slate-500">
                  Active plans appear immediately on the customer landing and booking pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadPlans}
                  disabled={isLoadingPlans}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                  title="Reload plans"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingPlans ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/25 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Plan</span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition shadow-sm hover:shadow-md ${
                    !plan.isActive
                      ? 'border-dashed border-slate-300 opacity-70 bg-slate-50/60'
                      : plan.popular
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Badges Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(plan)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 ${
                            plan.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{plan.isActive ? 'Active' : 'Inactive'}</span>
                        </button>

                        {plan.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                            ★ Popular
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {plan.turnaround}
                      </span>
                    </div>

                    {/* Plan Name & Details */}
                    <h3 className="text-base font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 min-h-[32px]">{plan.tagline || 'Standard laundry care'}</p>

                    {/* Price in INR */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Public Rate:</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">₹{plan.price}</span>
                        <span className="text-xs font-semibold text-slate-500">/{plan.unit.replace('per ', '')}</span>
                      </div>
                    </div>

                    {/* Features Snippet */}
                    {plan.features && plan.features.length > 0 && (
                      <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                        <span className="font-semibold text-slate-700 block">Features:</span>
                        {plan.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="truncate">• {feat}</div>
                        ))}
                        {plan.features.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{plan.features.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditModal(plan)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Plan</span>
                    </button>

                    <button
                      onClick={() => handleDeletePlan(plan)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Plan Create / Edit Modal */}
      <PlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onSave={handleSavePlan}
        planToEdit={selectedPlanToEdit}
        isSaving={isSavingPlan}
      />
    </div>
  );
}
