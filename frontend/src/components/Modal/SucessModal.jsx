import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";

export default function SuccessModal({
  open,
  onClose,
  onConfirm,
  onDownload,
  onSendEmail,
  title = "Sucesso!",
  message = "Operação realizada com sucesso.",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: { borderRadius: 8, p: 2 },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          {message}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            mb: 2,
            cursor: "pointer",
            "&:hover": { backgroundColor: "action.hover" },
          }}
          onClick={onDownload}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDownload();
            }
          }}
        >
          <DownloadIcon color="primary" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Download da cotação em PDF
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clique para baixar o arquivo
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            cursor: "pointer",
            "&:hover": { backgroundColor: "action.hover" },
          }}
          onClick={onSendEmail}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSendEmail();
            }
          }}
        >
          <EmailIcon color="primary" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Enviar cotação para e-mail
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Receba sua cotação diretamente no seu e-mail
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<HomeIcon />}
          onClick={onConfirm}
        >
          Ir para a tela Inicial
        </Button>
      </DialogActions>
    </Dialog>
  );
}
