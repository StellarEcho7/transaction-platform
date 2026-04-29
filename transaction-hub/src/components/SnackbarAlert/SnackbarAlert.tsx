import MuiAlert, { AlertProps as MuiAlertProps } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { forwardRef } from "react";

export type AlertProps = MuiAlertProps;

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert {...props} ref={ref} />
));

Alert.displayName = "Alert";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  autoHideDuration?: number;
}

export default function SnackbarAlert({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 6000,
}: SnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
