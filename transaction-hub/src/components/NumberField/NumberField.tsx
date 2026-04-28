import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

const NumberField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => (
  <TextField type="number" {...props} ref={ref} />
));

NumberField.displayName = "NumberField";

export default NumberField;
