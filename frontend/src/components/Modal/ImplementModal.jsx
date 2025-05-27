import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import useHttp from "@/services/useHttp.js";

function ImplementModal({ open, onClose, implement, setImplement}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/implements/create/", implement);
      console.log("Implemento criado:", implement);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o implemento:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}  PaperProps={{sx: {borderRadius: 8, padding: 2}}} fullWidth maxWidth="sm">
      <DialogContent>
        <TextInput
          label="Nome do Implemento"
          name="name"
          className="mb-5"
          value={implement.name || ""}
          onChange={(e) =>
            setImplement({ ...implement, name: e.target.value })
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

export default ImplementModal;
