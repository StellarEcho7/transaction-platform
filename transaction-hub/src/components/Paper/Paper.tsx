import MuiPaper, { PaperProps as MuiPaperProps } from "@mui/material/Paper";
import { forwardRef } from "react";

type PaperProps = MuiPaperProps;

const Paper = forwardRef<HTMLDivElement, PaperProps>((props, ref) => (
  <MuiPaper {...props} ref={ref} />
));

Paper.displayName = "Paper";

export default Paper;