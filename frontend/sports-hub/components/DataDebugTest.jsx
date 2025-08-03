// import React, { useState, useEffect } from 'react';
// import { getApiUrl, apiRequest } from '../src/config/api';

// export default function DataDebugTest() {
//   const [turfs, setTurfs] = useState([]);
//   const [clubs, setClubs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     testDataFetching();
//   }, []);

//   const testDataFetching = async () => {
//     console.log('🔍 Starting data fetch tests...');
    
//     try {
//       // Test 1: Fetch turfs using apiRequest
//       console.log('📋 Test 1: Fetching turfs using apiRequest...');
//       const turfsData = await apiRequest('/api/turfs');
//       console.log('✅ Turfs apiRequest success:', turfsData.length, 'items');
//       setTurfs(turfsData);

//       // Test 2: Fetch clubs using raw fetch
//       console.log('📋 Test 2: Fetching clubs using raw fetch...');
//       const clubsResponse = await fetch(getApiUrl('/api/clubs'));
//       if (!clubsResponse.ok) {
//         throw new Error(`HTTP error! status: ${clubsResponse.status}`);
//       }
//       const clubsData = await clubsResponse.json();
//       console.log('✅ Clubs raw fetch success:', clubsData.length, 'items');
//       setClubs(clubsData);

//       // Test 3: Test API base URL configuration
//       console.log('📋 Test 3: API Configuration...');
//       console.log('API Base URL:', getApiUrl(''));
//       console.log('Environment variables:', {
//         VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL,
//         VITE_API_URL: import.meta.env.VITE_API_URL,
//         VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL
//       });

//       setError(null);
//     } catch (err) {
//       console.error('❌ Data fetch test failed:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '2rem', background: '#f5f5f5', margin: '1rem' }}>
//         <h2>🔄 Testing Data Fetching...</h2>
//         <p>Please check the browser console for detailed logs.</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '2rem', background: '#f0f9ff', margin: '1rem', borderRadius: '8px' }}>
//       <h2>🧪 Data Fetch Debug Results</h2>
      
//       {error && (
//         <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
//           <h3>❌ Error:</h3>
//           <p>{error}</p>
//         </div>
//       )}

//       <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
//         <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
//           <h3>🌱 Turfs Data ({turfs.length} items)</h3>
//           <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
//             {turfs.slice(0, 5).map((turf, index) => (
//               <li key={turf.id || turf._id || index}>
//                 <strong>{turf.name}</strong> - {turf.location} - ₹{turf.price}
//               </li>
//             ))}
//             {turfs.length > 5 && <li>... and {turfs.length - 5} more</li>}
//           </ul>
//         </div>

//         <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
//           <h3>🏆 Clubs Data ({clubs.length} items)</h3>
//           <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
//             {clubs.slice(0, 5).map((club, index) => (
//               <li key={club._id || index}>
//                 <strong>{club.name}</strong> - {club.type} - {club.players} players
//               </li>
//             ))}
//             {clubs.length > 5 && <li>... and {clubs.length - 5} more</li>}
//           </ul>
//         </div>
//       </div>

//       <div style={{ marginTop: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '4px' }}>
//         <h4>🔧 API Configuration:</h4>
//         <ul>
//           <li><strong>Base URL:</strong> {getApiUrl('')}</li>
//           <li><strong>Turfs Endpoint:</strong> {getApiUrl('/api/turfs')}</li>
//           <li><strong>Clubs Endpoint:</strong> {getApiUrl('/api/clubs')}</li>
//         </ul>
//       </div>

//       <button 
//         onClick={() => {
//           setLoading(true);
//           testDataFetching();
//         }}
//         style={{ 
//           marginTop: '1rem', 
//           padding: '0.5rem 1rem', 
//           background: '#3b82f6', 
//           color: 'white', 
//           border: 'none', 
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         🔄 Retest Data Fetching
//       </button>
//     </div>
//   );
// }
