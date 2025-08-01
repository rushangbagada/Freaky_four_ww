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
      console.error('❌ Error during polling:', error);
    } finally {
      setIsPolling(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    setLastUpdated(new Date());
    
    // Set up polling interval
    const intervalId = setInterval(pollAndDetectChanges, 1000); // Poll every 1 second
    
    return () => clearInterval(intervalId);
  }, dependencies);

  return { isPolling, hasChanges, lastUpdated };
}

export default useDatabaseChangeDetection;
