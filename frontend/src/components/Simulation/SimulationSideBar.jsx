import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { Box, Typography, Button, Divider } from "@mui/material";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import { useNavigate } from "react-router-dom";
import SuccessModal from "@/components/Modal/SucessModal";
import ErrorModal from "@/components/Modal/ErrorModal";

function SimulationSideBar() {
  const navigate = useNavigate();
  const { simulation } = useSimulation();
  const { rangeDetails, saveSimulation } = useSimulationEffects();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const formatBRL = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleSave = async () => {
    const success = await saveSimulation();

    if (success === true) {
      setOpenSuccessModal(true);
    } else {
      setErrorMessage(
        typeof success === "string"
          ? success
          : "Ocorreu um erro ao salvar a cotação. Verifique os dados e tente novamente."
      );
      setShowError(true);
    }
  };

  return (
    <Box
      sx={{
        width: "30%",
        height: "auto",
        borderRadius: 2,
        overflowY: "auto",
        backgroundColor: "#1D1420",
        color: "white",
        p: 3,
        fontFamily: "Roboto, sans-serif",
        fontSize: "0.9rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" mb={4} fontWeight="bold" textAlign="center">
          Resumo da Cotação
        </Typography>
        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Valor FIPE
          </Typography>
          <Typography color="secondary.main" fontSize="0.85rem">
            {formatBRL(simulation.fipeValue)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Taxa de Matrícula
          </Typography>
          <Typography color="secondary.main" fontSize="0.85rem">
            {formatBRL(rangeDetails.accession)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Mensalidade
          </Typography>
          <Typography color="secondary.main" fontSize="0.85rem">
            {formatBRL(simulation.monthlyFee)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Rastreador
          </Typography>
          <Typography color="secondary.main" fontSize="0.85rem">
            {formatBRL(rangeDetails.installationPrice)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box mb={1} display="flex" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            Cota de Participação
          </Typography>
          <Typography color="secondary.main" fontSize="0.85rem">
            {rangeDetails.franchiseValue != null
              ? rangeDetails.isFranchisePercentage
                ? formatBRL(
                    (simulation.protectedValue || 0) *
                      (rangeDetails.franchiseValue / 100)
                  )
                : formatBRL(rangeDetails.franchiseValue)
              : "-"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
      </Box>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ alignSelf: "flex-end", mt: 2 }}
        onClick={handleSave}
      >
        Salvar
      </Button>
      {/* <Button
        variant="outlined"
        color="success"
        size="small"
        sx={{ alignSelf: "flex-end", mt: 1 }}
        onClick={() => setOpenSuccessModal(true)}
      >
        Abrir Modal de Sucesso (teste)
      </Button> */}
      <SuccessModal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        onConfirm={() => {
          setOpenSuccessModal(false);
          navigate("/");
        }}
        onDownload={() => {
          alert("Download iniciado (implemente a função).");
        }}
        onSendEmail={() => {
          alert("Função enviar e-mail (implemente a função).");
        }}
        title="Cotação salva com sucesso!"
        message="Você pode baixar o arquivo ou enviar para o e-mail. Ou ir para a tela inicial."
      />
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        title="Erro ao salvar a cotação"
        message={errorMessage}
      />
    </Box>
  );
}

export default SimulationSideBar;
