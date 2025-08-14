import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";

export function useCompleteSimulation(simulationInitial) {
  const [simulation, setSimulation] = useState(simulationInitial);
  const [rangeDetails, setRangeDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanDetails() {
      if (!simulationInitial?.plan_id) {
        console.warn("Sem plano selecionado ainda.");
        setLoading(false);
        return;
      }

      try {
        // 1. Buscar nome do plano
        const planRes = await useHttp.get(
          `/plans/${simulationInitial.plan_id}`
        );
        const planName = planRes.data.name;

        // 2. Buscar serviços do plano
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

        // 3. Buscar produtos selecionados
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

        // 4. Buscar rangeDetails (valores da tabela de preço)
        let fetchedRangeDetails = {};
        if (simulationInitial.price_table_id && simulationInitial.plan_id) {
          try {
            const payload = {
              price_table_id: Number(simulationInitial.price_table_id),
              model_id: Number(simulationInitial.model_id),
              vehiclePrice: Number(simulationInitial.protectedValue),
            };

            const rangeDetailsRes = await useHttp.post(
              "/price-tables/plans",
              payload
            );
            fetchedRangeDetails = rangeDetailsRes.data.rangeDetails || {};
          } catch (err) {
            console.error("Erro ao buscar rangeDetails:", err);
          }
        }

        // 5. Atualizar simulation com todos os dados
        const updatedSimulation = {
          ...simulationInitial,
          plan: {
            name: planName,
            cobertura,
            assist24,
          },
          products, // ← lista com nome e preço
          implementList: simulationInitial.implementList || [],
        };

        console.log(
          "✅ Simulation atualizado com produtos:",
          updatedSimulation
        );
        setSimulation(updatedSimulation);
        setRangeDetails(fetchedRangeDetails);
      } catch (err) {
        console.error("Erro geral ao buscar dados do plano e produtos:", err);
        setSimulation(simulationInitial);
      } finally {
        setLoading(false);
      }
    }

    fetchPlanDetails();
  }, [simulationInitial]);

  return { simulation, rangeDetails, loading };
}
