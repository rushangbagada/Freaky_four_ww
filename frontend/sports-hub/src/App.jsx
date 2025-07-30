import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Header from '../components/header';
import Footer from '../components/footer';
import Home from '../components/home';
import Register from '../components/register';
import Login from '../components/login';
import Gallery from '../components/gallery';
import AboutUs from '../components/aboutus';
import SportsClubs from '../components/sports-clubs';
import Result from '../components/result';
import ClubDetails from '../components/club-details';
import Calendar from '../components/calender';
import AdminDashboard from '../components/admin/Dashboard';
import Profile from '../components/profile';
import PaymentSuccess from '../components/payment/PaymentSuccess';
import PaymentFailed from '../components/payment/PaymentFailed';
import Turf from '../components/turf';
import FloatingChatbot from '../components/FloatingChatbot';
import SportsBot from '../components/SportsBot';
import GamePage from '../components/gamepage';
import Blog from '../components/blog';
import LiveSports from '../components/livesports';
import MiniGames from '../components/minigames';
import TurfCard from '../components/payment/TurfCard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/sports-clubs" element={<SportsClubs />} />
        <Route path="/result" element={<Result />} />
        <Route path="/club-details/:id" element={<ClubDetails />} />
        <Route path="/calender" element={<Calendar />} />
        <Route path="/turf" element={<Turf />} />
        <Route path="/chatbot" element={<SportsBot />} />
        <Route path="/gamepage" element={<GamePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/livesports" element={<LiveSports />} />
        <Route path="/minigames" element={<MiniGames />} />
        <Route path="/TurfCard" element={<TurfCard />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        {/* Catch-all route for 404 pages - temporarily disabled for debugging */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />
      <FloatingChatbot />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
