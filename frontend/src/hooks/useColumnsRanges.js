import { useMemo } from "react";


export function useColumnsRanges(priceTable, setPriceTable) {
  const columnsRange = useMemo(() => [
    {
      accessorKey: "quota",
      header: "Cota",
      Cell: ({ cell }) =>
        `${Number(cell.getValue()).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      accessorKey: "intervalo",
      header: "Intervalo",
      Cell: ({ row }) => {
        const min = row.original.min;
        const max = row.original.max;

        return `R$ ${Number(min).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })} a R$ ${Number(max).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
    {
      accessorKey: "basePrice",
      header: "Preço Base",
      Cell: ({ cell }) =>
        `R$ ${Number(cell.getValue()).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`
    },
    {
      accessorKey: "accession",
      header: "Adesão",
      Cell: ({ cell }) =>
        `R$ ${Number(cell.getValue()).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
    },
  ], []);

  const handleDelete = (rangeToDelete) => {
    setPriceTable((prev) => ({
      ...prev,
      ranges: prev.ranges.filter((r) => r !== rangeToDelete),
    }));
  };

  return { columnsRange, dataRange: priceTable.ranges || [], handleDelete };
}

