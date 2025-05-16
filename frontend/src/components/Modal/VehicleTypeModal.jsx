import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import useHttp from "@/services/useHttp.js";

function VehicleTypeModal({ open, onClose, vehicleType, setVehicleType}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/vehicle-types/create/", vehicleType);
      console.log("Produto criado:", vehicleType);
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
          value={vehicleType.name || ""}
          onChange={(e) =>
            setVehicleType({ ...vehicleType, name: e.target.value })
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
