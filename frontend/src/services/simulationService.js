import useHttp from "./useHttp";

export const simulationService = {
  getSimulations: async (page = 1) => {
    try {
      const response = await useHttp.get(`/simulations?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching simulations:", error);
      throw error;
    }
  },

  getMetrics: async () => {
    try {
      const response = await useHttp.get("/simulations/metrics");
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  },

  getSimulationById: async (id) => {
    try {
      const response = await useHttp.get(`/simulations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching simulation:", error);
      throw error;
    }
  },
};

export default simulationService;
