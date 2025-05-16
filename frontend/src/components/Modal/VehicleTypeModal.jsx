import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import useHttp from "@/services/useHttp.js";

function VehicleTypeModal({ open, onClose }) {
  const [vehiclesType, setVehiclesType] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/vehicle-types/create/", vehiclesType);
      console.log("Produto criado:", vehiclesType);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <TextInput
          label="Nome do Tipo de Veículo"
          name="name"
          className="mt-5 mb-5"
          value={vehiclesType.name || ""}
          onChange={(e) =>
            setVehiclesType({ ...vehiclesType, name: e.target.value })
          }
          required
        ></TextInput>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehicleTypeModal;
