import { useMemo } from "react";

export function useColumnsRanges(priceTable, setPriceTable) {
  const parseNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const columnsRange = useMemo(() => {
    const commonColumns = [
      {
        accessorKey: "quota",
        header: "Cota",
        size: 10,
        Cell: ({ cell }) => {
          const value = parseNumber(cell.getValue());
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "intervalo",
        header: "Intervalo",
        size: 70,
        Cell: ({ row }) => {
          const min = parseNumber(row.original.min);
          const max = parseNumber(row.original.max);
          return `R$ ${min.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })} a R$ ${max.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "basePrice",
        header: "Preço Base",
        size: 40,
        Cell: ({ cell }) => {
          const value = parseNumber(cell.getValue());
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "accession",
        header: "Adesão",
        size: 50,
        Cell: ({ cell }) => {
          const value = parseNumber(cell.getValue());
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "franchiseValue",
        header: "Cota de Participação",
        size: 50,
        Cell: ({ row }) => {
          const value = parseNumber(row.original.franchiseValue);
          const isPercentage = row.original.isFranchisePercentage;
          if (isPercentage) {
            return `${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}%`;
          }
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
    ];

    const trackerColumn = {
      accessorKey: "installationPrice",
      header: "Rastreador",
      size: 50,
      Cell: ({ cell }) => {
        const value = parseNumber(cell.getValue());
        if (value === 0) return "Não";
        return `Sim (R$ ${value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })})`;
      },
    };

    if (priceTable.vehicle_type_id !== 4) {
      commonColumns.push(trackerColumn);
    }

    return commonColumns;
  }, [priceTable.vehicle_type_id]);

  const handleDelete = (rangeToDelete) => {
    setPriceTable((prev) => ({
      ...prev,
      ranges: prev.ranges.filter((r) => r !== rangeToDelete),
    }));
  };

  return {
    columnsRange,
    dataRange: priceTable.ranges || [],
    handleDelete,
  };
}
