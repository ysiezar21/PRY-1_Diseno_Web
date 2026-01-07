import { useEffect, useState } from "react";
import { languages } from "../languages/languages";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

type Props = {
  lang: "es" | "en";
};

export default function Catalog({ lang }: Props) {
  const t = languages[lang].catalog;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>{t.loading}</p>;
  }

  return (
    <div className="catalog">
      <h2>{t.catalogTitle}</h2>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <h4>{product.title}</h4>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
