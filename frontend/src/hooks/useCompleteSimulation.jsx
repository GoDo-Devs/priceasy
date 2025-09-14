import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";

export function useCompleteSimulation(simulationInitial) {
  const [simulation, setSimulation] = useState(simulationInitial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanDetails() {
      try {
        let simulationPlan = null;
        if (simulationInitial?.plan_id) {
          const planRes = await useHttp.get(
            `/plans/${simulationInitial.plan_id}`
          );
          const planName = planRes.data.name;

          const planServicesRes = await useHttp.get(
            `/plan-services/${simulationInitial.plan_id}`
          );
          const serviceIds = planServicesRes.data.map((ps) => ps.id);

          const servicesRes = await useHttp.get(`/services`);
          const allServices = servicesRes.data.services;

          const filteredServices = allServices.filter((s) =>
            serviceIds.includes(s.id)
          );

          const cobertura = filteredServices
            .filter((s) => s.category_id === 1)
            .map((s) => s.name);
          const assist24 = filteredServices
            .filter((s) => s.category_id === 2)
            .map((s) => s.name);

          simulationPlan = {
            id: simulationInitial.plan_id,
            name: planName,
            cobertura,
            assist24,
          };
        }

        const aggregatesPlans = await Promise.all(
          (simulationInitial.aggregates || []).map(async (agg) => {
            if (!agg.planId) return null;

            try {
              const planRes = await useHttp.get(`/plans/${agg.planId}`);
              const planName = planRes.data.name;

              const planServicesRes = await useHttp.get(
                `/plan-services/${agg.planId}`
              );
              const serviceIds = planServicesRes.data.map((ps) => ps.id);

              const servicesRes = await useHttp.get(`/services`);
              const allServices = servicesRes.data.services;

              const filteredServices = allServices.filter((s) =>
                serviceIds.includes(s.id)
              );

              const cobertura = filteredServices
                .filter((s) => s.category_id === 1)
                .map((s) => s.name);
              const assist24 = filteredServices
                .filter((s) => s.category_id === 2)
                .map((s) => s.name);

              return {
                aggregateId: agg.id,
                plan: {
                  id: agg.planId,
                  name: planName,
                  cobertura,
                  assist24,
                },
              };
            } catch (err) {
              console.error(`Erro ao buscar plano do agregado ${agg.id}:`, err);
              return null;
            }
          })
        );

        const selectedProducts = simulationInitial.selectedProducts || {};
        const productIds = Object.values(selectedProducts);

        const fetchedProducts = await Promise.all(
          productIds.map(async (id) => {
            try {
              const res = await useHttp.get(`/products/${id}`);
              return res.data;
            } catch (err) {
              console.error(`Erro ao buscar produto ${id}:`, err);
              return null;
            }
          })
        );
        const products = fetchedProducts.filter(Boolean);

        const aggregatesWithProducts = await Promise.all(
          (simulationInitial.aggregates || []).map(async (agg) => {
            const selectedIds = Object.values(agg.selectedProducts || {});
            const aggProducts = await Promise.all(
              selectedIds.map(async (id) => {
                try {
                  const res = await useHttp.get(`/products/${id}`);
                  return res.data;
                } catch (err) {
                  console.error(
                    `Erro ao buscar produto ${id} do agregado ${agg.id}`,
                    err
                  );
                  return null;
                }
              })
            );

            return {
              ...agg,
              products: aggProducts.filter(Boolean),
            };
          })
        );

        setSimulation({
          ...simulationInitial,
          plan: simulationPlan,
          aggregates: aggregatesWithProducts,
          aggregatesPlans: aggregatesPlans.filter(Boolean),
          products,
        });
      } catch (err) {
        console.error(
          "Erro geral ao buscar dados da simulação e agregados:",
          err
        );
        setSimulation(simulationInitial);
      } finally {
        setLoading(false);
      }
    }

    fetchPlanDetails();
  }, [simulationInitial]);

  console.log(simulation)

  return { simulation, loading };
}
