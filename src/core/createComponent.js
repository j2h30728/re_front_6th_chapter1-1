import BaseComponent from "./BaseComponent";

/**
 * 컴포넌트를 생성합니다
 * @param {Object} options - 컴포넌트 옵션
 * @param {HTMLElement|string} options.el - 마운트할 요소 또는 선택자
 * @param {Object} [options.initialState] - 초기 상태
 * @param {string|Function} options.template - 템플릿
 * @param {Object} [options.events] - 이벤트 핸들러들
 * @param {Function} [options.onMount] - 마운트 시 콜백
 * @param {Function} [options.onUpdate] - 업데이트 시 콜백
 * @param {Function} [options.onUnmount] - 언마운트 시 콜백
 * @returns {Object} 컴포넌트 인스턴스
 */
export default function createComponent(options) {
  const component = new BaseComponent(options);

  return {
    mount: () => component.mount(),
    unmount: () => component.unmount(),
    setState: (state) => component.setState(state),
    get state() {
      return component.state;
    },
  };
}
