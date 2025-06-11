import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";
import useHttp from "@/services/useHttp.js";

function VehicleTypeModal({ open, priceTable, setPriceTable, onClose }) {
  const [vehicleType, setVehicleType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      useHttp
        .get("/vehicle-types")
        .then((res) => setVehicleType(res.data.vehicleTypes))
        .catch((err) => console.error("Erro ao carregar grupos:", err));
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      fullWidth
      maxWidth="sm"
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: { borderRadius: 8, p: 2 },
        },
      }}
    >
      <DialogContent>
        <CheckBoxInput
          label="Selecione um Tipo de Veículo"
          name="vehicle_type_id"
          value={
            priceTable?.vehicle_type_id ? [priceTable.vehicle_type_id] : []
          }
          options={vehicleType.map((g) => ({
            value: Number(g.id),
            label: g.name,
          }))}
          onChange={(event) => {
            const selectedArray = event.target.value;
            const selected = selectedArray.length > 0 ? selectedArray[0] : null;
            setPriceTable((prev) => ({
              ...prev,
              vehicle_type_id: selected,
            }));
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            navigate("/adicionar-tabela", {
              state: { vehicleType: priceTable.vehicle_type_id },
            })
          }
          variant="contained"
          color="secondary"
          disabled={!priceTable?.vehicle_type_id}
        >
          Avançar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehicleTypeModal;
