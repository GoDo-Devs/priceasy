import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  InputLabel,
  Paper,
} from "@mui/material";
import CurrencyInput from "@/components/Form/CurrencyInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";

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
  const [franchiseValue, setFranchiseValue] = useState("");
  const [isFranchisePercentage, setIsFranchisePercentage] = useState(false);
  const [rangeError, setRangeError] = useState("");

  useEffect(() => {
    const safeValue = (v) => (v !== undefined && v !== null ? v : "");

    if (editingRange) {
      setMin(safeValue(editingRange.min));
      setMax(safeValue(editingRange.max));
      setAccession(safeValue(editingRange.accession));
      setQuota(safeValue(editingRange.quota));
      setBasePrice(safeValue(editingRange.basePrice));
      const hasTracker =
        editingRange.installationPrice !== undefined &&
        editingRange.installationPrice !== null;
      setTrackerValue(hasTracker ? "Sim" : "Não");
      setInstallationPrice(hasTracker ? editingRange.installationPrice : "");
      setShowNewGroupInput(hasTracker);
      setFranchiseValue(safeValue(editingRange.franchiseValue));
      setIsFranchisePercentage(editingRange.isFranchisePercentage || false);
    } else {
      setMin("");
      setMax("");
      setAccession("");
      setQuota("");
      setBasePrice("");
      setTrackerValue("");
      setInstallationPrice("");
      setShowNewGroupInput(false);
      setFranchiseValue("");
      setIsFranchisePercentage(false);
    }
  }, [editingRange, open]);

  const handleTrackerChange = (e) => {
    const selected = e.target.value;
    setTrackerValue(selected);
    const isYes = selected === "Sim";
    setShowNewGroupInput(isYes);
    if (!isYes) {
      setInstallationPrice("");
    }
  };

  const handleSubmit = () => {
    const minValue = Number(min);
    const maxValue = Number(max);

    if (minValue >= maxValue) {
      setRangeError("O valor mínimo deve ser menor que o valor máximo");
      return;
    }

    const hasConflict = (priceTable.ranges || []).some((range, index) => {
      if (typeof editingIndex === "number" && index === editingIndex)
        return false;
      return minValue <= Number(range.max) && maxValue >= Number(range.min);
    });

    if (hasConflict) {
      setRangeError(
        "Verifique se o intervalo não está em conflito com outro intervalo"
      );
      return;
    }

    setRangeError("");

    const toNumberOrUndefined = (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value);

    const previousRange =
      typeof editingIndex === "number"
        ? (priceTable.ranges || [])[editingIndex] || {}
        : {};

    const newRange = {
      ...previousRange, 
      min: minValue,
      max: maxValue,
      accession: toNumberOrUndefined(accession),
      quota: toNumberOrUndefined(quota),
      basePrice: toNumberOrUndefined(basePrice),
      installationPrice: showNewGroupInput
        ? toNumberOrUndefined(installationPrice)
        : undefined,
      franchiseValue: toNumberOrUndefined(franchiseValue),
      isFranchisePercentage,
    };

    setPriceTable((prev) => {
      const updatedRanges = [...(prev.ranges || [])];
      if (typeof editingIndex === "number") {
        updatedRanges[editingIndex] = newRange;
      } else {
        updatedRanges.push(newRange);
      }

      return { ...prev, ranges: updatedRanges };
    });

    onClose();
  };

  const handleClose = () => {
    setRangeError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slots={{ paper: Paper }}
      slotProps={{ paper: { sx: { borderRadius: 8, p: 2 } } }}
    >
      <DialogContent>
        {rangeError && (
          <Box
            sx={{ textAlign: "center" }}
            mb={2}
            color="error.main"
            fontSize={14}
          >
            {rangeError}
          </Box>
        )}
        <InputLabel className="text-white">Intervalo</InputLabel>
        <Box display="flex" gap={2} mb={2}>
          <CurrencyInput
            placeholder="Valor Mínimo"
            value={min}
            onChange={setMin}
          />
          <CurrencyInput
            placeholder="Valor Máximo"
            value={max}
            onChange={setMax}
          />
        </Box>
        <InputLabel className="text-white">Cota</InputLabel>
        <Box display="flex" gap={2} mb={2}>
          <CurrencyInput value={quota} onChange={setQuota} prefix="" />
        </Box>
        <InputLabel className="text-white">Adesão</InputLabel>
        <Box display="flex" gap={2} mb={2}>
          <CurrencyInput value={accession} onChange={setAccession} />
        </Box>
        <InputLabel className="text-white">
          Preço base da Mensalidade
        </InputLabel>
        <Box display="flex" gap={2} mb={2}>
          <CurrencyInput value={basePrice} onChange={setBasePrice} />
        </Box>
        {priceTable?.vehicle_type_id !== 4 && (
          <>
            <InputLabel className="text-white">
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
                <InputLabel className="text-white">
                  Preço base da Instalação
                </InputLabel>
                <Box display="flex" gap={2} mb={2}>
                  <CurrencyInput
                    value={installationPrice}
                    onChange={setInstallationPrice}
                  />
                </Box>
              </>
            )}
          </>
        )}
        <InputLabel className="text-white ">Valor da Franquia</InputLabel>
        <Box display="flex" gap={1} mb={1}>
          <Button
            variant={isFranchisePercentage ? "outlined" : "contained"}
            color="secondary"
            onClick={() => setIsFranchisePercentage(false)}
            size="small"
          >
            R$
          </Button>
          <Button
            variant={isFranchisePercentage ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setIsFranchisePercentage(true)}
            size="small"
          >
            %
          </Button>
        </Box>
        <Box display="flex">
          <CurrencyInput
            value={franchiseValue}
            onChange={setFranchiseValue}
            prefix={isFranchisePercentage ? "" : "R$ "}
            suffix={isFranchisePercentage ? "%" : ""}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="secondary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RangeModal;
