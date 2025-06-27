import { createContext, useContext, useState } from "react";

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [simulation, setSimulation] = useState({});
  const [client, setClient] = useState({});
  const [priceTable, setPriceTable] = useState({});

  return (
    <SimulationContext.Provider
      value={{
        simulation,
        setSimulation,
        client,
        setClient,
        priceTable,
        setPriceTable,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}
