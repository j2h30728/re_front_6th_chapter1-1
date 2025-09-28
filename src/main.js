import HomePage from "./pages/HomePage.js";
import router from "./router.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  console.log("main() function called");

  initializeApp();
}

function initializeApp() {
  const rootElement = document.getElementById("root");
  console.log("rootElement:", rootElement);
  if (!rootElement) {
    console.log("rootElement not found, returning");
    return;
  }

  // 라우터 구독 설정
  router.subscribe(({ target, params }) => {
    console.log("router subscribe called:", { target, params });
    if (target) {
      const page = target({ el: rootElement, params });
      console.log("page created:", page);
      page.mount();
      console.log("page mounted");
    }
  });

  // 라우트 추가 후 시작
  router.addRoute("/", HomePage);
  router.start();
  console.log("router started");
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
