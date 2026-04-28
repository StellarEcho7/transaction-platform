export interface NumberFieldProps {
  value?: number | string;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
}
