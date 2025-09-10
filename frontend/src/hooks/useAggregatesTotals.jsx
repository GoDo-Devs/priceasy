import { useState, useEffect } from "react";

export default function useAggregatesTotals(simulation, priceOptions) {
  const [totalBasePrice, setTotalBasePrice] = useState(0);
  const [totalAccession, setTotalAccession] = useState(0);
  const [totalFranchise, setTotalFranchise] = useState(0);

  const formatFranchise = (rangeDetails, protectedValue) => {
    if (!rangeDetails?.franchiseValue) return 0;
    return rangeDetails.isFranchisePercentage
      ? (rangeDetails.franchiseValue / 100) * protectedValue
      : rangeDetails.franchiseValue;
  };

  useEffect(() => {
    if (!simulation?.aggregates?.length) {
      setTotalBasePrice(0);
      setTotalAccession(0);
      setTotalFranchise(0);
      return;
    }

    let base = 0;
    let accession = 0;
    let franchise = 0;

    simulation.aggregates.forEach((agg) => {
      const option = priceOptions[agg.id];
      if (!option?.rangeDetails) return;

      const protectedValue = agg.value || simulation.protectedValue || 0;

      if (option.plans) {
        base += option.plans.reduce(
          (sum, plan) => sum + (Number(plan.basePrice) || 0),
          0
        );
      }

      accession += Number(option.rangeDetails.accession || 0);
      franchise += formatFranchise(option.rangeDetails, protectedValue);
    });

    setTotalBasePrice(base);
    setTotalAccession(accession);
    setTotalFranchise(franchise);
  }, [simulation?.aggregates, priceOptions, simulation.protectedValue]);

  return { totalBasePrice, totalAccession, totalFranchise };
}
