import * as React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Product } from "../../api/dummyjson";
import ProductCard from "../../products/ProductCard";

type Lang = "es" | "en";

// Def de props: título de la fila, array de productos y callback del carrito
type Props = {
  title: string;
  products: Product[];
  onAddToCart: (p: Product) => void;
  lang: Lang;
};

export default function ProductRowCarousel({ title, products, onAddToCart, lang }: Props) {
  // Referencia al contenedor DOM para poder manipular el scroll manualmente
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Función helper para scrollear a la izquierda/derecha
  const scrollBy = (dx: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Encabezado con título y botones */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>

        <Box>
          <IconButton onClick={() => scrollBy(-320)} aria-label="scroll left">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => scrollBy(320)} aria-label="scroll right">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Contenedor horizontal con overflow */}
      <Box
        ref={ref}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,
          // Estilos personalizados para que la barra de scroll se vea sutil
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.2)", borderRadius: 999 },
        }}
      >
        {/* Renderizamos la tarjeta de producto por cada elemento de la lista */}
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} lang={lang} />
        ))}
      </Box>
    </Box>
  );
}
