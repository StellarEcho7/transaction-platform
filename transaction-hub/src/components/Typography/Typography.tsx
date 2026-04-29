import MuiTypography, {
  TypographyProps as MuiTypographyProps,
} from "@mui/material/Typography";
import { forwardRef } from "react";

type TypographyProps = MuiTypographyProps;

const Typography = forwardRef<HTMLSpanElement, TypographyProps>(
  (props, ref) => <MuiTypography {...props} ref={ref} />,
);

Typography.displayName = "Typography";

export default Typography;
