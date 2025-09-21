import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function ProductList({ products = [], loading = false, error = null, totalCount = 0 }) {
  if (error) {
    return `
      <div class="text-center text-red-500">${error}</div>
    `;
  }
  if (!loading && products.length === 0) {
    return `
      <div class="text-center text-gray-500">상품이 없습니다.</div>
    `;
  }
  return `
    <div class="mb-6">
        <div>
        <!-- 상품 개수 정보 -->
      ${
        totalCount > 0
          ? `
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${totalCount.toLocaleString()}개</span>의 상품
        </div>
      `
          : ""
      }
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
        ${loading ? ProductListSkeleton() : ""}
        ${products.map((product) => ProductCard(product)).join("")}
        </div>
        <div class="text-center py-4 text-sm text-gray-500">
            모든 상품을 확인했습니다
        </div>
        </div>
    </div>
  `;
}

export function ProductListSkeleton() {
  return Array.from({ length: 6 })
    .map(() => ProductCardSkeleton())
    .join("");
}
