import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { RepairBookingPage } from './pages/RepairBookingPage';
import { TrackRepairPage } from './pages/TrackRepairPage';
import { DoorstepServicePage } from './pages/DoorstepServicePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminProtectedRoute } from './admin/routes/AdminProtectedRoute';
import { SEOPage, AboutPage } from './pages/SEOPage';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';

// Public Layout containing Public Header, Footer, and WhatsApp Floating Button
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <CustomerAuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Customer Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/repair-booking" element={<RepairBookingPage />} />
            <Route path="/track-repair" element={<TrackRepairPage />} />
            <Route path="/doorstep-service" element={<DoorstepServicePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/seo-locations" element={<SEOPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<AboutPage />} />
          </Route>

          {/* Completely Separate Admin Portal Routes (No Public Header / Footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

