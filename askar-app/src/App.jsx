import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/customer/LoadingScreen'
import ScrollToTopButton from './components/customer/ScrollToTop'

// Customer Pages
import HomePage from './pages/customer/HomePage'
import ShopPage from './pages/customer/ShopPage'
import NewArrivalsPage from './pages/customer/NewArrivalsPage'
import OffersPage from './pages/customer/OffersPage'
import ContactPage from './pages/customer/ContactPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import CartPage from './pages/customer/CartPage'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminSettings from './pages/admin/AdminSettings'

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  return (
    <LanguageProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ScrollToTopButton />
          {initialLoading ? (
            <LoadingScreen onComplete={() => setInitialLoading(false)} />
          ) : (
            <AuthProvider>
              <CartProvider>
                <Routes>
                  {/* Customer Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                  <Route path="/offers" element={<OffersPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Fallback Route */}
                  <Route path="*" element={<HomePage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </CartProvider>
            </AuthProvider>
          )}
        </BrowserRouter>
      </ToastProvider>
    </LanguageProvider>
  )
}
