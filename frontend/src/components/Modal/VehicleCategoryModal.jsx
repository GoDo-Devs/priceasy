import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import useHttp from "@/services/useHttp.js";
import Paper from "@mui/material/Paper";

function VehicleCategoryModal({
  open,
  onClose,
  vehicleCategory = {},
  setVehicleCategory,
  setVehicleCategories,
}) {
  const [vehicleType, setVehicleType] = useState([]);
  useEffect(() => {
    if (open) {
      useHttp
        .get("/vehicle-types")
        .then((res) => setVehicleType(res.data.vehicleTypes))
        .catch((err) =>
          console.error("Erro ao carregar tipos de veículos:", err)
        );
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/vehicle-categories/create/", vehicleCategory);
      console.log("Categoria de veículos criada:", vehicleCategory);
      setVehicleCategories((prev) => [...prev, vehicleCategory]);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar a categoria de veículos:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: {
            textAlign: "justify",
            width: "450px",
            maxWidth: "100%",
            borderRadius: 8,
            p: 2,
          },
        },
      }}
    >
      <DialogContent>
        <Typography variant="h5" mb={3} align="center" gutterBottom>
          {"Criar Categoria"}
        </Typography>
        <TextInput
          label="Nome da Categoria de Veículo"
          name="name"
          className="mb-5"
          value={vehicleCategory.name ?? ""}
          onChange={(e) =>
            setVehicleCategory({ ...vehicleCategory, name: e.target.value })
          }
          required
        ></TextInput>
        <SelectInput
          label="Selecione um Tipo de Veículo"
          name="vehicle_type_id"
          className="mb-5"
          value={vehicleCategory.vehicle_type_id ?? ""}
          onChange={(e) =>
            setVehicleCategory({
              ...vehicleCategory,
              vehicle_type_id: e.target.value,
            })
          }
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!vehicleCategory.name || !vehicleCategory.vehicle_type_id}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehicleCategoryModal;
