import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

function ImplementTable({ implementList, onAdd }) {
  const isEmpty = !implementList || implementList.length === 0;

  return (
    <Box bgcolor="#1D1420" borderRadius={2} padding={2.5} mt={2}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Implementos
      </Typography>
      {isEmpty ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          mt={1}
          borderRadius={2}
          padding={1.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SubtitlesIcon fontSize="small" sx={{ color: "white" }} />
            <Typography fontStyle="italic" color="text.secondary">
              Nenhum implemento cadastrado.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onAdd}
          >
            Adicionar
          </Button>
        </Box>
      ) : (
        <>
          <Table size="small" sx={{ mt: 1, borderRadius: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Produto
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Valor Protegido
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {implementList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "white" }}>{item.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>R$ {item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={onAdd}
            >
              Adicionar
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ImplementTable;
