import useHttp from "./useHttp";

export const vehicleTypeService = {
  getById: async (id) => {
    try {
      const response = await useHttp.get(`/vehicle-types/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      throw error;
    }
  },
};

export default vehicleTypeService;
