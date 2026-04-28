import MuiSelect, { SelectProps as MuiSelectProps } from "@mui/material/Select";
import { forwardRef } from "react";

type SelectProps = MuiSelectProps;

const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => (
  <MuiSelect {...props} ref={ref} />
));

Select.displayName = "Select";

export default Select;
