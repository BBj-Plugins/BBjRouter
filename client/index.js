import Navigo from 'navigo';

window.BBjRouter = (() => {

  let router;
  const fire = (type, detail) => {
    const container = document.querySelector("[data-bbj-router]")
    container.basisDispatchCustomEvent(container, {
      type,
      detail: JSON.stringify(detail)
    })
  };

  return {
    init(hash = true, base = '/') {
      router = new Navigo(base, { hash: Boolean(hash), noMatchWarning: false });
      router.notFound((ev) => {
        fire('bbj-router-notfound', {
          path: ev.route.path,
          data: ev.data,
          params: ev.params,
          queryString: ev.querySelector
        });
      });
    },

    navigo() {
      return router;
    },

    on(path, name) {
      router.on({
        [path]: {
          as: name,
          uses: ({ data, params, queryString }) => {
            fire('bbj-router-matched', { path, data, params, queryString });
          },
        }
      });
    },

    off(path) {
      router.off(path);
    },

    navigate(path, silent = false) {
      router.navigate(path, {
        historyAPIMethod: 'pushState',
        updateBrowserURL: true,
        callHandler: !Boolean(silent),
        callHooks: !Boolean(silent),
      });
    },

    resolve() {
      router.resolve();
    },

    destroy() {
      router.destroy();
    }
  };
})();