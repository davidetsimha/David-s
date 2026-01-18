import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeLayout } from './components/layout/HomeLayout';
import { EventsLayout } from './components/layout/EventsLayout';
import { ShopLayout } from './components/layout/ShopLayout';
import { PageLayout } from './components/layout/PageLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { RequireAuth } from './components/admin/RequireAuth';
import { ROUTES } from './config/routes';

// Home page
import { HomePage } from './pages/HomePage';

// Events space pages
import { EventsHomePage } from './pages/EventsHomePage';
import { EventsGalleryPage } from './pages/EventsGalleryPage';
import { EventsQuotePage } from './pages/EventsQuotePage';

// Shop space pages
import { ShopHomePage } from './pages/ShopHomePage';
import { CheckoutPage, CheckoutSuccessPage, CheckoutCancelPage, OrderHistoryPage } from './pages/checkout';

// Shared pages
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
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
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminDeliveryZones } from './pages/admin/AdminDeliveryZones';
import { AdminFormulas } from './pages/admin/AdminFormulas';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home - Split Screen */}
        <Route element={<HomeLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
        </Route>

        {/* Events Space */}
        <Route element={<EventsLayout />}>
          <Route path={ROUTES.EVENTS} element={<EventsHomePage />} />
          <Route path={ROUTES.EVENTS_GALLERY} element={<EventsGalleryPage />} />
          <Route path={ROUTES.EVENTS_QUOTE} element={<EventsQuotePage />} />
          {/* Shared pages in Events context */}
          <Route path="/evenements/about" element={<AboutPage />} />
          <Route path="/evenements/faq" element={<FAQPage />} />
          <Route path="/evenements/contact" element={<ContactPage />} />
        </Route>

        {/* Shop Space */}
        <Route element={<ShopLayout />}>
          <Route path={ROUTES.SHOP} element={<ShopHomePage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.CHECKOUT_SUCCESS} element={<CheckoutSuccessPage />} />
          <Route path={ROUTES.CHECKOUT_CANCEL} element={<CheckoutCancelPage />} />
          <Route path={ROUTES.ORDER_HISTORY} element={<OrderHistoryPage />} />
          {/* Shared pages in Shop context */}
          <Route path="/boutique/about" element={<AboutPage />} />
          <Route path="/boutique/faq" element={<FAQPage />} />
          <Route path="/boutique/contact" element={<ContactPage />} />
        </Route>

        {/* Standalone shared pages (for direct access) */}
        <Route element={<PageLayout />}>
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        </Route>

        {/* Legacy redirects */}
        <Route path={ROUTES.RECEPTIONS} element={<Navigate to={ROUTES.EVENTS} replace />} />
        <Route path={ROUTES.SHABBAT} element={<Navigate to={ROUTES.SHOP} replace />} />
        <Route path={ROUTES.GALLERY} element={<Navigate to={ROUTES.EVENTS_GALLERY} replace />} />

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
          <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
          <Route path={ROUTES.ADMIN_MESSAGES} element={<AdminMessages />} />
          <Route path={ROUTES.ADMIN_CUSTOMERS} element={<AdminCustomers />} />
          <Route path={ROUTES.ADMIN_DELIVERY_ZONES} element={<AdminDeliveryZones />} />
          <Route path={ROUTES.ADMIN_FORMULAS} element={<AdminFormulas />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
