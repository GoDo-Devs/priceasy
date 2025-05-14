import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";

function DialogModal({ open, onClose }) {
  const [product, setProduct] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Produto criado:");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <TextInput
          label="Nome do Produto"
          name="name"
          className="mt-5 mb-5"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        ></TextInput>
        <TextInput
          label="Preço"
          name="price"
          className="mb-5"
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
        ></TextInput>
        <TextInput
          label="Grupo do Produto"
          name="name"
          className="mb-5"
          required
        ></TextInput>
        <TextInput
          label="Tipo de Veículo"
          name="name"
          className="mb-5"
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

export default DialogModal;
