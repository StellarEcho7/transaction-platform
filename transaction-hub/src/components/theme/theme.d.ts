import "@mui/material";

declare module "@mui/material" {
  interface Palette {
    success: PaletteColor;
    error: PaletteColor;
    info: PaletteColor;
    warning: PaletteColor;
  }

  interface PaletteColor {
    main: string;
    light: string;
    dark: string;
  }
}