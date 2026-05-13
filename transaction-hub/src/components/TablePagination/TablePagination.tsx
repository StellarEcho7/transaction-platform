import MuiTablePagination, {
  TablePaginationProps as MuiTablePaginationProps,
} from "@mui/material/TablePagination";
import { forwardRef } from "react";

type TablePaginationProps = MuiTablePaginationProps;

const TablePagination = forwardRef<HTMLTableCellElement, TablePaginationProps>(
  (props, ref) => <MuiTablePagination {...props} ref={ref} />,
);

TablePagination.displayName = "TablePagination";

export default TablePagination;
