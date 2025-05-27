import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

function AlertModal({
  open,
  selectedName,
  onClose,
  handleDelete
}) {

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{sx: {borderRadius: 8, padding: 1.5}}} fullWidth maxWidth="xs">
      <DialogContent>Você realmente deseja excluir o(a) {selectedName} ?</DialogContent>
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
