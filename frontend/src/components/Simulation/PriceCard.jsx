import { Card, Stack, Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function PriceCard({
  label,
  discountedValue,
  originalValue,
  onEdit,
  alwaysGreen = false,
  minHeight = 110,
  noBorder = false,
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

  const valueSx = {
    fontFamily: '"Sora", sans-serif',
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.01em",
    lineHeight: 1.15,
  };

  return (
    <Card
      variant={noBorder ? "elevation" : "outlined"}
      sx={{
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight,
        position: "relative",
        transition: "border-color 120ms ease, transform 120ms ease",
        "&:hover": onEdit
          ? { borderColor: "primary.main", transform: "translateY(-1px)" }
          : {},
      }}
    >
      <Box>
        <Typography
          fontSize={11}
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}
        >
          {label}
        </Typography>
        {hasDiscount ? (
          <>
            <Typography
              fontSize={10.5}
              color="text.secondary"
              sx={{ textDecoration: "line-through", mb: 0.2, ...valueSx }}
            >
              {formatBRL(originalValue)}
            </Typography>
            <Typography color="secondary.main" fontSize={19} fontWeight={700} sx={valueSx}>
              {formatBRL(discountedValue)}
            </Typography>
          </>
        ) : (
          <>
            {alwaysGreen ? (
              <Typography
                color="secondary.main"
                fontSize={19}
                fontWeight={700}
                sx={valueSx}
              >
                {formatBRL(displayValue)}
              </Typography>
            ) : (
              <Typography fontSize={17} fontWeight={700} sx={valueSx}>
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
