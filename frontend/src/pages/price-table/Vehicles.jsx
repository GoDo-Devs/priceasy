import SidebarLinks from "@/components/DrawerLinks/SideBarLinks.jsx";
import ModelsGroup from "@/components/Models/ModelsGroup.jsx";
import { useEffect, useState, useCallback } from "react";
import useHttp from "@/services/useHttp.js";
import { Box } from "@mui/material";

function Vehicles({ priceTable, setPriceTable }) {
  const brands = priceTable.brands || [];
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loadingModels, setLoadingModels] = useState(false);

  const options = brands.map((brand) => ({
    label: brand.label,
    value: brand.value,
  }));

  const fetchModels = useCallback(() => {
    if (priceTable.vehicle_type_id && selectedBrand) {
      setLoadingModels(true);
      useHttp
        .post("fipe/models", {
          vehicleType: priceTable.vehicle_type_id,
          brandCode: selectedBrand?.value,
        })
        .then((res) => {
          const receivedModels = res.data.models || [];
          setModels(receivedModels);
          setLoadingModels(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar modelos, tentando novamente em 3s:", err);
          setTimeout(fetchModels, 1000);
        });
    }
  }, [priceTable.vehicle_type_id, selectedBrand]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    setSelectedBrand(null);
    setModels([]);
  }, [priceTable.vehicle_type_id]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        padding: 2,
        mt: 5,
        justifyContent: "center",
      }}
    >
      <SidebarLinks options={options} onSelect={setSelectedBrand} />
      <ModelsGroup
        models={models}
        priceTable={priceTable}
        setPriceTable={setPriceTable}
        loading={loadingModels}
      />
    </Box>
  );
}

export default Vehicles;
