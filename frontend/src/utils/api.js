const API_BASE_URL = 'http://localhost:4000';

export const updateUserPreferences = async (userId, preferences) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      // If backend is not running, use localStorage as fallback
      console.warn('Backend not available, using localStorage fallback');
      const existingPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      const updatedPrefs = { ...existingPrefs, ...preferences };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      return { message: 'Preferences saved locally', preferences: updatedPrefs };
    }

    // Check if response has content before parsing
    const text = await response.text();
    if (!text || text.trim() === '') {
      // Empty response, save to localStorage and return success
      const existingPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      const updatedPrefs = { ...existingPrefs, ...preferences };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      return { message: 'Preferences saved', preferences: updatedPrefs };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error updating preferences, using localStorage fallback:', error);
    // Fallback to localStorage when backend is not available
    const existingPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const updatedPrefs = { ...existingPrefs, ...preferences };
    localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    return { message: 'Preferences saved locally', preferences: updatedPrefs };
  }
};

export const getUserPreferences = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}/preferences`);

    if (!response.ok) {
      // If backend is not running, use localStorage as fallback
      console.warn('Backend not available, using localStorage fallback');
      const storedPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      return {
        dietary: storedPrefs.dietary || { diets: [], excludeIngredients: [] },
        cuisines: storedPrefs.cuisines || { like: [], dislike: [] }
      };
    }

    // Check if response has content before parsing
    const text = await response.text();
    if (!text || text.trim() === '') {
      // Empty response, return default structure
      const storedPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      return {
        dietary: storedPrefs.dietary || { diets: [], excludeIngredients: [] },
        cuisines: storedPrefs.cuisines || { like: [], dislike: [] }
      };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching preferences, using localStorage fallback:', error);
    // Fallback to localStorage when backend is not available
    const storedPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return {
      dietary: storedPrefs.dietary || { diets: [], excludeIngredients: [] },
      cuisines: storedPrefs.cuisines || { like: [], dislike: [] }
    };
  }
};