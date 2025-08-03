const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const adminRoutes = require('./routes/adminRoutes');

// Create test app
const app = express();
app.use(express.json());

// Mount admin routes exactly like in server.js
app.use("/api/admin", adminRoutes);

// Add a test route to verify the mounting
app.get('/debug/routes', (req, res) => {
  // Get all registered routes
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Direct route
      routes.push({
        method: Object.keys(middleware.route.methods)[0].toUpperCase(),
        path: middleware.route.path
      });
    } else if (middleware.name === 'router') {
      // Router middleware (like our admin routes)
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const method = Object.keys(handler.route.methods)[0].toUpperCase();
          const fullPath = middleware.regexp.source
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '')
            .replace('^', '')
            .replace('\\', '') + handler.route.path;
          
          routes.push({
            method,
            path: fullPath
          });
        }
      });
    }
  });
  
  res.json({
    message: 'Available routes',
    routes: routes.filter(route => route.path.includes('matches'))
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Debug server running on http://localhost:${port}`);
  console.log(`Check routes at: http://localhost:${port}/debug/routes`);
});

// Test the specific route function
const testMatchesRoute = async () => {
  try {
    const { getAllMatches } = require('./controllers/adminController');
    console.log('✅ getAllMatches function imported successfully');
    console.log('Function type:', typeof getAllMatches);
  } catch (error) {
    console.error('❌ Error importing getAllMatches:', error.message);
  }
};

testMatchesRoute();
