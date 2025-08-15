import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useRef } from "react";
import { importRangesFromExcel } from "@/utils/importRangesFromExcel";

function StepperForm({
  steps = [],
  renderStepContent,
  onSubmit,
  drawerWidth = 0,
  onAddItem,
  showAddButton = false,
  priceTable,
  setPriceTable,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importRangesFromExcel(file, setPriceTable, showSnackbar);
      e.target.value = null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!priceTable.name) {
        setError(
          "Insira o nome que deseja utilizar para identificar a tabela de preços"
        );
        return;
      }

      if (!priceTable.category_id) {
        setError(
          "Selecione uma categoria de veículos para identificar a tabela de preços"
        );
        return;
      }
    }
    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px",
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {showAddButton && steps[activeStep] === "Tabela" && (
        <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fileInputRef.current?.click()}
          >
            Importar tabela
          </Button>
        </Box>
      )}

      {error && <Box sx={{ color: "red", mt: 2 }}>{error}</Box>}

      <Box sx={{ mt: 2, mb: 2 }}>{renderStepContent(activeStep)}</Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Voltar
          </Button>
          {showAddButton && steps[activeStep] === "Tabela" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(true)}
              >
                Adicionar Item
              </Button>
              {onAddItem && onAddItem(openModal, () => setOpenModal(false))}
            </>
          )}
        </Box>
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained">
            Avançar
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Salvar tabela
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StepperForm;
