import { useMemo } from "react";

function useGroupedModels(models = []) {
  return useMemo(() => {
    const groups = {};
    const others = [];

    models.forEach((model) => {
      const firstWord = model.Label.trim().split(/\s+/)[0].toLowerCase();
      if (!groups[firstWord]) {
        groups[firstWord] = [];
      }
      groups[firstWord].push(model);
    });

    const grouped = {};

    Object.entries(groups).forEach(([key, groupModels]) => {
      if (groupModels.length > 1) {
        const groupName = groupModels[0].Label.split(" ")[0];
        grouped[groupName] = groupModels;
      } else {
        others.push(...groupModels);
      }
    });

    if (others.length > 0) {
      grouped["Outros"] = others;
    }

    return grouped;
  }, [models]);
}

export default useGroupedModels;
