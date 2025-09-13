import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { useState, useRef } from "react";
import { importRangesFromExcel } from "@/utils/importRangesFromExcel";
import { useSnackbar } from "@/contexts/snackbarContext.jsx"; 

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

  const showSnackbar = useSnackbar(); 

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
        showSnackbar(
          "O nome da tabela é obrigatório.",
          "error"
        );
        return;
      }

      if (!priceTable.category_ids) {
        showSnackbar(
          "A categoria de veículos é obrigatória",
          "error"
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
    <Box padding={3}>
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
    </Box>
  );
}

export default StepperForm;
