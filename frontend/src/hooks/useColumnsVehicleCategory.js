import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

export function useColumnsVehicleCategory() {
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchVehicleCategories();
    fetchVehicleTypes();
  }, []);

  const fetchVehicleCategories = () => {
    useHttp.get("/vehicle-categories").then((response) => {
      setVehicleCategories(response.data.vehicleCategories || []);
    });
  };

  const fetchVehicleTypes = () => {
    useHttp.get("/vehicle-types").then((response) => {
      setVehicleTypes(response.data.vehicleTypes || []);
    });
  };

  const filteredCar = vehicleCategories.filter(
    (item) => item.vehicle_type_id === 1
  );
  const filteredMotorcycle = vehicleCategories.filter(
    (item) => item.vehicle_type_id === 2
  );
  const filteredTruck = vehicleCategories.filter(
    (item) => item.vehicle_type_id === 3
  );
  const filteredAggregate = vehicleCategories.filter(
    (item) => item.vehicle_type_id === 4
  );

  const handleDelete = async (vehicleCategory) => {
    try {
      const res = await useHttp.delete(
        `/vehicle-categories/${vehicleCategory.id}`
      );
      setVehicleCategories((prev) =>
        prev.filter((item) => item.id !== vehicleCategory.id)
      );
      showSnackbar(res.data.message, "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");

      console.error("Erro ao deletar categoria de veículo:", error);
    }
  };

  const columns = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "vehicle_type_id",
      header: "Tipo de Veículo",
      Cell: ({ cell }) => {
        const type = vehicleTypes.find((t) => t.id === cell.getValue());
        return type ? type.name : "Nenhum";
      },
    },
  ];

  return {
    columns,
    filteredCar,
    filteredMotorcycle,
    filteredTruck,
    filteredAggregate,
    setVehicleCategories,
    handleDelete,
  };
}
