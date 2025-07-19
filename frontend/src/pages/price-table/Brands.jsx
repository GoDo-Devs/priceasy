import {
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import useHttp from "@/services/useHttp.js";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";

function Brands({ priceTable, setPriceTable }) {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  const fetchBrands = useCallback(() => {
    if (priceTable.vehicle_type_id) {
      setLoadingBrands(true);
      useHttp
        .post("/fipe/brands", { vehicleType: priceTable.vehicle_type_id })
        .then((res) => {
          const options = res.data.brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }));
          setBrands(options);
          setLoadingBrands(false);
          setPriceTable((prev) => {
            const savedBrandIds = (prev.brands || []).map((b) =>
              typeof b === "object" ? Number(b.value) : Number(b)
            );

            const selectedBrands = options.filter((option) =>
              savedBrandIds.includes(Number(option.value))
            );

            return {
              ...prev,
              brands: selectedBrands,
            };
          });
        })
        .catch((err) =>
          console.error("Erro ao carregar marcas do veículo:", err)
        );
    }
  }, [priceTable.vehicle_type_id, setPriceTable]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleBrandsChange = (event) => {
    const selectedValues = event.target.value;

    const selectedBrands = brands.filter((brand) =>
      selectedValues.includes(Number(brand.value))
    );

    setPriceTable((prev) => ({
      ...prev,
      brands: selectedBrands,
    }));
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      setPriceTable({
        ...priceTable,
        brands: brands,
      });
    } else {
      setPriceTable({
        ...priceTable,
        brands: [],
      });
    }
  };
  const brandValues = priceTable.brands.map((b) => Number(b.value));

  const allSelected =
    brands.length > 0 &&
    priceTable.brands.length === brands.length &&
    brands.every((b) => priceTable.brands.some((pb) => pb.value === b.value));

  const isIndeterminate =
    priceTable.brands.length > 0 && priceTable.brands.length < brands.length;

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      {loadingBrands ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="75vh"
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <>
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
            value={brandValues}
            onChange={handleBrandsChange}
            options={brands}
            className="brands-checkbox-grid"
          />
        </>
      )}
    </Box>
  );
}

export default Brands;
