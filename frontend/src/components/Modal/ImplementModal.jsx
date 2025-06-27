import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import useHttp from "@/services/useHttp.js";
import Paper from "@mui/material/Paper";

function ImplementModal({
  open,
  onClose,
  implement,
  setImplement,
  setImplementsList,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/implements/create/", implement);
      console.log("Implemento criado:", implement);
      setImplementsList((prev) => [...prev, implement]);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o implemento:", error);
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
          {"Criar Implemento"}
        </Typography>
        <TextInput
          label="Nome do Implemento"
          name="name"
          className="mb-5"
          value={implement.name || ""}
          onChange={(e) => setImplement({ ...implement, name: e.target.value })}
          required
        ></TextInput>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!implement.name}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImplementModal;
