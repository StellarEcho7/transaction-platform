import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { forwardRef } from "react";

type ButtonProps = MuiButtonProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <MuiButton {...props} ref={ref} />
));

Button.displayName = "Button";

export default Button;
