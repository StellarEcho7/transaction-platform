import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import { forwardRef } from "react";

const TextField = forwardRef<HTMLInputElement, MuiTextFieldProps>(
  (props, ref) => <MuiTextField {...props} ref={ref} />,
);

TextField.displayName = "TextField";

export default TextField;
