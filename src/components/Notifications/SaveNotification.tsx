import { Alert, Snackbar } from "@mui/material";

interface SaveNotificationProps {
  open: boolean;
  onClose: () => void;
}

export default function SaveNotification({
  open,
  onClose,
}: SaveNotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        Saved!
      </Alert>
    </Snackbar>
  );
}
