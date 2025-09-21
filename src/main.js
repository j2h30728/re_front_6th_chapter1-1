import Layout from "./components/Layout.js";
import HomePage from "./pages/HomePage.js";
import ProductService from "./services/productService.js";
import { productStore } from "./stores/productStore.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  ProductService.getListWithCategories();

  const render = () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) return;

    rootElement.innerHTML = `
      ${Layout({ children: HomePage })}
    `;
  };
  render();

  productStore.subscribe(render);
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
