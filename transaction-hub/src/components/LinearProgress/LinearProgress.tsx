import MuiLinearProgress, {
  LinearProgressProps as MuiLinearProgressProps,
} from "@mui/material/LinearProgress";
import { forwardRef } from "react";

type LinearProgressProps = MuiLinearProgressProps;

const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
  (props, ref) => <MuiLinearProgress {...props} ref={ref} />,
);

LinearProgress.displayName = "LinearProgress";

export default LinearProgress;
