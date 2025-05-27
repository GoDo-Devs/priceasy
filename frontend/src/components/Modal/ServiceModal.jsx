import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx"
import useHttp from "@/services/useHttp.js";

function ServiceModal({
  open,
  service,
  setService,
  onClose,
}) {
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
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o seviço:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{sx: {borderRadius: 8, padding: 1.5}}} fullWidth maxWidth="sm">
      <DialogContent>
        <TextInput
          label="Nome do Serviço"
          name="name"
          className="mb-5"
          value={service.name}
          onChange={(e) => setService({ ...service, name: e.target.value })}
          required
        ></TextInput>
        <SelectInput
          label="Selecione um Categoria de Serviços"
          name="category_id"
          className="mb-5"
          onChange={(e) => setService({ ...service, category_id: e.target.value })}
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceModal;
