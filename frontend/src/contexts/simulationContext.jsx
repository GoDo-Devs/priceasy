import { createContext, useContext, useState, useCallback } from "react";

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [simulation, setSimulation] = useState({});
  const [client, setClient] = useState({});
  const [rangeDetails, setRangeDetails] = useState({});

  return (
    <SimulationContext.Provider
      value={{
        simulation,
        setSimulation,
        client,
        setClient,
        rangeDetails,
        setRangeDetails
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}
