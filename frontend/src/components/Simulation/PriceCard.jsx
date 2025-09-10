import { Card, Stack, Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function PriceCard({
  label,
  discountedValue,
  originalValue,
  onEdit,
  alwaysGreen = false,
  minHeight = 110,
}) {
  const toNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const formatBRL = (value) => {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const hasDiscount =
    discountedValue !== null &&
    originalValue !== null &&
    toNumber(originalValue) > toNumber(discountedValue);

  const displayValue =
    discountedValue !== null ? discountedValue : originalValue;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 1.7,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight,
        position: "relative", 
      }}
    >
      <Box>
        <Typography fontSize={11.5} color="text.secondary" fontWeight="medium">
          {label}
        </Typography>
        {hasDiscount ? (
          <>
            <Typography
              fontSize={10}
              color="error"
              sx={{ textDecoration: "line-through", mb: 0.1 }}
            >
              {formatBRL(originalValue)}
            </Typography>
            <Typography color="success.main" fontSize={15} fontWeight="bold">
              {formatBRL(discountedValue)}
            </Typography>
          </>
        ) : (
          <>
            {alwaysGreen ? (
              <Typography
                color="success.main"
                fontSize={15}
                fontWeight="bold"
                mt={0.1}
              >
                {formatBRL(displayValue)}
              </Typography>
            ) : (
              <Typography fontSize={12} fontWeight="bold" mt={0.1}>
                {formatBRL(displayValue)}
              </Typography>
            )}
          </>
        )}
      </Box>
      {onEdit && (
        <IconButton
          size="small"
          onClick={onEdit}
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        >
          <EditIcon fontSize="small" color="primary" />
        </IconButton>
      )}
    </Card>
  );
}
