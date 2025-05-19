import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp";

export function useColumnsVehicleType() {
  const [vehiclesType, setVehiclesType] = useState([]);
  const [relations, setRelations] = useState([]);

  useEffect(() => {
    fetchVehicleType();
    fetchProductVehicleType();
  }, []);

  const fetchVehicleType = () => {
    useHttp.get("/vehicle-types").then((response) => {
      setVehiclesType(response.data.vehicleTypes || []);
    });
  };

  const fetchProductVehicleType = () => {
    useHttp.get("/product-vehicle-types").then((response) => {
      setRelations(response.data.data || []);
    });
  };

  const handleDelete = (vehiclesType) => {
    useHttp.delete(`/vehicle-types/${vehiclesType.id}`).then(() => {
      setVehiclesType((prev) => prev.filter((p) => p.id !== vehiclesType.id));
    });
  };

  const columns = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "id",
      header: "Quantidade de Produtos",
      Cell: ({ cell }) => {
        const vehicleTypeId = cell.getValue();
        const count = relations.filter(
          (rel) => rel.vehicle_type_id === vehicleTypeId
        ).length;
        return count > 0 ? count : "Nenhum";
      },
    },
  ];

  return { columns, vehiclesType, handleDelete };
}
