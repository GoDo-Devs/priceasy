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
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

function VehicleCategoryModal({
  open,
  onClose,
  vehicleCategory,
  setVehicleCategory,
  setVehicleCategories,
}) {
  const [vehicleType, setVehicleType] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (open) {
      useHttp
        .get("/vehicle-types/default")
        .then((res) => setVehicleType(res.data.vehicleTypes || []))
        .catch((err) =>
          console.error("Erro ao carregar tipos de veículos:", err)
        );
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: vehicleCategory.name,
      vehicle_type_id: vehicleCategory.vehicle_type_id,
      fipeCode: vehicleCategory.fipeCode,
    };

    try {
      if (vehicleCategory.id) {
        const res = await useHttp.patch(
          `/vehicle-categories/${vehicleCategory.id}`,
          payload
        );

        setVehicleCategories((prev) =>
          prev.map((p) =>
            p.id === vehicleCategory.id ? { ...p, ...payload } : p
          )
        );

        showSnackbar(res.data.message, "success");
      } else {
        const res = await useHttp.post("/vehicle-categories/create", payload);
        const newVehicleCategory =
          res.data.categoryVehicle || res.data.vehicleCategories?.[0];

        if (newVehicleCategory) {
          setVehicleCategories((prev) => [...prev, newVehicleCategory]);
        }
        showSnackbar(res.data.message, "success");
      }

      onClose();
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
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
          {vehicleCategory.id ? "Editar Categoria" : "Criar Categoria"}
        </Typography>
        <TextInput
          label="Nome da Categoria de Veículo"
          name="name"
          className="mb-5"
          value={vehicleCategory.name || ""}
          onChange={(e) =>
            setVehicleCategory({ ...vehicleCategory, name: e.target.value })
          }
          required
        />
        <SelectInput
          label="Selecione um Tipo de Veículo"
          name="vehicle_type_id"
          className="mb-5"
          value={vehicleCategory.vehicle_type_id || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedType = vehicleType.find((t) => t.id === selectedId);

            setVehicleCategory({
              ...vehicleCategory,
              vehicle_type_id: selectedId,
              fipeCode: selectedType?.fipeCode || null, 
            });
          }}
          options={vehicleType.map((g) => ({
            value: g.id,
            label: g.name,
          }))}
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
