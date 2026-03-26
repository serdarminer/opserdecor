import { lazy } from 'react';
import type { ReactNode } from 'react';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const DecorsPage = lazy(() => import('./pages/DecorsPage'));
const DecorDetailPage = lazy(() => import('./pages/DecorDetailPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const InteractivePortfolioPage = lazy(() => import('./pages/InteractivePortfolioPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminDecors = lazy(() => import('./pages/admin/AdminDecors'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminSiteContent = lazy(() => import('./pages/admin/AdminSiteContent'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminDecorForm = lazy(() => import('./pages/admin/AdminDecorForm'));
const AdminNewsForm = lazy(() => import('./pages/admin/AdminNewsForm'));

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true
  },
  {
    name: 'About',
    path: '/about',
    element: <AboutPage />,
    visible: true
  },
  {
    name: 'Products',
    path: '/products',
    element: <ProductsPage />,
    visible: true
  },
  {
    name: 'Product Detail',
    path: '/products/:id',
    element: <ProductDetailPage />,
    visible: false
  },
  {
    name: 'Decors',
    path: '/decors',
    element: <DecorsPage />,
    visible: true
  },
  {
    name: 'Decor Detail',
    path: '/decors/:id',
    element: <DecorDetailPage />,
    visible: false
  },
  {
    name: 'News',
    path: '/news',
    element: <NewsPage />,
    visible: true
  },
  {
    name: 'News Detail',
    path: '/news/:id',
    element: <NewsDetailPage />,
    visible: false
  },
  {
    name: 'Portfolio',
    path: '/portfolio',
    element: <InteractivePortfolioPage />,
    visible: true
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <ContactPage />,
    visible: true
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false
  },
  {
    name: 'Admin Products',
    path: '/admin/products',
    element: <AdminProducts />,
    visible: false
  },
  {
    name: 'Admin Product New',
    path: '/admin/products/new',
    element: <AdminProductForm />,
    visible: false
  },
  {
    name: 'Admin Product Edit',
    path: '/admin/products/:id/edit',
    element: <AdminProductForm />,
    visible: false
  },
  {
    name: 'Admin Decors',
    path: '/admin/decors',
    element: <AdminDecors />,
    visible: false
  },
  {
    name: 'Admin Decor New',
    path: '/admin/decors/new',
    element: <AdminDecorForm />,
    visible: false
  },
  {
    name: 'Admin Decor Edit',
    path: '/admin/decors/:id/edit',
    element: <AdminDecorForm />,
    visible: false
  },
  {
    name: 'Admin News',
    path: '/admin/news',
    element: <AdminNews />,
    visible: false
  },
  {
    name: 'Admin News New',
    path: '/admin/news/new',
    element: <AdminNewsForm />,
    visible: false
  },
  {
    name: 'Admin News Edit',
    path: '/admin/news/:id/edit',
    element: <AdminNewsForm />,
    visible: false
  },
  {
    name: 'Admin Messages',
    path: '/admin/messages',
    element: <AdminMessages />,
    visible: false
  },
  {
    name: 'Admin Site Content',
    path: '/admin/site-content',
    element: <AdminSiteContent />,
    visible: false
  }
];

export default routes;
