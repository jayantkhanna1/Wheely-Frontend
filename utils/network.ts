/**
 * Network utility functions for handling offline scenarios
 */

// Function to check if the device is connected to the internet
export async function isNetworkConnected(): Promise<boolean> {
  try {
    // Try to fetch a small amount of data from our API
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout to quickly detect connection issues
      timeout: 5000,
    }).catch(() => null);
    
    return !!response;
  } catch (error) {
    console.log('Network connection check error:', error);
    return false;
  }
}

// Function to handle API requests with offline support
export async function fetchWithOfflineSupport<T>(
  url: string, 
  options: RequestInit = {}, 
  fallbackData?: T,
  retries = 3
): Promise<{ data: T | null; error: Error | null; isOffline: boolean }> {
  let currentRetry = 0;
  
  while (currentRetry < retries) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 10000, // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, error: null, isOffline: false };
    } catch (error) {
      currentRetry++;
      
      // If we've exhausted all retries, return the fallback data
      if (currentRetry >= retries) {
        return { 
          data: fallbackData || null, 
          error: error as Error, 
          isOffline: true 
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry));
    }
  }
  
  // This should never be reached due to the return in the catch block
  return { data: fallbackData || null, error: new Error('Unknown error'), isOffline: true };
}