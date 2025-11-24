import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },

  (error) => {
    console.error("API Error:", error.response || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");

      window.location.href = "/login";
      
      return Promise.reject({
        message: "Session expired. Please log in again.",
      });
    }

    const customError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occured.",
      details: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

export const registerUser = (userData) => {
  return apiClient.post("/auth/register", userData);
};

export const loginUser = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};

export const getPrediction = (formData) => {
  return apiClient.post("/predict", formData);
};

export const createVoyage = (formdata) => {
  return apiClient.post("/voyages/create", formdata);
};

export const getVoyageById = (id) => {
  return apiClient.get(`/voyages/${id}`);
};

export const updateVoyageActual = (id, actualFuelConsumption) => {
  return apiClient.put(`/voyages/${id}`, { actualFuelConsumption });
};

export const getHistory = (queryParams) => {
  const params = new URLSearchParams({
    pageNumber: queryParams.page,
    pageSize: 10,
    sortBy: queryParams.sortBy,
    sortOrder: queryParams.sortOrder,
  });

  return apiClient.get(`/history?${params.toString()}`);
};

// const apiService = {
//     getPrediction,
//     getHistory,
//     updateActualConsumption,
// };

// export default apiService;
