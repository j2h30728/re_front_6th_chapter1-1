import createStore from "../libs/createStore";
import { PRODUCT_ACTIONS } from "./actionType";

export const initialProductState = {
  // 상품 목록
  products: [],
  totalCount: 0,

  // 상품 상세
  currentProduct: null,
  relatedProducts: [],

  // 로딩 및 에러 상태
  loading: true,
  error: null,
  status: "idle",

  // 카테고리 목록
  categories: {},
};

const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SETUP:
      return { ...state, ...action.payload };
    case PRODUCT_ACTIONS.SET_STATUS:
      return { ...state, status: action.payload };
    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false, status: "done" };
    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false, error: null, status: "done" };
    case PRODUCT_ACTIONS.SET_LIST:
      return {
        ...state,
        products: action.payload.products,
        totalCount: action.payload.totalCount,
        loading: false,
        error: null,
        status: "done",
      };
    case PRODUCT_ACTIONS.SET_PRODUCT:
      return { ...state, currentProduct: action.payload, loading: false, error: null, status: "done" };
    case PRODUCT_ACTIONS.SET_MORE_LIST:
      return {
        ...state,
        totalCount: action.payload.totalCount,
        products: [...state.products, ...action.payload.products],
        loading: false,
        error: null,
        status: "done",
      };
    default:
      return state;
  }
};

export const productStore = createStore(productReducer, initialProductState);
