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
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

function ServiceModal({ open, service, setService, onClose, setServices }) {
  const [categories, setCategories] = useState([]);
  const showSnackbar = useSnackbar();

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
      if (service.id) {
        const res = await useHttp.patch(`/services/${service.id}`, {
          name: service.name,
          category_id: service.category_id,
        });

        const updatedService = res.data.service ?? {
          ...service,
        };

        setServices((prev) =>
          prev.map((s) => (s.id === updatedService.id ? updatedService : s))
        );

        console.log("Serviço atualizado:", updatedService);
        showSnackbar(res.data.message, "success");
      } else {
        const res = await useHttp.post("/services/create/", {
          name: service.name,
          category_id: service.category_id,
        });

        const newService = res.data.service ?? {
          ...service,
          id: res.data.id,
        };

        setServices((prev) => [...prev, newService]);

        showSnackbar(res.data.message, "success");
        console.log("Serviço criado:", newService);
      }

      onClose();
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
      console.error("Erro ao salvar o serviço:", error);
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
          {service.id ? "Editar Serviço" : "Criar Serviço"}
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
