const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function buildQueryString(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    
    if (Array.isArray(value)) {
      if (value.length > 0) {
        value.forEach(v => query.append(key, v));
      }
    } else {
      query.append(key, value);
    }
  });

  return query.toString();
}

export async function fetchSales(params) {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/sales?${queryString}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch sales');
    }
    
    return result;
  } catch (error) {
    console.error('Fetch sales error:', error);
    throw error;
  }
}
export async function fetchFilterOptions() {
  const url = `${API_BASE_URL}/sales/filters`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch filter options');
    }
    
    return result.data;
  } catch (error) {
    console.error('Fetch filter options error:', error);
    throw error;
  }
}

export async function fetchStatistics(params) {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/sales/statistics?${queryString}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch statistics');
    }
    
    return result.data;
  } catch (error) {
    console.error('Fetch statistics error:', error);
    throw error;
  }
}

export async function fetchAgeRange() {
  const url = `${API_BASE_URL}/sales/age-range`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch age range');
    }
    
    return result.data;
  } catch (error) {
    console.error('Fetch age range error:', error);
    throw error;
  }
}