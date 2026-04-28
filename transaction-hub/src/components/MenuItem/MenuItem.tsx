import MuiMenuItem, {
  MenuItemProps as MuiMenuItemProps,
} from "@mui/material/MenuItem";
import { forwardRef } from "react";

type MenuItemProps = MuiMenuItemProps;

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => (
  <MuiMenuItem {...props} ref={ref} />
));

MenuItem.displayName = "MenuItem";

export default MenuItem;
