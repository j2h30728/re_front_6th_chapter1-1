import { createObserver } from "./createObserver";

export class Router {
  #routes;
  #route;
  #observer = createObserver();
  #baseUrl;

  constructor(baseUrl) {
    this.#routes = new Map();
    this.#route = null;
    this.#baseUrl = baseUrl.replace(/\/$/, ""); // 뒤에 / 제거

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    window.addEventListener("popstate", () => {
      this.#route = this.#findRoute();
      this.#observer.notify({ target: this.target, params: this.#route?.params || {} });
    });
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  get query() {
    return Router.parseQuery(window.location.search);
  }

  set query(newQuery) {
    const newUrl = Router.getUrl(newQuery, this.#baseUrl);
    this.push(newUrl);
  }

  get route() {
    return this.#route;
  }

  get target() {
    return this.#route?.handler;
  }

  subscribe(callback) {
    this.#observer.subscribe(callback);
  }

  start() {
    this.#route = this.#findRoute();
    this.#observer.notify({ target: this.target, params: this.#route?.params || {} });
  }

  addRoute(path, handler) {
    const paramNames = [];
    const regexPath = path
      .replace(/:\w+/g, (match) => {
        paramNames.push(match.slice(1));
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    const regex = new RegExp(`^${this.#baseUrl}${regexPath}$`);

    this.#routes.set(path, { regex, paramNames, handler });
  }

  #findRoute(url = window.location.pathname) {
    const { pathname } = new URL(url, window.location.origin);
    for (const [path, route] of this.#routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { ...route, params, path };
      }
    }
    return null;
  }

  push(url) {
    try {
      const fullUrl = url.startsWith(this.#baseUrl) ? url : `${this.#baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
      const prevFullUrl = `${window.location.pathname}${window.location.search}`;

      if (prevFullUrl !== fullUrl) {
        window.history.pushState({}, "", fullUrl);
      }

      this.#route = this.#findRoute(fullUrl);
      this.#observer.notify({ target: this.target, params: this.#route?.params || {} });
    } catch (error) {
      console.error("라우터 네비게이션 오류:", error);
    }
  }

  static parseQuery(search = window.location.search) {
    const params = new URLSearchParams(search);
    const query = {};
    for (const [key, value] of params) {
      query[key] = value;
    }
    return query;
  }

  static stringifyQuery(query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    }
    return params.toString();
  }

  static getUrl(newQuery, baseUrl = "") {
    const currentQuery = Router.parseQuery(window.location.search);
    const updatedQuery = { ...currentQuery, ...newQuery };

    Object.entries(updatedQuery).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        delete updatedQuery[key];
      }
    });

    const queryString = Router.stringifyQuery(updatedQuery);

    return `${baseUrl}${window.location.pathname.replace(baseUrl, "")}${queryString ? `?${queryString}` : ""}`;
  }
}
