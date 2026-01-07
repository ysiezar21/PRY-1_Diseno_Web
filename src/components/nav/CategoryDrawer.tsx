import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { languages } from "../../languages/languages";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: string[];
  onPickCategory: (category: string | null) => void;
  lang: "es" | "en";
};

export default function CategoryDrawer({ open, onClose, categories, onPickCategory, lang }: Props) {
  // Protección contra lang undefined o inesperado
  const t = languages[lang || "es"];

  // Función auxiliar para formatear texto (ej: "smart-phones" -> "Smart Phones")
  const pretty = (s: string) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 320 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t.categoryDrawer.title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            {t.categoryDrawer.subtitle}
          </Typography>
        </Box>

        <Divider />

        <List>
          {categories.map((c) => (
            <ListItemButton
              key={c}
              onClick={() => {
                onPickCategory(c);
                onClose();
              }}
            >
              <ListItemText primary={pretty(c)} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
