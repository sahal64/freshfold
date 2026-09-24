import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import OrderForm from './components/OrderForm';
import OrderStatus from './components/OrderStatus';
import OrderModal from './components/OrderModal';
import WhyUs from './components/WhyUs';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import {
  createOrder,
  getOrderByTrackingId,
  fetchPublicPlans,
  getStoredAdmin,
  verifyAdminSession,
} from './services/api';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Public Plans State
  const [plans, setPlans] = useState([]);

  // Customer Order & Form State
  const [selectedServiceId, setSelectedServiceId] = useState('wash-fold');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Tracker State
  const [trackingIdToSearch, setTrackingIdToSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Admin Portal State
  const [adminUser, setAdminUser] = useState(getStoredAdmin());
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Load public plans on mount
  useEffect(() => {
    loadPublicPlans();
    // Validate stored admin token on background mount
    verifyAdminSession().then((session) => {
      if (session && session.admin) {
        setAdminUser(session.admin);
      } else {
        setAdminUser(null);
      }
    });
  }, []);

  const loadPublicPlans = async () => {
    try {
      const activePlans = await fetchPublicPlans();
      if (activePlans && activePlans.length > 0) {
        setPlans(activePlans);
      }
    } catch (err) {
      console.warn('Could not fetch dynamic plans from API, fallback used:', err.message);
    }
  };

  const scrollToSection = (sectionId) => {
    // If inside admin view, return to public view first
    if (isAdminView) {
      setIsAdminView(false);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceId) => {
    setSelectedServiceId(serviceId);
    scrollToSection('order-form');
  };

  const handleSubmitOrder = async (orderPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await createOrder(orderPayload);
      if (response && response.order) {
        setConfirmedOrder(response.order);
      } else {
        throw new Error('Invalid response structure received from server');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setSubmitError(err.message || 'Could not place order. Please verify that the backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchOrder = async (trackingId) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await getOrderByTrackingId(trackingId);
      if (response && response.order) {
        setSearchResult(response.order);
      } else {
        throw new Error('Order not found');
      }
    } catch (err) {
      console.error('Tracking lookup error:', err);
      setSearchResult(null);
      setSearchError(err.message || 'Tracking ID not found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrackFromModal = (trackingId) => {
    setConfirmedOrder(null);
    setTrackingIdToSearch(trackingId);
    scrollToSection('tracker');
    handleSearchOrder(trackingId);
  };

  // Admin Navigation Handlers
  const handleOpenAdminTrigger = () => {
    if (adminUser) {
      setIsAdminView(!isAdminView);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user) => {
    setAdminUser(user);
    setIsAdminView(true);
  };

  const handleExitAdminView = () => {
    setIsAdminView(false);
  };

  // IF ADMIN VIEW IS ACTIVE: Render Admin Dashboard Console
  if (isAdminView && adminUser) {
    return (
      <AdminDashboard
        adminUser={adminUser}
        onExitAdmin={handleExitAdminView}
        onPlansUpdated={loadPublicPlans}
      />
    );
  }

  // PUBLIC CUSTOMER WEBSITE VIEW
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      {/* Global submit error alert banner if any */}
      {submitError && (
        <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-3 text-xs sm:text-sm text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{submitError}</span>
          <button
            onClick={() => setSubmitError(null)}
            className="ml-3 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          onBookClick={() => scrollToSection('order-form')}
          onTrackClick={() => scrollToSection('tracker')}
        />

        {/* Dynamic Services & Pricing Grid from API */}
        <Services plans={plans} onSelectService={handleSelectService} />

        {/* Dynamic Order Booking Form */}
        <OrderForm
          plans={plans}
          selectedServiceId={selectedServiceId}
          onSubmitOrder={handleSubmitOrder}
          isSubmitting={isSubmitting}
        />

        {/* Order Tracking Timeline */}
        <OrderStatus
          initialTrackingId={trackingIdToSearch}
          onSearchOrder={handleSearchOrder}
          searchResult={searchResult}
          isLoading={isSearching}
          error={searchError}
        />

        <WhyUs />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Customer Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onTrackOrder={handleTrackFromModal}
        />
      )}

      {/* Admin Sign-In Modal */}
      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
