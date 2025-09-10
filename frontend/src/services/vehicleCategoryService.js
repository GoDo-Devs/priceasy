import useHttp from "./useHttp";

export const vehicleCategoryService = {
  getAll: async () => {
    try {
      const response = await useHttp.get(`/vehicle-categories/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle categories:", error);
      throw error;
    }
  },

  getVehicleCategoryByIdVehicleTypeId: async (vehicle_type_id) => {
    try {
      const response = await useHttp.get(
        `/vehicle-categories/${vehicle_type_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle categories:", error);
      throw error;
    }
  },
};

export default vehicleCategoryService;
