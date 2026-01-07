import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

// Props recibidas para controlar la visibilidad y la selección
type Props = {
  open: boolean;
  onClose: () => void;
  categories: string[];
  onPickCategory: (category: string | null) => void;
};

export default function CategoryDrawer({ open, onClose, categories, onPickCategory }: Props) {
  // Función auxiliar para formatear texto (ej: "smart-phones" -> "Smart Phones")
  const pretty = (s: string) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    // Componente lateral (Drawer) que se despliega desde la izquierda
    <Drawer anchor="left" open={open} onClose={onClose}>
      
      {/* Contenedor con ancho fijo para el menú */}
      <Box sx={{ width: 320 }}>
        
        {/* Encabezado del menú lateral */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Categorías
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            Seleccioná para cargar una categoria específica
          </Typography>
        </Box>

        <Divider />

        <List>
          {/* Generación dinámica de botones según lo que se recibe (las categorias)*/}
          {categories.map((c) => (
            <ListItemButton
              key={c}
              onClick={() => {
                onPickCategory(c);
                onClose();
              }}
            >
              {/* uso de 'pretty' para que el texto se vea bien, lo aprendí en una guia */}
              <ListItemText primary={pretty(c)} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}