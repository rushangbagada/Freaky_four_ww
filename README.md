# Professional Business Analytics Platform

A comprehensive full-stack web application for business analytics, event management, and professional networking. Built with modern technologies and designed for enterprise-grade performance.

## 🏢 Overview

This platform transforms traditional sports management systems into a professional business analytics and event management solution. It provides tools for:

- **Business Analytics & Predictions**: Track performance metrics and forecast business outcomes
- **Event Management**: Organize and manage professional conferences, seminars, and networking events
- **User Management**: Role-based access control with professional profiles
- **Real-time Data**: Live event tracking and dynamic statistics
- **Professional Networking**: Client testimonials and business reviews

## 🚀 Features

### Core Functionality
- **Multi-Factor Authentication**: OTP-based login system with email verification
- **Role-Based Access Control**: User, Club Leader, and Admin roles
- **Real-time Event Tracking**: Live updates for ongoing business events
- **Analytics Dashboard**: Comprehensive business metrics and KPIs
- **Prediction System**: Business forecasting with accuracy tracking
- **Payment Integration**: Stripe-powered booking and payment processing

### Security & Performance
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive data validation and sanitization
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Secure configuration management

### Professional Features
- **Email Templates**: Professional-grade email notifications
- **Business Reviews**: Client testimonials and feedback system
- **Event Scheduling**: Professional conference and meeting management
- **Venue Management**: Facility booking and management
- **Analytics Reporting**: Detailed performance metrics and insights

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing
- **Nodemailer**: Email service integration
- **Stripe**: Payment processing

### Frontend
- **React.js**: User interface library
- **Vite**: Build tool and development server
- **Modern JavaScript**: ES6+ features
- **Responsive Design**: Mobile-first approach

### Development Tools
- **ESLint**: Code linting and formatting
- **Environment Variables**: Configuration management
- **Git**: Version control
- **NPM**: Package management

## 📁 Project Structure

```
Freaky_Four/
├── server/                    # Backend application
│   ├── controllers/          # Business logic controllers
│   │   ├── authController.js # Authentication handling
│   │   ├── adminController.js # Admin functionality
│   │   └── quizController.js # Quiz/assessment features
│   ├── models/               # Database schemas
│   │   ├── User.js          # User account model
│   │   ├── review.js        # Client testimonials
│   │   ├── prediction_user.js # Analytics users
│   │   └── prediction_match.js # Event predictions
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.js    # Authentication endpoints
│   │   ├── adminRoutes.js   # Admin panel routes
│   │   └── quizRoutes.js    # Assessment routes
│   ├── middlewares/          # Custom middleware
│   │   ├── authMiddleware.js # JWT verification
│   │   └── adminMiddleware.js # Admin access control
│   ├── config/               # Configuration files
│   │   ├── db.js            # Database connection
│   │   └── mailer.js        # Email configuration
│   ├── init_*.js            # Database initialization scripts
│   └── server.js            # Main server file
├── frontend/                 # React application
│   └── sports-hub/          # Main frontend application
├── package.json             # Root dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- NPM or Yarn package manager
- Stripe account (for payments)
- Email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Freaky_Four
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend/sports-hub
   npm install
   ```

5. **Environment Configuration**
   
   Create `.env` files in both server and frontend directories:

   **Server `.env`:**
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/business-analytics
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   
   # Email Service
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Payment Processing
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   **Frontend `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

### Database Setup

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Initialize the database with professional data**
   ```bash
   cd server
   
   # Initialize professional testimonials
   node init_review.js
   
   # Initialize business analysts
   node init_prediction_player.js
   
   # Initialize professional events
   node init_prediction_match.js
   
   # Initialize business statistics
   node init_stats.js
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend/sports-hub
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (step 1)
- `POST /api/auth/verify-otp` - OTP verification (step 2)
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset completion

### Business Data Endpoints
- `GET /api/stats` - Business statistics and KPIs
- `GET /api/review` - Client testimonials
- `GET /api/events` - Professional events and conferences
- `GET /api/prediction_match` - Event predictions
- `GET /api/leader` - Analytics leaderboard

### Admin Endpoints
- `GET /api/admin/users` - User management
- `POST /api/admin/turfs` - Venue management
- `PUT /api/admin/turfs/:id` - Update venue
- `DELETE /api/admin/turfs/:id` - Remove venue

## 🎯 Key Features Explained

### Professional Authentication System
- **Two-Factor Authentication**: Email OTP verification for enhanced security
- **Professional Email Templates**: Branded email communications
- **Role-Based Access**: Different permission levels for users, leaders, and admins
- **OAuth Integration**: Google login support for enterprise users

### Business Analytics Dashboard
- **Real-time Metrics**: Live business performance indicators
- **Prediction Accuracy**: Track forecasting performance with detailed analytics
- **Performance Badges**: Achievement system for top performers
- **Trend Analysis**: Historical data visualization and insights

### Event Management System
- **Professional Events**: Conference and seminar scheduling
- **Venue Booking**: Facility management with payment integration
- **Real-time Updates**: Live event tracking and notifications
- **Attendee Management**: Registration and participation tracking

### Client Relationship Management
- **Professional Testimonials**: Client review and feedback system
- **Business Networking**: Professional profile management
- **Communication Tools**: Integrated messaging and notifications
- **Performance Tracking**: Client satisfaction metrics

## 🛡️ Security Features

- **Password Hashing**: bcrypt encryption for secure password storage
- **JWT Tokens**: Stateless authentication with expiration handling
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Comprehensive data sanitization
- **Environment Variables**: Secure configuration management
- **Error Handling**: Comprehensive error logging and management

## 🚀 Deployment

### Production Deployment Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure production database URI
   - Set secure JWT secret
   - Configure production email service
   - Set up Stripe production keys

2. **Database**
   - Ensure MongoDB is secured
   - Set up database backups
   - Configure connection pooling
   - Set up monitoring

3. **Security**
   - Enable HTTPS
   - Configure proper CORS settings
   - Set up rate limiting
   - Enable security headers

4. **Performance**
   - Enable compression
   - Set up caching
   - Configure CDN for static assets
   - Optimize database queries

### Deployment Platforms
- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add comprehensive comments and documentation
- Include error handling and validation
- Test thoroughly before submitting
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@web-wonders.com
- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Submit issues through the GitHub issue tracker

## 🎉 Acknowledgments

- **Web Wonders Team** - Development and design
- **Professional Community** - Requirements and feedback
- **Open Source Libraries** - Core functionality and tools
- **Testing Community** - Quality assurance and bug reports

---

**Built with ❤️ by the Web Wonders Team**
