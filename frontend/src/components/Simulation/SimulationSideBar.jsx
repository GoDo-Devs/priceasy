import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { Box, Typography, Divider } from "@mui/material";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";

function SimulationSideBar() {
  const { simulation } = useSimulation();
  const { rangeDetails, products } = useSimulationEffects();

  const formatBRL = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <Box
      sx={{
        width: "30%",
        minHeight: "auto",
        borderRadius: 2,
        overflowY: "auto",
        backgroundColor: "#1D1420",
        color: "white",
        p: 3,
        fontFamily: "Roboto, sans-serif",
        fontSize: "0.9rem",
      }}
    >
      <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
        Resumo da Cotação
      </Typography>
      <Box mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Valor FIPE
        </Typography>
        <Typography color="secondary.main">
          {formatBRL(simulation.fipeValue)}
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Taxa de Matrícula
        </Typography>
        <Typography color="secondary.main">
          {formatBRL(rangeDetails.accession)}
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Mensalidade
        </Typography>
        <Typography color="secondary.main">
          {formatBRL(simulation.monthlyFee)}
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Rastreador
        </Typography>
        <Typography color="secondary.main">
          {formatBRL(rangeDetails.installationPrice)}
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Cota de Participação
        </Typography>
        <Typography color="secondary.main">
          {rangeDetails.quota != null
            ? `% ${rangeDetails.quota.toFixed(2).replace(".", ",")}`
            : "-"}
        </Typography>
      </Box>
    </Box>
  );
}

export default SimulationSideBar;
