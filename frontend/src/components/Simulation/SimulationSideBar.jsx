import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { Box, Typography, Button, Divider } from "@mui/material";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import { useNavigate } from "react-router-dom";

function SimulationSideBar() {
  const navigate = useNavigate();
  const { simulation } = useSimulation();
  const { rangeDetails, saveSimulation } = useSimulationEffects();

  const formatBRL = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleSave = async () => {
    await saveSimulation();
    navigate("/");
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
    </Box>
  );
}

export default SimulationSideBar;
