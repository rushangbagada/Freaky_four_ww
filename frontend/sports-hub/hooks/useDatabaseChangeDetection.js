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
    // Silent polling - no visual indicators
    try {
      await fetchData();
      const now = new Date();
      setLastUpdated(now);
      // No visual changes indicator - just update data silently
    } catch (error) {
      // Silent error handling - only log to console for debugging
      console.error('Polling error:', error.message);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    setLastUpdated(new Date());
    
    // Set up polling for real-time updates
    console.log('🔄 Setting up polling with 1-second intervals');
    const intervalId = setInterval(pollAndDetectChanges, 1000); // Poll every 1 second
    
    return () => {
      if (intervalId) {
        console.log('🛑 Cleaning up polling interval');
        clearInterval(intervalId);
      }
    };
  }, dependencies);

  return { isPolling, hasChanges, lastUpdated };
}

export default useDatabaseChangeDetection;
