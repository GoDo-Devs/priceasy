import { useState, useEffect } from "react";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { Box } from "@mui/material";

const vehicleTypeIcons = {
  1: DirectionsCarIcon,
  2: TwoWheelerIcon,
  3: LocalShippingIcon,
  8: AgricultureIcon,
};

const vehicleTypeNames = {
  1: "Carro",
  2: "Moto",
  3: "Caminhão",
  8: "Agregado",
};

export function useColumnsPriceTable() {
  const [priceTables, setPriceTables] = useState([]);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchVehicleCategories();
    fetchPriceTables();
  }, []);

  const fetchPriceTables = () => {
    useHttp.get("/price-tables").then((res) => {
      setPriceTables(res.data.priceTables || []);
    });
  };

  const fetchVehicleCategories = () => {
    useHttp.get("/vehicle-categories").then((response) => {
      setVehicleCategories(response.data.vehicleCategories || []);
    });
  };

  const handleDelete = async (priceTable) => {
    try {
      const res = await useHttp.delete(`/price-tables/${priceTable.id}`);
      setPriceTables((prev) => prev.filter((p) => p.id !== priceTable.id));
      showSnackbar(res.data.message, "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      console.error("Erro ao deletar Tabela de Preço:", error);
      showSnackbar(msg, "error");
    }
  };

  const filteredCar = priceTables.filter((item) => item.vehicle_type_id === 1);
  const filteredMotorcycle = priceTables.filter(
    (item) => item.vehicle_type_id === 2
  );
  const filteredTruck = priceTables.filter(
    (item) => item.vehicle_type_id === 3
  );
  const filteredAggregate = priceTables.filter(
    (item) => item.vehicle_type_id === 8
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
      size: 70,
      Cell: ({ row }) => {
        const { vehicle_type_id, name } = row.original;
        const Icon = vehicleTypeIcons[vehicle_type_id];

        return (
          <Box display="flex" alignItems="center" gap={1}>
            {Icon && (
              <Icon
                fontSize="small"
                color="primary"
                sx={{
                  marginRight: 1,
                }}
              />
            )}
            {name}
          </Box>
        );
      },
    },
    {
      accessorKey: "vehicle_type_id",
      header: "Tipo de Veículo",
      size: 50,
      Cell: ({ cell }) => vehicleTypeNames[cell.getValue()] || "Nenhum",
    },
  ];

  return {
    columns,
    priceTables,
    filteredCar,
    filteredMotorcycle,
    filteredTruck,
    filteredAggregate,
    setPriceTables,
    handleDelete,
  };
}
