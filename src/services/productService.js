import { getCategories, getProducts } from "../api/productApi";
import { PRODUCT_ACTIONS } from "../stores/actionType";
import { initialProductState, productStore } from "../stores/productStore";

const ProductService = {
  getList: async () => {
    productStore.dispatch({
      type: PRODUCT_ACTIONS.SETUP,
      payload: { ...initialProductState, loading: true, error: null, status: "pending" },
    });

    try {
      const data = await getProducts();
      const { products, pagination } = data;
      productStore.dispatch({ type: PRODUCT_ACTIONS.SET_LIST, payload: { products, totalCount: pagination.total } });
    } catch (error) {
      productStore.dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  },

  getListWithCategories: async () => {
    productStore.dispatch({ type: PRODUCT_ACTIONS.SETUP, payload: { loading: true, error: null, status: "pending" } });

    try {
      const [{ products, pagination }, categories] = await Promise.all([getProducts(), getCategories()]);
      productStore.dispatch({
        type: PRODUCT_ACTIONS.SETUP,
        payload: { products, totalCount: pagination.total, categories, loading: false, error: null, status: "done" },
      });
      console.log(productStore.getState());
    } catch (error) {
      productStore.dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  },
};

export default ProductService;
