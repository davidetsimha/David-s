import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { RequireAuth } from './components/admin/RequireAuth';
import { ROUTES } from './config/routes';

// Public pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ReceptionsPage } from './pages/ReceptionsPage';
import { ShabbatOrdersPage } from './pages/ShabbatOrdersPage';
import { GalleryPage } from './pages/GalleryPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage, CheckoutSuccessPage, CheckoutCancelPage } from './pages/checkout';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminQuotes } from './pages/admin/AdminQuotes';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminFAQ } from './pages/admin/AdminFAQ';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with PageLayout */}
        <Route element={<PageLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.RECEPTIONS} element={<ReceptionsPage />} />
          <Route path={ROUTES.SHABBAT} element={<ShabbatOrdersPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.CHECKOUT_SUCCESS} element={<CheckoutSuccessPage />} />
          <Route path={ROUTES.CHECKOUT_CANCEL} element={<CheckoutCancelPage />} />
          <Route path={ROUTES.GALLERY} element={<GalleryPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        </Route>

        {/* Admin login (no layout) */}
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

        {/* Admin routes with AdminLayout + RequireAuth */}
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
          <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategories />} />
          <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrders />} />
          <Route path={ROUTES.ADMIN_QUOTES} element={<AdminQuotes />} />
          <Route path={ROUTES.ADMIN_MEDIA} element={<AdminMedia />} />
          <Route path={ROUTES.ADMIN_FAQ} element={<AdminFAQ />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
