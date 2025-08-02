import { useEffect, useState } from 'react';

/**
 * Custom hook for database change detection with real-time polling
 * @param {Function} fetchData - Function to fetch data from API
 * @param {Array} dependencies - Dependencies array for useEffect (similar to useEffect dependencies)
 * @returns {Object} - { isPolling, hasChanges, lastUpdated }
 */
function useDatabaseChangeDetection(fetchData, dependencies = []) {
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const pollAndDetectChanges = async () => {
    console.log('🔄 Starting polling cycle...');
    setIsPolling(true);
    try {
      await fetchData();
      const now = new Date();
      console.log('✅ Polling completed successfully at:', now.toLocaleTimeString());
      if (lastUpdated && (now - lastUpdated) < 15000) {
        console.log('📊 Changes detected - showing indicator');
        setHasChanges(true);
        setTimeout(() => {
          console.log('📊 Hiding changes indicator');
          setHasChanges(false);
        }, 3000);
      }
      setLastUpdated(now);
    } catch (error) {
      // Check if error is related to JSON parsing (HTML response)
      if (error.message && (error.message.includes('Unexpected token') || error.message.includes('<!doctype'))) {
        console.error('❌ Error during polling: Received HTML instead of JSON - likely API endpoint issue');
        console.error('📄 This usually means the API endpoint returned an error page instead of JSON data');
        console.error('🔧 Consider checking if the API server is running and accessible');
        console.error('🌐 URL being polled:', error.url || 'Unknown');
      } else {
        console.error('❌ Error during polling:', error);
      }
    } finally {
      setIsPolling(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    setLastUpdated(new Date());
    
    // Temporarily disable polling to prevent JSON parsing errors
    // const intervalId = setInterval(pollAndDetectChanges, 30000); // Poll every 30 seconds
    
    return () => {}; // No cleanup needed when polling is disabled
  }, dependencies);

  return { isPolling, hasChanges, lastUpdated };
}

export default useDatabaseChangeDetection;
