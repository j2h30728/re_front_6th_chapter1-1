import ProductService from "../services/productService";
import { productStore } from "../stores/productStore";

export function isNearBottom(treshold = 200) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  return scrollTop + windowHeight >= documentHeight - treshold;
}

export function registerInfiniteScroll() {
  const handleScroll = () => {
    const isHomePage = window.location.pathname === "/";
    if (!isHomePage) return;

    if (isNearBottom(300)) {
      const productState = productStore.getState();
      const hasNext = productState.products.length < productState.totalCount;
      if (productState.loading || !hasNext) return;
      ProductService.loadList({ init: false });
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}
