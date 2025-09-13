import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import TextInput from "@/components/Form/TextInput.jsx";
import VehicleCategorySelect from "@/components/Form/VehicleCategorySelect.jsx";

function GeneralDataPriceTable({ priceTable, setPriceTable }) {
  const [vehicleCategories, setVehicleCategories] = useState([]);

  useEffect(() => {
    if (!priceTable.id) return;

    useHttp
      .post(`/price-table-categories/price-table`, {
        price_table_id: priceTable.id,
      })
      .then((res) => {
        setVehicleCategories(res.data.categories);
        setPriceTable({
          ...priceTable,
          category_ids: res.data.categories.map((c) => c.id),
        });
      })
      .catch((err) =>
        console.error("Erro ao carregar categorias do veículo:", err)
      );
  }, [priceTable.id]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        padding: 3,
        mt: 3,
        mb: 3,
        justifyContent: "start",
        borderRadius: "15px",
        backgroundColor: "background.paper",
      }}
    >
      <TextInput
        label="Nome da Tabela"
        name="name"
        value={priceTable.name ?? ""}
        onChange={(e) => setPriceTable({ ...priceTable, name: e.target.value })}
        required
        fullWidth
        style={{ width: "70%" }}
      />

      <Box mb={1} sx={{ width: "30%" }}>
        <VehicleCategorySelect
          vehicle_type_id={priceTable.vehicle_type_id}
          priceTable={priceTable}
          options={vehicleCategories}
          value={priceTable.category_ids || []}
          onChange={(val) =>
            setPriceTable({ ...priceTable, category_ids: val })
          }
          style={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
}

export default GeneralDataPriceTable;
