import { Box, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";

function Brands({ priceTable, setPriceTable }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (priceTable.vehicle_type_id) {
      useHttp
        .post("/fipe/brands", { vehicleType: priceTable.vehicle_type_id })
        .then((res) => {
          const options = res.data.brands.map((brand) => ({
            value: brand.Value,
            label: brand.Label,
          }));
          setBrands(options);
          setPriceTable((prev) => {
            const currentBrandValues = options.map((b) => Number(b.value));
            const hasInvalidBrands =
              prev.brands?.some((b) => !currentBrandValues.includes(b)) ?? true;

            if (hasInvalidBrands) {
              return { ...prev, brands: [] };
            }

            return prev;
          });
        })
        .catch((err) =>
          console.error("Erro ao carregar marcas do veículo:", err)
        );
    }
  }, [priceTable.vehicle_type_id, setPriceTable]);

  const handleBrandsChange = (event) => {
    setPriceTable({
      ...priceTable,
      brands: event.target.value,
    });
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      const allValues = brands.map((b) => Number(b.value));
      setPriceTable({
        ...priceTable,
        brands: allValues,
      });
    } else {
      setPriceTable({
        ...priceTable,
        brands: [],
      });
    }
  };

  const allSelected =
    brands.length > 0 &&
    priceTable.brands.length === brands.length &&
    brands.every((b) => priceTable.brands.includes(Number(b.value)));

  const isIndeterminate =
    priceTable.brands.length > 0 && priceTable.brands.length < brands.length;

  console.log(priceTable);

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      <FormControlLabel
        control={
          <Checkbox
            checked={allSelected}
            indeterminate={isIndeterminate}
            onChange={handleSelectAllChange}
          />
        }
        label="Selecionar todas"
      />
      <CheckBoxInput
        name="brands"
        value={priceTable.brands || []}
        onChange={handleBrandsChange}
        options={brands}
        className="brands-checkbox-grid"
      />
    </Box>
  );
}

export default Brands;
