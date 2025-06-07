import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  InputLabel,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";

function RangeModal({ open, onClose, priceTable, setPriceTable }) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [accession, setAccession] = useState("");
  const [quota, setQuota] = useState("");
  const [basePrice, setBasePrice] = useState("");

  const handleSubmit = () => {
    const newRange = {
    min: parseFloat(min.replace(",", ".")),
    max: parseFloat(max.replace(",", ".")),
    accession: parseFloat(accession.replace(",", ".")),
    quota: parseFloat(quota.replace(",", ".")),
    basePrice: parseFloat(basePrice.replace(",", ".")),
  };

    setPriceTable((prev) => {
      const updated = {
        ...prev,
        ranges: [...(prev.ranges || []), newRange],
      };

      console.log("Atualizado:", updated);
      return updated;
    });

    setMin("");
    setMax("");
    setAccession("");
    setBasePrice("")
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 8, padding: 2 } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <InputLabel className="text-white mb-1">Intervalo</InputLabel>
        <Box display="flex" gap={2} mb={3}>
          <NumericFormat
            size="small"
            customInput={TextField}
            placeholder="Valor Mínimo"
            value={min}
            onValueChange={(values) => setMin(values.value)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            fullWidth
          />
          <NumericFormat
            size="small"
            customInput={TextField}
            placeholder="Valor Máximo"
            value={max}
            onValueChange={(values) => setMax(values.value)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            fullWidth
          />
        </Box>
        <InputLabel className="text-white mb-1">Cota</InputLabel>
        <Box display="flex" gap={2} mb={3}>
          <NumericFormat
            size="small"
            customInput={TextField}
            value={quota}
            onValueChange={(values) => setQuota(values.value)}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            fullWidth
          />
        </Box>
        <InputLabel className="text-white mb-1">Adesão</InputLabel>
        <Box display="flex" gap={2} mb={3}>
          <NumericFormat
            size="small"
            customInput={TextField}
            value={accession}
            onValueChange={(values) => setAccession(values.value)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            fullWidth
          />
        </Box>
        <InputLabel className="text-white mb-1">
          Preço base da Mensalidade
        </InputLabel>
        <Box display="flex" gap={2} mb={3}>
          <NumericFormat
            size="small"
            customInput={TextField}
            value={basePrice}
            onValueChange={(values) => setBasePrice(values.value)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={!min || !max}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RangeModal;
