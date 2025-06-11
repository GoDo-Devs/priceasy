import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";

function StepperForm({
  steps = [],
  renderStepContent,
  onSubmit,
  drawerWidth = 0,
  onAddItem,
  showAddButton = false,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleNext = () => {
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
      <Box sx={{ mt: 4, mb: 2 }}>{renderStepContent(activeStep)}</Box>
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
          {showAddButton && activeStep === 1 && (
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
