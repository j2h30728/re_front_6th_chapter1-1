/**
 * 컴포넌트의 기본 기능을 제공하는 베이스 클래스
 */
export default class BaseComponent {
  /**
   * BaseComponent 생성자
   * @param {Object} options - 컴포넌트 설정 옵션
   * @param {HTMLElement|string} options.el - 마운트할 DOM 요소 또는 선택자
   * @param {Object} [options.initialState={}] - 초기 상태 객체
   * @param {Function} options.template - 상태를 받아 HTML 문자열을 반환하는 템플릿 함수
   * @param {Object} [options.events={}] - 이벤트 핸들러 맵 { eventType: { selector: handler } }
   * @param {Function} [options.onMount=() => {}] - 컴포넌트 마운트 시 실행되는 콜백
   * @param {Function} [options.onUpdate=() => {}] - 상태 업데이트 시 실행되는 콜백
   * @param {Function} [options.onUnmount=() => {}] - 컴포넌트 언마운트 시 실행되는 콜백
   */
  constructor({
    el,
    initialState = {},
    template,
    events = {},
    onMount = () => {},
    onUpdate = () => {},
    onUnmount = () => {},
  }) {
    // 1) 컴포넌트 핵심 속성 설정
    this.el = el; // 루트 DOM 요소
    this.state = { ...initialState }; // 상태
    this.template = template; // state → HTML 함수
    this.events = events; // 이벤트 맵 { eventType: { selector: handler } }
    this.onMount = onMount; // 마운트 시 실행 훅
    this.onUpdate = onUpdate; // 업데이트 시 실행 훅
    this.onUnmount = onUnmount; // 언마운트 시 실행 훅

    // 2) 내부 관리용
    this.mounted = false; // 마운트 여부 플래그
    this.listenerRefs = []; // [{ type, fn }] 기록
  }

  /**
   * 상태를 업데이트하고 컴포넌트를 리렌더링
   * @param {Object} partialState - 업데이트할 상태의 일부 또는 전체
   */
  // 상태 변경 시 렌더링 및 onUpdate 호출
  setState(partialState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...partialState };
    if (this.mounted && JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.onUpdate(this.state, prevState);
      this.render();
    }
  }

  /**
   * 현재 상태를 사용하여 템플릿을 렌더링
   */
  render() {
    this.el.innerHTML = this.template(this.state);
  }

  /**
   * 이벤트 위임을 처리하는 공통 리스너 함수
   * @param {Event} event - 발생한 이벤트 객체
   * @private
   */
  // 이벤트 위임 리스너 공통 함수
  delegatedListener = (event) => {
    const handlers = this.events[event.type];
    if (!handlers) return;
    Object.entries(handlers).forEach(([selector, handler]) => {
      const match = event.target.matches(selector) ? event.target : event.target.closest(selector);
      if (match) handler({ event, element: match, state: this.state, setState: this.setState.bind(this) });
    });
  };

  /**
   * 컴포넌트를 DOM에 마운트하고 이벤트 리스너를 등록
   */
  mount() {
    if (this.mounted) return;
    this.render();

    // 이벤트 타입별 한 번씩 루트 엘리먼트에 리스너 등록
    Object.keys(this.events).forEach((type) => {
      this.el.addEventListener(type, this.delegatedListener);
      this.listenerRefs.push({ type, fn: this.delegatedListener });
    });

    this.mounted = true;
    this.onMount();
  }

  /**
   * 컴포넌트를 DOM에서 언마운트하고 이벤트 리스너를 해제
   */
  unmount() {
    if (!this.mounted) return;
    this.listenerRefs.forEach(({ type, fn }) => {
      this.el.removeEventListener(type, fn);
    });
    this.listenerRefs = [];
    this.el.innerHTML = "";
    this.mounted = false;
    this.onUnmount();
  }
}
