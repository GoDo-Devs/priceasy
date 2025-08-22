import { Card, Typography, Box, Divider, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  width: "100%",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out",
  display: "flex",
  flexDirection: "column", 
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

function QuotationCard({ simulation }) {
  const {
    client,
    created_at,
    discountedAccession,
    discountedMonthlyFee,
    protectedValue,
    name,
    brand_id,
    year,
  } = simulation;

  const navigate = useNavigate();
  const [brand, setBrand] = useState();

  useEffect(() => {
    if (!brand_id) return;
    useHttp
      .post("/fipe/brand-name", { id: brand_id })
      .then((res) => setBrand(res.data.name))
      .catch(() => setBrand("Marca não encontrada"));
  }, [brand_id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleClick = () => {
    navigate(`/cotacao/?id=${simulation.id}`);
  };

  return (
    <StyledCard elevation={3} onClick={handleClick} sx={{ cursor: "pointer" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {client?.name || "Cliente não informado"}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: { xs: 0.5, sm: 0 } }}
          >
            {formatDate(created_at)}
          </Typography>
        </Box>

        {!brand && !name && !year ? (
          <Typography
            variant="body1"
            fontWeight={500}
            color="text.secondary"
            sx={{ my: 2 }}
          >
            Agregado
          </Typography>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <Typography variant="body1" fontWeight={500} color="text.secondary">
              {brand}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {name}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {year === 32000 ? "Zero KM" : year}
            </Typography>
          </Box>
        )}
      </Box>

      <Grid container justifyContent="space-between" spacing={2} sx={{ mt: 1 }}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography color="textSecondary" variant="caption">
              Adesão
            </Typography>
            <Typography fontWeight={700} color="success.main">
              {formatCurrency(discountedAccession ?? simulation.accession)}
            </Typography>
          </Box>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography color="textSecondary" variant="caption">
              Mensalidade
            </Typography>
            <Typography fontWeight={700} color="info.main">
              {formatCurrency(discountedMonthlyFee ?? simulation.monthlyFee)}
            </Typography>
          </Box>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography color="textSecondary" variant="caption">
              Valor Protegido
            </Typography>
            <Typography fontWeight={700} color="warning.main">
              {formatCurrency(protectedValue)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </StyledCard>
  );
}

export default QuotationCard;
