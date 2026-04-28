import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import { forwardRef } from "react";

type CheckboxProps = Omit<MuiCheckboxProps, "disableRipple">;

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => (
  <MuiCheckbox disableRipple {...props} ref={ref} />
));

Checkbox.displayName = "Checkbox";

export default Checkbox;
