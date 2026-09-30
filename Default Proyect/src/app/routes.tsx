import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

const PublicLayout = lazy(() => import('../components/layout/PublicLayout'));
const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'));

const Home = lazy(() => import('../pages/public/Home'));
const Services = lazy(() => import('../pages/public/Services'));
const Contact = lazy(() => import('../pages/public/Contact'));
const Booking = lazy(() => import('../pages/public/Booking'));
const Portfolio = lazy(() => import('../pages/public/Portfolio'));
const Testimonials = lazy(() => import('../pages/public/Testimonials'));
const ContentDetail = lazy(() => import('../pages/public/ContentDetail'));
const PaymentSuccess = lazy(() => import('../pages/payment/PaymentSuccess'));
const PaymentError = lazy(() => import('../pages/payment/PaymentError'));
const NotFound = lazy(() => import('../pages/public/NotFound'));

const Login = lazy(() => import('../pages/auth/Login'));

const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Contacts = lazy(() => import('../pages/admin/Contacts'));
const Projects = lazy(() => import('../pages/admin/Projects'));
const Payments = lazy(() => import('../pages/admin/Payments'));
const Appointments = lazy(() => import('../pages/admin/Appointments'));
const ServicesAdmin = lazy(() => import('../pages/admin/ServicesAdmin'));
const PortfolioAdmin = lazy(() => import('../pages/admin/PortfolioAdmin'));
const ContentAdmin = lazy(() => import('../pages/admin/ContentAdmin'));

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="servicios" element={<Services />} />
          <Route path="portafolio" element={<Portfolio />} />
          <Route path="testimonios" element={<Testimonials />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="agendar" element={<Booking />} />
          <Route path="contenido/:slug" element={<ContentDetail />} />
          <Route path="pago/exito" element={<PaymentSuccess />} />
          <Route path="pago/error" element={<PaymentError />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="contactos" element={<Contacts />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="pagos" element={<Payments />} />
          <Route path="agendamientos" element={<Appointments />} />
          <Route path="servicios" element={<ServicesAdmin />} />
          <Route path="portafolio" element={<PortfolioAdmin />} />
          <Route path="contenido" element={<ContentAdmin />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Suspense>
  );
}

export const Routes = AppRoutes;
