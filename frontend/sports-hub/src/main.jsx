import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorBoundary from '../components/admin/ErrorBoundary'
import '../components/admin/css/error-boundary.css'
import { AuthProvider } from './AuthContext'
import './index.css'
import AboutUs from '../components/aboutus'
import Result from '../components/result'
import SportsClubs from '../components/sports-clubs'
import Calender from '../components/calender'
import Gallery from '../components/gallery'
import Home from '../components/home'
import Layout from './layout'
import Register from '../components/register'
import Login from '../components/login'
import OTPVerification from '../components/OTPVerification'
import ResetPassword from '../components/ResetPassword'
import NotFound from '../components/NotFound'
import Blog from '../components/blog'
import Profile from '../components/profile'
import PredictionGamePage from '../components/gamepage'
import LiveSports from '../components/livesports'
import ClubDetails from '../components/club-details'
import ReviewsPage from '../components/reviews'
const AdminDashboard = lazy(() => import('../components/admin/Dashboard'));
import PaymentSuccess from '../components/payment/PaymentSuccess';
import PaymentFailed from '../components/payment/PaymentFailed';
import Turf from '../components/turf';

import SportsBot from '../components/SportsBot'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
       {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/aboutus',
        element: <AboutUs />
      },
      {
        path: '/gallery',
        element: <Gallery />
        // loader: { get_data}
      },
      {
        path: '/sports-clubs',
        element: <SportsClubs />
      },
      {
        path: '/calender',
        element: <Calender />
      },
      {
        path: '/result',
        element: <Result />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/gamepage',
        element: <PredictionGamePage />
      },
      {
        path: '/blog',
        element: <Blog />
      },

      {
        path: '/livesports',
        element: <LiveSports />
      },
      {
        path: '/club-details/:name',
        element: <ClubDetails />
      },
      {
        path: '/reviews',
        element: <ReviewsPage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/verify-otp',
        element: <OTPVerification />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/admin',
        element: <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <AdminDashboard />
          </Suspense>
        </ErrorBoundary>
      },
      {
        path: '/payment/PaymentSuccess',
        element: <PaymentSuccess />
      },
      {
        path: '/payment/PaymentFailed',
        element: <PaymentFailed />
      },
      {
        path: '/turf',
        element: <Turf />
      },

    
      {
        path:'/chatbot',
        element:<SportsBot/>
      },
      {
        path: '*',
        element: <NotFound />
      }

    ]
  },
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)


