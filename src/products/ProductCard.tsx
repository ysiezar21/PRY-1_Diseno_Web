import * as React from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import type { Product } from "../api/dummyjson";

// Definición de las propiedades: recibe un producto y la función para agregarlo
type Props = {
  product: Product;
  onAddToCart: (p: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    // Tarjeta con ancho fijo (flex: 0 0 auto sirve si se usa en un carrusel o lista horizontal)
    <Card sx={{ width: 220, flex: "0 0 auto" }}>
      
      {/* Imagen del producto */}
      <CardMedia
        component="img"
        height="140"
        image={product.thumbnail}
        alt={product.title}
        sx={{ objectFit: "cover" }}
      />

      {/* Contenido de texto: Título, Precio y Categoría */}
      <CardContent sx={{ pb: 0 }}>
        {/* Título en negrita. 'noWrap' corta el texto con "..." si es muy largo */}
        <Typography sx={{ fontWeight: 800 }} noWrap title={product.title}>
          {product.title}
        </Typography>

        {/* Precio destacado */}
        <Typography sx={{ fontWeight: 900, mt: 0.5 }}>${product.price}</Typography>

        {/* Categoría con menos opacidad para diferenciarla visualmente */}
        <Typography variant="body2" sx={{ opacity: 0.75 }} noWrap title={product.category}>
          {product.category}
        </Typography>
      </CardContent>

      {/* Botones de acción al pie de la tarjeta */}
      <CardActions>
        <Button variant="contained" size="small" fullWidth onClick={() => onAddToCart(product)}>
          + Agregar
        </Button>
      </CardActions>
    </Card>
  );
}