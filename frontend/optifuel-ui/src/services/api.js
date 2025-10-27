import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },

  (error) => {
    console.error("API Error:", error.response || error.message);

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

export const predictFuelConsumption = (formData) => {
  return apiClient.post("/predict", formData);
};

const api = {
    predictFuelConsumption,
};

export default api;