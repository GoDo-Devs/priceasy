import { createContext, useContext, useState, useEffect } from "react";
import priceTableService from "@/services/priceTableService.js";

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [simulation, setSimulation] = useState({});
  const [client, setClient] = useState({});
  const [rangeDetails, setRangeDetails] = useState({});
  const [priceOptions, setPriceOptions] = useState({});

  useEffect(() => {
    if (!simulation?.aggregates?.length) return;

    const fetchAll = async () => {
      try {
        const results = {};
        const updatedAggregates = await Promise.all(
          simulation.aggregates.map(async (agg) => {
            if (!agg?.id || !agg?.value) return agg;

            try {
              const data = await priceTableService.getRangeDetailsByAggregate(
                agg.id,
                agg.value
              );

              const basePrice =
                data.plans?.reduce(
                  (sum, plan) => sum + (Number(plan.basePrice) || 0),
                  0
                ) || 0;

              const franchiseValue = data.rangeDetails.franchiseValue || 0;
              const accession = Number(data.rangeDetails.accession || 0);
              const planId = data.plans?.[0]?.id || 0;

              results[agg.id] = data;

              // Mantém valor manual só internamente
              const finalBasePrice =
                agg._manualBasePrice !== undefined
                  ? agg._manualBasePrice
                  : basePrice;

              return {
                ...agg,
                planId,
                basePrice: finalBasePrice,
                franchiseValue,
                accession,
              };
            } catch (err) {
              console.error(`Erro ao buscar dados do agregado ${agg.id}:`, err);
              return agg;
            }
          })
        );

        const isEqual =
          JSON.stringify(simulation.aggregates) ===
          JSON.stringify(updatedAggregates);

        if (!isEqual) {
          setSimulation((prev) => ({ ...prev, aggregates: updatedAggregates }));
        }

        setPriceOptions(results);
      } catch (err) {
        console.error("Erro ao buscar dados de agregados:", err);
      }
    };

    fetchAll();
  }, [simulation?.aggregates]);

  return (
    <SimulationContext.Provider
      value={{
        simulation,
        setSimulation,
        client,
        setClient,
        rangeDetails,
        setRangeDetails,
        priceOptions,
        setPriceOptions,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}
