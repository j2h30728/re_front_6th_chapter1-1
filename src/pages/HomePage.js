import Layout from "../components/Layout";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import createComponent from "../core/createComponent";
import ProductService from "../services/productService";
import { productStore } from "../stores/productStore";

export default function HomePage({ el: el = document.getElementById("root") }) {
  return createComponent({
    el,
    initialState: {
      ...productStore.getState(),
      searchQuery: "",
      sort: "price_asc",
      limit: 20,
      category: {},
      categories: {},
    },
    template: (state) => `
    ${Layout({
      children: `<!-- 검색 및 필터 -->
    ${SearchBar(state)}
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
      ${ProductList(state)}
      </div>
    </div>`,
    })}
  `,
    events: {
      keydown: {
        "#search-input": ({ event, setState }) => {
          if (event.key === "Enter") {
            setState({ searchQuery: event.target.value });
          }
        },
      },
      change: {
        "#sort-select": ({ event, setState }) => {
          setState({ sort: event.target.value });
        },
        "#limit-select": ({ event, setState }) => {
          setState({ limit: event.target.value });
        },
      },
    },
    onMount: function () {
      this.unsubscribe = productStore.subscribe((state) => {
        this.setState(state);
      });
      ProductService.getListWithCategories();
    },
    onUnmount: function () {
      if (this.unsubscribe) this.unsubscribe();
    },
    onUpdate: function (newState, prevState) {
      if (
        newState.searchQuery !== prevState.searchQuery ||
        newState.sort !== prevState.sort ||
        newState.limit !== prevState.limit ||
        newState.category !== prevState.category
      ) {
        ProductService.getListWithCategories(newState);
      }
    },
  });
}
