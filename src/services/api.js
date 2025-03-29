import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting API Request:', request);
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    try {
      // Ensure data is properly formatted
      const signupData = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password
      };

      console.log('Sending signup request:', {
        name: signupData.name,
        email: signupData.email,
        passwordLength: signupData.password.length
      });

      const response = await api.post('/api/auth/register', signupData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Signup API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  login: async (credentials) => {
    try {
      // Ensure data is properly formatted
      const loginData = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password.toString() // Ensure password is a string
      };

      console.log('Sending login request:', {
        email: loginData.email,
        passwordLength: loginData.password.length
      });

      const response = await api.post('/api/auth/login', loginData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData),
};

// Poses API calls
export const posesAPI = {
  getAllPoses: () => api.get('/api/poses'),
  getPose: (id) => api.get(`/api/poses/${id}`),
  createPose: (poseData) => api.post('/api/poses', poseData),
  updatePose: (id, poseData) => api.put(`/api/poses/${id}`, poseData),
  deletePose: (id) => api.delete(`/api/poses/${id}`),
  validatePose: async (selectedPose) => {
    try {
      console.log('Sending pose validation request:', selectedPose);
      const response = await api.post('/api/pose-validation/validate', {
        selectedPose: selectedPose || null
      });
      console.log('Validation response:', response.data);
      return response;
    } catch (error) {
      console.error('Error in pose validation:', error);
      throw error;
    }
  },
  getAvailablePoses: async () => {
    try {
      const response = await api.get('/api/pose-validation/poses');
      console.log('Available poses:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching available poses:', error);
      throw error;
    }
  }
};

// Progress API calls
export const progressAPI = {
  getProgress: () => api.get('/api/progress'),
  getPoseProgress: (poseId) => api.get(`/api/progress/pose/${poseId}`),
  recordProgress: (progressData) => api.post('/api/progress', progressData),
  getStats: () => api.get('/api/progress/stats'),
};

// Add to your existing API services
export const statsAPI = {
  getDashboardStats: () => api.get('/api/stats/dashboard'),
};

export default api; 