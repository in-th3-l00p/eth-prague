/**
 * Utility functions for managing X screen name in localStorage
 */

const X_SCREEN_NAME_KEY = 'x_screen_name';

/**
 * Store X screen name in localStorage
 */
export const setXScreenName = (screenName: string): void => {
  localStorage.setItem(X_SCREEN_NAME_KEY, screenName);
};

/**
 * Retrieve X screen name from localStorage
 */
export const getXScreenName = (): string | null => {
  return localStorage.getItem(X_SCREEN_NAME_KEY);
};

/**
 * Remove X screen name from localStorage
 */
export const clearXScreenName = (): void => {
  localStorage.removeItem(X_SCREEN_NAME_KEY);
};

/**
 * Check if X screen name exists in localStorage
 */
export const hasXScreenName = (): boolean => {
  return getXScreenName() !== null;
};

/**
 * Extract screen name from URL parameters
 */
export const extractScreenNameFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('screenName') || urlParams.get('username') || urlParams.get('x');
}; 