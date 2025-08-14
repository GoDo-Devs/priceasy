import {
  Grid,
  Typography,
  Box,
  Pagination,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import QuotationCard from "../components/dashboard/QuotationCard";
import simulationService from "../services/simulationService";

function Home() {
  const [metrics, setMetrics] = useState([
    { title: "Total de Cotações", value: "0" },
    { title: "Cotações do Mês", value: "0" },
    { title: "Valor Médio Protegido", value: "R$ 0,00" },
  ]);

  const [simulations, setSimulations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchMetrics = async () => {
    try {
      const data = await simulationService.getMetrics();
      setMetrics([
        { title: "Total de Cotações", value: data.total.toString() },
        { title: "Cotações do Mês", value: data.monthly.count.toString() },
        {
          title: "Valor Médio Protegido",
          value: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(data.monthly.average),
        },
      ]);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const data = await simulationService.getSimulations(page);
      setSimulations(data.simulations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching simulations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    fetchSimulations();
  }, [page]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Página Inicial
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid size={{ xs: 12, md: 4}} key={index}>
            <MetricCard title={metric.title} value={metric.value} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Cotações
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {simulations.map((simulation) => (
              <Grid size={{ xs: 12, md: 4}} key={simulation.id}>
                <QuotationCard simulation={simulation} />
              </Grid>
            ))}
          </Grid>
          {simulations.length > 0 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}

export default Home;
