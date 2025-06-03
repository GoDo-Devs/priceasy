import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import useHttp from "@/services/useHttp.js";

function VehicleCategoryModal({
  open,
  onClose,
  vehicleCategory,
  setVehicleCategory,
}) {
  const [vehicleType, setVehicleType] = useState([]);
  useEffect(() => {
    if (open) {
      useHttp
        .get("/vehicle-types")
        .then((res) => setVehicleType(res.data.vehicleTypes))
        .catch((err) => console.error("Erro ao carregar tipos de veículos:", err));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/vehicle-categories/create/", vehicleCategory);
      console.log("Categoria de veículos criada:", vehicleCategory);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar a categoria de veículos:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 8, padding: 2 } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <TextInput
          label="Nome da Categoria de Veículos"
          name="name"
          className="mb-5"
          value={vehicleCategory.name || ""}
          onChange={(e) =>
            setVehicleCategory({ ...vehicleCategory, name: e.target.value })
          }
          required
        ></TextInput>
        <SelectInput
          label="Selecione um Tipo de Veículo"
          name="vehicle_type_id"
          className="mb-5"
          value={vehicleCategory.vehicle_type_id}
          onChange={(e) => setVehicleCategory({ ...vehicleCategory, vehicle_type_id: e.target.value })}
          options={[
            ...vehicleType.map((g) => ({
              value: g.id,
              label: g.name,
            })),
          ]}
        />
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

export default VehicleCategoryModal;
