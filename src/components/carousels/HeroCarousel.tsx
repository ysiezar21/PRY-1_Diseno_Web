import * as React from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Product } from "../../api/dummyjson";
import { languages } from "../../languages/languages";

type Props = {
  title: string;
  items: Product[];
  lang: "es" | "en";
};

export default function HeroCarousel({ title, items, lang }: Props) {
  const [i, setI] = React.useState(0);
  const max = items.length;

  const t = languages[lang || "en"];

  const prev = () => setI((x) => (max === 0 ? 0 : (x - 1 + max) % max));
  const next = () => setI((x) => (max === 0 ? 0 : (x + 1) % max));

  const current = items[i];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        {title}
      </Typography>

      <Paper sx={{ position: "relative", overflow: "hidden", borderRadius: 3 }}>
        <Box
          sx={{
            height: { xs: 220, md: 340 },
            bgcolor: "#eee",
            backgroundImage: current?.thumbnail ? `url(${current.thumbnail})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            placeItems: "center",
          }}
        >
          {!current && (
            <Typography sx={{ opacity: 0.7 }}>
              {t.heroCarousel.loading}
            </Typography>
          )}
        </Box>

        {current && (
          <Box
            sx={{
              position: "absolute",
              left: 16,
              bottom: 16,
              bgcolor: "rgba(0,0,0,0.55)",
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

        <IconButton
          onClick={prev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.85)",
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

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
