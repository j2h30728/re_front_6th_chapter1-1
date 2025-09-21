/**
 * 상품 정보
 * @typedef {Object} Product
 * @property {string} title - 상품명
 * @property {string} link - 상품 링크
 * @property {string} image - 상품 이미지
 * @property {string} lprice - 상품 가격
 * @property {string} hprice - 상품 최고 가격
 * @property {string} mallName - 상품 쇼핑몰명
 * @property {string} productId - 상품 ID
 * @property {string} productType - 상품 타입
 * @property {string} brand - 상품 브랜드
 * @property {string} maker - 상품 제조사
 * @property {string} category1 - 상품 카테고리 1
 * @property {string} category2 - 상품 카테고리 2
 * @property {string} category3 - 상품 카테고리 3
 * @property {string} category4 - 상품 카테고리 4
 */

// 상품 목록 조회
/**
 *
 * @param {*} params
 * @param {Object} params
 * @param {number} params.limit - 페이지당 상품 수
 * @param {string} params.search - 검색어
 * @param {string} params.category1 - 카테고리 1
 * @param {string} params.category2 - 카테고리 2
 * @param {string} params.sort - 정렬 기준
 * @returns {Promise<{products: Array<Product>, pagination: Object, filters: Object}>}
 * @example
 */
export async function getProducts(params = {}) {
  const { limit = 20, search = "", category1 = "", category2 = "", sort = "price_asc" } = params;
  const page = params.current ?? params.page ?? 1;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category1 && { category1 }),
    ...(category2 && { category2 }),
    sort,
  });

  const response = await fetch(`/api/products?${searchParams}`);
  return await response.json();
}

// 상품 상세 조회
/**
 * 상품 상세 조회
 * @param {string} productId - 상품 ID
 * @returns {Promise<>} 상품 상세 정보
 * @returns {Promise<Product>} 상품 상세 정보
 */
export async function getProduct(productId) {
  const response = await fetch(`/api/products/${productId}`);
  return await response.json();
}

// 카테고리 목록 조회
/**
 * 카테고리 목록 조회
 * @returns {Promise<Object>} 카테고리 목록
 * @returns {Promise<{category1: string, category2: string, category3: string, category4: string}>} 카테고리 목록
 */
export async function getCategories() {
  const response = await fetch("/api/categories");
  return await response.json();
}
