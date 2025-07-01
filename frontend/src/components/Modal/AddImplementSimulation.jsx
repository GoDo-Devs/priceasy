import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  InputLabel,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import SelectInput from "@/components/Form/SelectInput.jsx";
import CurrencyInput from "../Form/CurrencyInput";
import useHttp from "@/services/useHttp.js";

function AddImplementSimulation({
  open,
  onClose,
  simulation,
  setSimulation,
  editingItem = null,
}) {
  const [implementsList, setImplementsList] = useState([]);
  const [selectedImplement, setSelectedImplement] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (open) {
      useHttp
        .get("/implements")
        .then((res) => setImplementsList(res.data.implementsList))
        .catch((err) =>
          console.error("Erro ao carregar tipos de veículos:", err)
        );

      if (editingItem) {
        setSelectedImplement(editingItem.id);
        setPrice(editingItem.price);
      } else {
        setSelectedImplement("");
        setPrice("");
      }
    }
  }, [open, editingItem]);

  const handleSave = () => {
    const implementData = implementsList.find(
      (imp) => imp.id === selectedImplement
    );
    if (!implementData) return;

    const newItem = {
      id: selectedImplement,
      name: implementData.name,
      price,
    };

    const updatedList = editingItem
      ? simulation.implementList.map((item) =>
          item.id === editingItem.id ? newItem : item
        )
      : [...(simulation.implementList ?? []), newItem];

    setSimulation({
      ...simulation,
      implementList: updatedList,
    });

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
            borderRadius: 4,
            p: 2,
          },
        },
      }}
    >
      <DialogContent>
        <Typography variant="h5" mb={3} align="center" gutterBottom>
          {editingItem ? "Editar Implemento" : "Adicionar Implemento"}
        </Typography>
        <SelectInput
          label="Selecione um Implemento"
          name="implements_id"
          className="mb-3"
          value={selectedImplement}
          onChange={(e) => setSelectedImplement(e.target.value)}
          options={implementsList.map((g) => ({
            value: g.id,
            label: g.name,
          }))}
          disabled={!!editingItem}
        />
        <InputLabel className="text-white mb-1">Valor Protegido</InputLabel>
        <CurrencyInput value={price} onChange={setPrice} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="secondary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddImplementSimulation;
