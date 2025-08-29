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
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

function ImplementModal({
  open,
  onClose,
  implement,
  setImplement,
  setImplementsList,
}) {
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (implement.id) {
        const res = await useHttp.patch(`/implements/${implement.id}`, {
          name: implement.name.trim(),
        });

        setImplementsList((prev) =>
          prev.map((i) =>
            i.id === implement.id ? { ...i, name: implement.name.trim() } : i
          )
        );

        showSnackbar(
          res.data.message || "Implemento atualizado com sucesso!",
          "success"
        );
      } else {
        const res = await useHttp.post("/implements/create", {
          name: implement.name.trim(),
        });

        const newImplement = res.data.implement || res.data.implementsList?.[0];

        if (newImplement) {
          setImplementsList((prev) => [...prev, newImplement]);
        }

        showSnackbar(res.data.message, "success");
      }

      onClose();
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
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
          {implement.id ? "Editar Implemento" : "Criar Implemento"}
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
