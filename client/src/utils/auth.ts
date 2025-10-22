/**
 * Authentication Utility Functions
 * Centralized logic for checking user authentication status
 */

/**
 * Checks if a user is currently authenticated
 * @returns boolean - true if user has valid token and user data in localStorage
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

/**
 * Gets the current user from localStorage
 * @returns User object or null if not authenticated
 */
export const getCurrentUserFromStorage = (): any | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Gets the authentication token from localStorage
 * @returns token string or null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Clears authentication data from localStorage
 * Used for logout functionality
 */
export const clearAuth = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
