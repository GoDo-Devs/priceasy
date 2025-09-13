import useHttp from "./useHttp";

export const priceTableService = {
  getRangeDetailsByAggregate: async (category_id, price) => {
    try {
      const response = await useHttp.post(`/price-tables/aggregate`, {
        category_id: category_id,
        price: price,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching rangeDetails:", error);
      throw error;
    }
  },
};

export default priceTableService;
