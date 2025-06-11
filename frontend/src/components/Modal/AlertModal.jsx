import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import Paper from "@mui/material/Paper";

function AlertModal({ open, selectedName, onClose, handleDelete }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: {
            textAlign: "justify",
            maxWidth: "36%",
            borderRadius: 8,
            p: 2,
          },
        },
      }}
    >
      {selectedName ? (
        <DialogContent>
          Você realmente deseja excluir o(a) {selectedName} ?
        </DialogContent>
      ) : (
        <DialogContent>
          Você realmente deseja excluir esse intervalo ?
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleDelete} variant="contained" color="primary">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertModal;
