import MuiBox, { BoxProps as MuiBoxProps } from "@mui/material/Box";
import { forwardRef } from "react";

type BoxProps = MuiBoxProps;

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <MuiBox {...props} ref={ref} />
));

Box.displayName = "Box";

export default Box;
