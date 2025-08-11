import { Card, Typography, Box, Divider, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  width: "100%",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out",
  display: "block",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

function QuotationCard({ simulation }) {
  const {
    clients,
    created_at,
    discountedAccession,
    discountedMonthlyFee,
    protectedValue,
    name,
    brand,
    year,
  } = simulation;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <StyledCard elevation={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {clients?.name || "Cliente não informado"}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: { xs: 0.5, sm: 0 } }}
        >
          {formatDate(created_at)}
        </Typography>
      </Box>

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
          {year}
        </Typography>
      </Box>

      <Grid container justifyContent="space-between" spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: "center" }}>
            <Typography color="textSecondary" variant="caption">
              Adesão
            </Typography>
            <Typography fontWeight={700} color="success.main">
              {formatCurrency(discountedAccession)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: "center" }}>
            <Typography color="textSecondary" variant="caption">
              Mensalidade
            </Typography>
            <Typography fontWeight={700} color="info.main">
              {formatCurrency(discountedMonthlyFee)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
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
