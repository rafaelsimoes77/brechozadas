import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BRECHOZADAS — Moda de Quebrada",
    short_name: "BRECHOZADAS",
    description:
      "Compre, venda, mande ofertas e monte sua sacolinha nos melhores brechós urbanos. Por @acervodoreliquia.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4EF",
    theme_color: "#121212",
    orientation: "portrait",
    icons: [
      {
        src: "/images/peca-polo-ecko.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
