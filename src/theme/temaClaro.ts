import { createTheme } from "@mui/material/styles";

export const claroTema = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0071dc", // estilo tipo Walmart
    },
    secondary: {
      main: "#ffc220",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});
