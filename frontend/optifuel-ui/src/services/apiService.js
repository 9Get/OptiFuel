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

export const getPrediction = (formData) => {
  return apiClient.post("/predict", formData);
};

export const getHistory = () => {
  return apiClient.get("/voyages");
}

export const updateActualConsumption = (historyId, actualConsumption) => {
  return apiClient.put(`/voyages/${historyId}`, { actualConsumption });
}

// const apiService = {
//     getPrediction,
//     getHistory,
//     updateActualConsumption,
// };

// export default apiService;