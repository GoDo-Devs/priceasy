import {
  InputLabel,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";

function VehicleCategorySelect({
  vehicle_type_id,
  priceTable,
  value,
  onChange,
  className,
  style,
}) {
  const [categories, setCategories] = useState([]);
  const isMultiple = vehicle_type_id === 8;

  useEffect(() => {
    if (!vehicle_type_id) return;
    const priceTableId = priceTable?.id; 

    const fetchCategories = async () => {
      try {
        let res;
        if (priceTableId) {
          res = await useHttp.get(
            `/vehicle-categories/price-table/${priceTableId}`
          );
        } else {
          res = await useHttp.post(`/vehicle-categories/filter`, {
            vehicle_type_id,
          });
        }
        setCategories(res.data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    };

    fetchCategories();
  }, [vehicle_type_id, priceTable?.id]); 

  const handleChange = (event) => {
    if (isMultiple) {
      onChange(event.target.value);
    } else {
      onChange([event.target.value]);
    }
  };

  return (
    <div className={className} style={style}>
      <InputLabel className="text-white mb-1">
        {isMultiple
          ? "Selecione as Categorias de Veículos"
          : "Selecione uma Categoria de Veículo"}
      </InputLabel>
      <TextField
        select
        fullWidth
        size="small"
        value={value || (isMultiple ? [] : [])}
        onChange={handleChange}
        SelectProps={{
          multiple: isMultiple,
          renderValue: (selected) => {
            const selectedNames = categories
              .filter((cat) => selected.includes(cat.id))
              .map((cat) => cat.name);
            return selectedNames.join(", ");
          },
        }}
        variant="outlined"
      >
        {categories.map((cat) => (
          <MenuItem
            key={cat.id}
            value={cat.id}
            sx={{
              py: 0.5,
              minHeight: "32px",
              gap: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {isMultiple && (
              <Checkbox
                checked={value?.includes(cat.id) || false}
                sx={{ p: 0.5, mr: 0.5 }}
              />
            )}
            <ListItemText primary={cat.name} />
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default VehicleCategorySelect;
