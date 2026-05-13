import MuiAlert, { AlertProps as MuiAlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";

type AlertProps = MuiAlertProps;

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert {...props} ref={ref} />
));

Alert.displayName = "Alert";

export default Alert;
