import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";

export function useCompleteSimulation(simulationInitial) {
  const [simulation, setSimulation] = useState(simulationInitial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanDetails() {
      if (!simulationInitial?.plan_id) {
        setLoading(false);
        return;
      }

      try {
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

        const updatedSimulation = {
          ...simulationInitial,
          plan: {
            name: planName,
            cobertura,
            assist24,
          },
          products,
        };
        
        setSimulation(updatedSimulation);
      } catch (err) {
        console.error("Erro geral ao buscar dados do plano e produtos:", err);
        setSimulation(simulationInitial);
      } finally {
        setLoading(false);
      }
    }

    fetchPlanDetails();
  }, [simulationInitial]);

  return { simulation, loading };
}
