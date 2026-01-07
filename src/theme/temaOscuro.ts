import { createTheme } from "@mui/material/styles";

export const oscuroTema = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4da3ff",
    },
    secondary: {
      main: "#ffc220",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});
