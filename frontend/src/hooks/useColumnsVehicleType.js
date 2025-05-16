import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp";

export function useColumnsVehicleType() {
  const [vehiclesType, setVehiclesType] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    useHttp.get("/vehicle-types").then((response) => {
      setVehiclesType(response.data.vehicleTypes || []);
    });
  };

  const handleDelete = (vehiclesType) => {
    useHttp.delete(`/vehicle-types/${vehiclesType.id}`).then(() => {
      setVehiclesType((prev) => prev.filter((p) => p.id !== vehiclesType.id));
    });
  };

  const columns = [
    { accessorKey: "name", header: "Nome" }
  ];

  return { columns, vehiclesType, handleDelete };
}
