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
    // Initial fetch with error handling
    const initialFetch = async () => {
      try {
        await fetchData();
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Initial fetch error:', error);
      }
    };
    
    initialFetch();

    // Check if polling is needed based on certain conditions
    if (dependencies && dependencies.length) {
      console.log('Dependencies present, setting up polling');

      // Set up polling for real-time updates with reduced frequency
      console.log('🔄 Setting up polling with 1-minute intervals');
      const intervalId = setInterval(pollAndDetectChanges, 60000); // Poll every 1 minute
      
      return () => {
        if (intervalId) {
          console.log('🛑 Cleaning up polling interval');
          clearInterval(intervalId);
        }
      };
    }
  }, dependencies);

  return { isPolling, hasChanges, lastUpdated };
}

export default useDatabaseChangeDetection;
