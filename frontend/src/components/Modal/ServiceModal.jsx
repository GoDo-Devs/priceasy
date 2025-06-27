import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import useHttp from "@/services/useHttp.js";
import Paper from "@mui/material/Paper";

function ServiceModal({ open, service, setService, onClose }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      useHttp
        .get("/categories")
        .then((res) => setCategories(res.data.categories))
        .catch((err) => console.error("Erro ao carregar categorias:", err));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/services/create/", {
        ...service,
      });
      console.log("Serviço criado:", service);
    } catch (error) {
      console.error("Erro ao salvar o seviço:", error);
    }

    onClose();
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
          {"Criar Serviço"}
        </Typography>
        <TextInput
          label="Nome do Serviço"
          name="name"
          className="mb-5"
          value={service.name ?? ""}
          onChange={(e) => setService({ ...service, name: e.target.value })}
          required
        ></TextInput>
        <SelectInput
          label="Selecione um Categoria de Serviços"
          name="category_id"
          className="mb-5"
          value={service.category_id ?? ""}
          onChange={(e) =>
            setService({ ...service, category_id: e.target.value })
          }
          options={[
            ...categories.map((g) => ({
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
          disabled={!service.name || !service.category_id}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceModal;
