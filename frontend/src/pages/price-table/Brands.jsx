import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import useHttp from "@/services/useHttp.js";

function Brands({ priceTable, setPriceTable }) {
  const [vehicleCategory, setVehicleCategory] = useState([]);
  useEffect(() => {
    if (open) {
      useHttp
        .get("/vehicle-categories")
        .then((res) => setVehicleCategory(res.data.vehicleCategories))
        .catch((err) =>
          console.error("Erro ao carregar tipos de veículos:", err)
        );
    }
  }, [open]);
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
        options={[
          ...vehicleCategory.map((g) => ({
            value: g.id,
            label: g.name,
          })),
        ]}
      />
    </Box>
  );
}

export default Brands;
