import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";
import useHttp from "@/services/useHttp.js";

function PlanModal({ open, onClose }) {
  const [vehicleTypes, setVehicleTypes] = useState({
    all: [],
    selected: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    useHttp
      .get("/vehicle-types")
      .then((res) =>
        setVehicleTypes({
          all: res.data.vehicleTypes,
          selected: [],
        })
      )
      .catch((err) => console.error("Erro ao carregar tipos de veículo:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/adicionar-plano");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { borderRadius: 8, padding: 1.5 } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <CheckBoxInput
            label="Selecione um Tipo de Veículo"
            name="vehicle_type_ids"
            value={vehicleTypes.selected}
            onChange={(e) =>
              setVehicleTypes((prev) => ({
                ...prev,
                selected: e.target.value,
              }))
            }
            options={vehicleTypes.all.map((g) => ({
              value: g.id,
              label: g.name,
            }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Avançar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PlanModal;
