import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import useHttp from "@/services/useHttp.js";

function GeneralDataPriceTable({ priceTable, setPriceTable }) {
  const [vehicleCategory, setVehicleCategory] = useState([]);

  useEffect(() => {
    if (priceTable.vehicle_type_id) {
      useHttp
        .get(`/vehicle-categories/${priceTable.vehicle_type_id}`)
        .then((res) => {
          setVehicleCategory(res.data);
        })
        .catch((err) =>
          console.error("Erro ao carregar categorias do veículo:", err)
        );
    }
  }, [priceTable.vehicle_type_id]);

  return (
    <Box display="flex" gap={2} mb={3}>
      <TextInput
        label="Nome da Tabela"
        name="name"
        value={priceTable.name ?? ""}
        onChange={(e) => setPriceTable({ ...priceTable, name: e.target.value })}
        required
        fullWidth
      />
      <SelectInput
        label="Selecione uma Categoria de Veículos"
        name="category_id"
        className="mb-5"
        value={priceTable.category_id ?? ""}
        onChange={(e) =>
          setPriceTable({
            ...priceTable,
            category_id: e.target.value,
          })
        }
        options={vehicleCategory.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
      />
    </Box>
  );
}

export default GeneralDataPriceTable;
