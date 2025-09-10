import { Grid } from "@mui/material";
import PriceCard from "./PriceCard.jsx";

export default function PriceCardsList({
  simulation,
  rangeDetails,
  onEdit,
  toNumber,
  totalAggregatesBasePrice = 0,
  totalAggregatesAccession = 0,
  totalAggregatesFranchiseValue = 0,
}) {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 12 }}>
        <PriceCard
          label="Valor FIPE"
          discountedValue={simulation.fipeValue}
          originalValue={null}
          alwaysGreen
          minHeight={60}
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
        <PriceCard
          label="Taxa de Matrícula"
          discountedValue={
            simulation.discountedAccession != null
              ? toNumber(simulation.discountedAccession) +
                toNumber(totalAggregatesAccession)
              : null
          }
          originalValue={
            simulation.accession != null
              ? toNumber(simulation.accession) +
                toNumber(totalAggregatesAccession)
              : rangeDetails.accession != null
              ? toNumber(rangeDetails.accession) +
                toNumber(totalAggregatesAccession)
              : null
          }
          onEdit={
            simulation.accession != null || rangeDetails.accession != null
              ? () => onEdit("accession")
              : null
          }
          alwaysGreen
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
        <PriceCard
          label="Mensalidade"
          discountedValue={
            simulation.discountedMonthlyFee != null
              ? toNumber(simulation.discountedMonthlyFee) +
                toNumber(simulation.valueSelectedProducts) +
                toNumber(totalAggregatesBasePrice)
              : null
          }
          originalValue={
            simulation.monthlyFee != null
              ? toNumber(simulation.monthlyFee) +
                toNumber(simulation.valueSelectedProducts) +
                toNumber(totalAggregatesBasePrice)
              : rangeDetails.monthlyFee != null
              ? toNumber(rangeDetails.monthlyFee) +
                toNumber(simulation.valueSelectedProducts) +
                toNumber(totalAggregatesBasePrice)
              : null
          }
          onEdit={
            simulation.monthlyFee != null || rangeDetails.monthlyFee != null
              ? () => onEdit("monthlyFee")
              : null
          }
          alwaysGreen
        />
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
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
      </Grid>

      <Grid size={{ xs: 6, md: 6 }}>
        <PriceCard
          label="Cota de Participação"
          discountedValue={
            simulation.franchiseValue != null
              ? simulation.isFranchisePercentage
                ? (simulation.protectedValue || 0) *
                    (simulation.franchiseValue / 100) +
                  toNumber(totalAggregatesFranchiseValue)
                : toNumber(simulation.franchiseValue) +
                  toNumber(totalAggregatesFranchiseValue)
              : rangeDetails.franchiseValue != null
              ? rangeDetails.isFranchisePercentage
                ? (simulation.protectedValue || 0) *
                    (rangeDetails.franchiseValue / 100) +
                  toNumber(totalAggregatesFranchiseValue)
                : toNumber(rangeDetails.franchiseValue) +
                  toNumber(totalAggregatesFranchiseValue)
              : null
          }
          originalValue={null}
          alwaysGreen
        />
      </Grid>
    </Grid>
  );
}
