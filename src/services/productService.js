import { getCategories, getProducts } from "../api/productApi";
import { PRODUCT_ACTIONS } from "../stores/actionType";
import { initialProductState, productStore } from "../stores/productStore";

const ProductService = {
  loadList: async ({ filters = {}, init = true }) => {
    const defaultFilters = {
      page: init ? 1 : filters?.page + 1,
      search: filters?.search || "",
      sort: filters?.sort || "price_asc",
      limit: filters?.limit || 20,
      category1: filters?.category?.category1 || "",
      category2: filters?.category?.category2 || "",
    };

    try {
      if (init) {
        productStore.dispatch({
          type: PRODUCT_ACTIONS.SETUP,
          payload: { ...initialProductState, loading: true, error: null, status: "pending" },
        });
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
          search: filters?.search || "",
          sort: filters?.sort || "price_asc",
          limit: filters?.limit || 20,
          category1: filters?.category?.category1 || "",
          category2: filters?.category?.category2 || "",
        }),
        getCategories(),
      ]);
      console.log("getListWithCategories==", products, pagination.total);
      productStore.dispatch({
        type: PRODUCT_ACTIONS.SETUP,
        payload: { products, totalCount: pagination.total, categories, loading: false, error: null, status: "done" },
      });
    } catch (error) {
      productStore.dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  },

  loadInitialList: async (filters = {}) => {
    const data = await getProducts({
      page: filters.page || 1,
      limit: filters.limit,
      search: filters.search,
      sort: filters.sort,
      category1: filters.category1,
      category2: filters.category2,
    });
    const { products, pagination } = data;
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SET_LIST,
      payload: { products, totalCount: pagination.total },
    });
    console.log("loadInitialList==", products, pagination.total);
  },

  loadMoreList: async (filters = {}) => {
    const state = productStore.getState();
    const hasNext = state.products.length < state.totalCount;
    if (!hasNext || state.loading) {
      return;
    }
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SET_STATUS,
      payload: "pending",
    });

    const data = await getProducts({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sort: filters.sort,
      category1: filters.category1,
      category2: filters.category2,
    });
    const { products, pagination } = data;
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SET_MORE_LIST,
      payload: { products, totalCount: pagination.total },
    });
  },
};

export default ProductService;
