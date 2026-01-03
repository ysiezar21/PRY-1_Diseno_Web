import * as React from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Product } from "../../api/dummyjson";

// Props para el carrusel de héroe ( así descubrí que se le llama al carrucel principal )
type Props = {
  title: string;
  items: Product[];
};

// Componente del carrusel de héroe/principal
export default function HeroCarousel({ title, items }: Props) {
  // Estado para controlar qué imagen se muestra actualmente
  const [i, setI] = React.useState(0);
  const max = items.length;

  // Lógica de navegación: utilizo módulo (%) para lograr el efecto circular/infinito
  const prev = () => setI((x) => (max === 0 ? 0 : (x - 1 + max) % max));
  const next = () => setI((x) => (max === 0 ? 0 : (x + 1) % max));

  // se obtiene aca el producto actual basado en el índice
  const current = items[i];

  return (
    <Box sx={{ mt: 2 }}>
      {/* Título de la sección encima del carrusel */}
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>

      {/* Contenedor principal con bordes redondeados */}
      <Paper sx={{ position: "relative", overflow: "hidden", borderRadius: 3 }}>
        
        {/* Caja que renderiza la imagen de fondo (se ajusta la altura según dispositivo) */}
        <Box
          sx={{
            height: { xs: 220, md: 340 }, // Altura responsive
            bgcolor: "#eee",
            backgroundImage: current?.thumbnail ? `url(${current.thumbnail})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            placeItems: "center",
          }}
        >
          {/* Mensaje de fallback por si la data no ha llegado */}
          {!current && (
            <Typography sx={{ opacity: 0.7 }}>
              Cargando / sin datos
            </Typography>
          )}
        </Box>

        {/* Tarjeta flotante con info (título y precio), solo si hay producto */}
        {current && (
          <Box
            sx={{
              position: "absolute",
              left: 16,
              bottom: 16,
              bgcolor: "rgba(0,0,0,0.55)", // Fondo semitransparente para legibilidad
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: 2,
              maxWidth: "70%",
            }}
          >
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {current.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }} noWrap>
              ${current.price}
            </Typography>
          </Box>
        )}

        {/* Botón para retroceder (flecha izquierda) */}
        <IconButton
          onClick={prev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)", // Centrado vertical perfecto
            bgcolor: "rgba(255,255,255,0.85)",
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Botón para avanzar (flecha derecha) */}
        <IconButton
          onClick={next}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.85)",
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

