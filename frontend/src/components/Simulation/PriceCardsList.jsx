import React from "react";
import { Box } from "@mui/material";
import PriceCard from "./PriceCard.jsx";

export default function PriceCardsList({
  simulation,
  rangeDetails,
  onEdit,
  toNumber,
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <PriceCard
        label="Valor FIPE"
        discountedValue={simulation.fipeValue}
        originalValue={null}
        alwaysGreen
      />
      <PriceCard
        label="Taxa de Matrícula"
        discountedValue={
          simulation.discountedAccession != null
            ? simulation.discountedAccession
            : rangeDetails.accession
        }
        originalValue={
          simulation.accession != null
            ? simulation.accession
            : rangeDetails.accession
        }
        onEdit={
          simulation.accession != null || rangeDetails.accession != null
            ? () => onEdit("accession")
            : null
        }
        alwaysGreen
      />
      <PriceCard
        label="Mensalidade"
        discountedValue={
          simulation.discountedMonthlyFee != null
            ? toNumber(simulation.discountedMonthlyFee) +
              toNumber(simulation.valueSelectedProducts)
            : null
        }
        originalValue={
          simulation.monthlyFee != null
            ? toNumber(simulation.monthlyFee) +
              toNumber(simulation.valueSelectedProducts)
            : rangeDetails.monthlyFee != null
            ? toNumber(rangeDetails.monthlyFee) +
              toNumber(simulation.valueSelectedProducts)
            : null
        }
        onEdit={
          simulation.monthlyFee != null || rangeDetails.monthlyFee != null
            ? () => onEdit("monthlyFee")
            : null
        }
        alwaysGreen
      />
      <PriceCard
        label="Rastreador"
        discountedValue={
          simulation.discountedInstallationPrice != null
            ? simulation.discountedInstallationPrice
            : rangeDetails.installationPrice
        }
        originalValue={
          simulation.installationPrice != null
            ? simulation.installationPrice
            : rangeDetails.installationPrice
        }
        onEdit={
          simulation.installationPrice != null ||
          rangeDetails.installationPrice != null
            ? () => onEdit("installationPrice")
            : null
        }
        alwaysGreen
      />
      <PriceCard
        label="Cota de Participação"d
        discountedValue={
          simulation.franchiseValue != null
            ? simulation.isFranchisePercentage
              ? (simulation.protectedValue || 0) *
                (simulation.franchiseValue / 100)
              : simulation.franchiseValue
            : rangeDetails.franchiseValue != null
            ? rangeDetails.isFranchisePercentage
              ? (simulation.protectedValue || 0) *
                (rangeDetails.franchiseValue / 100)
              : rangeDetails.franchiseValue
            : null
        }
        originalValue={null}
        alwaysGreen
      /> 
    </Box>
  );
}
