import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp";

export function useColumnsVehicleCategory() {
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    fetchVehicleCategory();
    fetchVehicleType();
  }, []);

  const fetchVehicleCategory = () => {
    useHttp.get("/vehicle-categories").then((response) => {
      setVehicleCategories(response.data.vehicleCategories || []);
    });
  };

  const fetchVehicleType = () => {
    useHttp.get("/vehicle-types").then((response) => {
      setVehicleTypes(response.data.vehicleTypes || []);
    });
  };

  const filteredCar = vehicleCategories.filter((item) => item.vehicle_type_id === 1);
  const filteredMotorcycle = vehicleCategories.filter((item) => item.vehicle_type_id === 2);
  const filteredTruck = vehicleCategories.filter((item) => item.vehicle_type_id === 3);
  const filteredAggregate = vehicleCategories.filter((item) => item.vehicle_type_id === 4);

  const handleDelete = (vehiclesType) => {
    useHttp.delete(`/vehicle-types/${vehiclesType.id}`).then(() => {
      setVehicleCategories((prev) =>
        prev.filter((p) => p.id !== vehiclesType.id)
      );
    });
  };

  const columns = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "vehicle_type_id",
      header: "Tipo de Veículo",
      Cell: ({ cell }) => {
        const group = vehicleTypes.find((g) => g.id === cell.getValue());
        return group ? group.name : "Nenhum";
      },
    },
  ];

  return { columns, filteredCar, filteredMotorcycle, filteredTruck, filteredAggregate,  handleDelete };
}
