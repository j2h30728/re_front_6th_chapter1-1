import { getCategories, getProducts } from "../api/productApi";
import { PRODUCT_ACTIONS } from "../stores/actionType";
import { initialProductState, productStore } from "../stores/productStore";

const ProductService = {
  loadList: async ({ filters = {}, init = true }) => {
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SETUP,
      payload: { ...initialProductState, loading: true, error: null, status: "pending" },
    });
    const defaultFilters = {
      page: init ? 1 : filters?.page + 1,
      search: filters?.searchQuery || "",
      sort: filters?.sort || "price_asc",
      limit: filters?.limit || 20,
      category1: filters?.category?.category1 || "",
      category2: filters?.category?.category2 || "",
    };

    try {
      if (init) {
        await ProductService.loadInitialList(defaultFilters);
      } else {
        await ProductService.loadMoreList(defaultFilters);
      }
    } catch (error) {
      productStore.dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  },

  getListWithCategories: async (filters) => {
    productStore.dispatch({ type: PRODUCT_ACTIONS.SETUP, payload: { loading: true, error: null, status: "pending" } });

    try {
      const [{ products, pagination }, categories] = await Promise.all([
        getProducts({
          search: filters?.searchQuery || "",
          sort: filters?.sort || "price_asc",
          limit: filters?.limit || 20,
          category1: filters?.category?.category1 || "",
          category2: filters?.category?.category2 || "",
        }),
        getCategories(),
      ]);
      productStore.dispatch({
        type: PRODUCT_ACTIONS.SETUP,
        payload: { products, totalCount: pagination.total, categories, loading: false, error: null, status: "done" },
      });
    } catch (error) {
      productStore.dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  },

  loadInitialList: async (filters = {}) => {
    const state = productStore.getState();

    const data = await getProducts({
      page: filters.page || 1,
      limit: filters.limit || state.filters.limit,
      search: filters.searchQuery,
      sort: filters.sort || state.filters.sort,
      category1: filters.category1,
      category2: filters.category2,
    });
    const { products } = data;
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SET_LIST,
      payload: products,
    });
  },

  loadMoreList: async (filters = {}) => {
    const state = productStore.getState();

    if (!state.pagination.hasNext || state.loading) {
      return;
    }

    const data = await getProducts({
      page: state.pagination.page + 1,
      limit: filters.limit || state.filters.limit,
      search: filters.searchQuery,
      sort: filters.sort || state.filters.sort,
      category1: filters.category1,
      category2: filters.category2,
    });
    const { products } = data;
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SET_MORE_LIST,
      payload: products,
    });
  },
};

export default ProductService;
