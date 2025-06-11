import { useMemo } from "react";

export function useColumnsRanges(priceTable, setPriceTable) {
  const parseNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const columnsRange = useMemo(
    () => [
      {
        accessorKey: "quota",
        header: "Cota",
        muiTableHeadCellProps: {
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          style: { width: "10%" },
        },
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
        muiTableHeadCellProps: {
          style: { width: "25%" },
        },
        muiTableBodyCellProps: {
          style: { width: "25%" },
        },
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
        muiTableHeadCellProps: {
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          style: { width: "10%" },
        },
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
        muiTableHeadCellProps: {
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          style: { width: "10%" },
        },
        Cell: ({ cell }) => {
          const value = parseNumber(cell.getValue());
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "installationPrice",
        header: "Rastreador",
        muiTableHeadCellProps: {
          style: { width: "10%" },
        },
        muiTableBodyCellProps: {
          style: { width: "10%" },
        },
        Cell: ({ cell }) => {
          const value = parseNumber(cell.getValue());
          if (value === 0) {
            return "Não";
          }
          return `Sim (R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })})`;
        },
      },
    ],
    []
  );

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
