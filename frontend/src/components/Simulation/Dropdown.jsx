import { useState } from "react";
import {
  Card,
  Stack,
  Box,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Dropdown({ data, simulation }) {
  if (!data || !simulation?.aggregates) return null;

  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (uniqueKey) => {
    setExpandedIds((prev) =>
      prev.includes(uniqueKey)
        ? prev.filter((x) => x !== uniqueKey)
        : [...prev, uniqueKey]
    );
  };

  const formatBRL = (value) => {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatFranchise = (rangeDetails, protectedValue) => {
    if (!rangeDetails?.franchiseValue) return "-";
    return rangeDetails.isFranchisePercentage
      ? (rangeDetails.franchiseValue / 100) * protectedValue
      : rangeDetails.franchiseValue;
  };

  return (
    <>
      {simulation.aggregates.map((agg) => {
        const uniqueKey = `${agg.plate}-${agg.id}`;
        const isExpanded = expandedIds.includes(uniqueKey);
        const protectedValue = agg.value ?? 0;
        const aggData = data[agg.id];

        if (!aggData) return null;

        return (
          <Card
            key={uniqueKey}
            variant="outlined"
            sx={{
              mt: 1.5,
              mb: 1.5,
              borderRadius: 2,
              p: 1.5,
              backgroundColor: "transparent",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={15} color="text.secondary">
                {agg.name} - {agg.plate}
              </Typography>
              <IconButton size="small" onClick={() => toggleExpand(uniqueKey)}>
                <ExpandMoreIcon
                  sx={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.3s",
                  }}
                />
              </IconButton>
            </Stack>
            <Collapse in={isExpanded}>
              <Stack direction="column" spacing={1} mt={1}>
                {aggData.plans?.map((plan) => (
                  <Box key={plan.id}>
                    <Typography fontSize={14} color="text.secondary">
                      Taxa de Matrícula:{" "}
                      <Box component="span" color="secondary.main">
                        {formatBRL(aggData.rangeDetails?.accession)}
                      </Box>
                    </Typography>
                    <Typography fontSize={14} color="text.secondary">
                      Mensalidade:{" "}
                      <Box component="span" color="secondary.main">
                        {formatBRL(plan.basePrice)}
                      </Box>
                    </Typography>
                    <Typography fontSize={14} color="text.secondary">
                      Cota de Participação:{" "}
                      <Box component="span" color="secondary.main">
                        {formatBRL(
                          formatFranchise(aggData.rangeDetails, protectedValue)
                        )}
                      </Box>
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </Card>
        );
      })}
    </>
  );
}
