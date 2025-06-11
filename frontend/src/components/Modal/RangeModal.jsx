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
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import SelectInput from "@/components/Form/SelectInput.jsx";
import Paper from "@mui/material/Paper";

function RangeModal({
  open,
  onClose,
  priceTable,
  setPriceTable,
  editingRange,
  editingIndex,
}) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [accession, setAccession] = useState("");
  const [quota, setQuota] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [trackerValue, setTrackerValue] = useState("");
  const [installationPrice, setInstallationPrice] = useState("");
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  useEffect(() => {
    if (editingRange) {
      setMin(editingRange.min?.toString().replace(".", ",") || "");
      setMax(editingRange.max?.toString().replace(".", ",") || "");
      setAccession(editingRange.accession?.toString().replace(".", ",") || "");
      setQuota(editingRange.quota?.toString().replace(".", ",") || "");
      setBasePrice(editingRange.basePrice?.toString().replace(".", ",") || "");
      setTrackerValue(editingRange.installationPrice !== null ? "Sim" : "Não");
      setInstallationPrice(
        editingRange.installationPrice?.toString().replace(".", ",") || ""
      );
      setShowNewGroupInput(editingRange.installationPrice !== null);
    } else {
      setMin("");
      setMax("");
      setAccession("");
      setQuota("");
      setBasePrice("");
      setTrackerValue("");
      setInstallationPrice("");
      setShowNewGroupInput(false);
    }
  }, [editingRange, open]);

  const handleTrackerChange = (e) => {
    const selected = e.target.value;
    setTrackerValue(selected);
    setShowNewGroupInput(selected === "Sim");
  };

  const handleSubmit = () => {
    const newRange = {
      min: parseFloat(min.replace(",", ".")),
      max: parseFloat(max.replace(",", ".")),
      accession: parseFloat(accession.replace(",", ".")),
      quota: parseFloat(quota.replace(",", ".")),
      basePrice: parseFloat(basePrice.replace(",", ".")),
      installationPrice: showNewGroupInput
        ? parseFloat(installationPrice.replace(",", "."))
        : null,
    };

    setPriceTable((prev) => {
      const updatedRanges = [...(prev.ranges || [])];
      if (typeof editingIndex === "number") {
        updatedRanges[editingIndex] = newRange;
      } else {
        updatedRanges.push(newRange);
      }

      const updated = {
        ...prev,
        ranges: updatedRanges,
      };

      console.log("Atualizado:", updated);
      return updated;
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: { borderRadius: 8, p: 2 },
        },
      }}
    >
      <DialogContent>
        <InputLabel className="text-white mb-1">Intervalo</InputLabel>
        <Box display="flex" gap={2} mb={2}>
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
        <Box display="flex" gap={2} mb={2}>
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
        <Box display="flex" gap={2} mb={2}>
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
        <Box display="flex" gap={2} mb={2}>
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
        <InputLabel className="text-white mb-1">
          Rastreador Obrigatório/Incluído
        </InputLabel>
        <SelectInput
          name="tracker"
          className="mb-3"
          value={trackerValue}
          onChange={handleTrackerChange}
          options={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
        />
        {showNewGroupInput && (
          <>
            <InputLabel className="text-white mb-1">
              Preço base da Instalação
            </InputLabel>
            <Box display="flex" gap={2} mb={2}>
              <NumericFormat
                size="small"
                customInput={TextField}
                value={installationPrice}
                onValueChange={(values) => setInstallationPrice(values.value)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                fullWidth
              />
            </Box>
          </>
        )}
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
