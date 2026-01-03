import * as React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Product } from "../../api/dummyjson";
import ProductCard from "../../products/ProductCard";

// Def de props: título de la fila, array de productos y callback del carrito
type Props = {
  title: string;
  products: Product[];
  onAddToCart: (p: Product) => void;
};

export default function ProductRowCarousel({ title, products, onAddToCart }: Props) {
  // Referencia al contenedor DOM para poder manipular el scroll manualmente
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Función para desplazar la lista. Recibe -1 (izquierda) o 1 (derecha)
  const scrollBy = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    
    // Calculo de una distancia de scroll dinámica (85% del ancho visible) para que se sienta fluido, esto me ayudo chat xq estaba quedando medio raro.
    const amount = Math.max(260, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Cabecera de la sección: Título a la izquierda, botones a la derecha */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>

        {/* Botones de navegación manual que activan el scroll */}
        <Box>
          <IconButton onClick={() => scrollBy(-1)}><ChevronLeftIcon /></IconButton>
          <IconButton onClick={() => scrollBy(1)}><ChevronRightIcon /></IconButton>
        </Box>
      </Box>

      {/* Contenedor principal con scroll horizontal (overflowX) */}
      <Box
        ref={ref}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto", // Esto permite deslizar con el dedo o trackpad
          pb: 1,
          // Estilos personalizados para que la barra de scroll se vea sutil
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.2)", borderRadius: 999 },
        }}
      >
        {/* Renderizamos la tarjeta de producto por cada elemento de la lista */}
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </Box>
    </Box>
  );
}
