import { useState } from "react";
import { Box, Typography, Button, Divider, Card, Stack } from "@mui/material";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import { useNavigate } from "react-router-dom";
import SuccessModal from "@/components/Modal/SucessModal";
import ErrorModal from "@/components/Modal/ErrorModal";
import { generatePdf } from "@/utils/generatePdf";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { useCompleteSimulation } from "@/hooks/useCompleteSimulation";

function SimulationSideBar() {
  const navigate = useNavigate();
  const { simulation: baseSimulation, client } = useSimulation();
  const { simulation } = useCompleteSimulation(baseSimulation);
  const { rangeDetails, saveSimulation } = useSimulationEffects();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const formatBRL = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  console.log(simulation)

  const handleSave = async () => {
    const success = await saveSimulation(simulation, rangeDetails);

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
   <Card
      elevation={0}
      className="p-4"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" mb={4} fontWeight="bold">
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

        <Stack mb={1} direction="row" justifyContent="space-between">
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
        </Stack>
        <Divider sx={{ mb: 2 }} />
      </Box>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleSave}
        >
          Salvar
        </Button>
      </Box>

      <SuccessModal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        onConfirm={() => {
          setOpenSuccessModal(false);
          navigate("/");
        }}
        onDownload={() => {
          if (!client || !simulation) {
            alert("Dados da simulação ou cliente ausentes!");
            return;
          }
          generatePdf(client, simulation, rangeDetails);
        }}
        onSendEmail={() => alert("Implementar função enviar e-mail")}
        title="Cotação salva com sucesso!"
        message="Você pode baixar o arquivo ou enviar para o e-mail. Ou ir para a tela inicial."
      />

      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        title="Erro ao salvar a cotação"
        message={errorMessage}
      />
    </Card>
  );
}

export default SimulationSideBar;
