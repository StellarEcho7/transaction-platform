import MuiDivider, { DividerProps as MuiDividerProps } from "@mui/material/Divider";
import { forwardRef } from "react";

type DividerProps = MuiDividerProps;

const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => (
  <MuiDivider {...props} ref={ref} />
));

Divider.displayName = "Divider";

export default Divider;