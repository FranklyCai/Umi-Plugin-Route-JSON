export const getRandomFileName = () => {
  return Math.random().toString(36).substring(7);
};

const processFilteredRoute = (route, reservedAttributes) => {
  Object.keys(route).forEach((key) => {
    if (!reservedAttributes.includes(key)) {
      delete route[key];
    }
  });
  return route;
};

export const normalizeRoutes = (routes, currentPath, leftRoutes, locales, syntheticConfig) => {
  if (Array.isArray(routes)) {
    routes.forEach((route) => {
      if (route.name && route.routes) {
        currentPath.push(route.name);
      }
      if (route[syntheticConfig.flag]) {
        const routeCopy = { ...route };
        routeCopy[syntheticConfig.i18n] = locales['menu.' + currentPath.join('.') + '.' + route.name];
        leftRoutes.push(
          processFilteredRoute(routeCopy, syntheticConfig.reservedAttributes.concat(syntheticConfig.i18n))
        );
      }
      if (route.routes) {
        normalizeRoutes(route.routes, currentPath, leftRoutes, locales, syntheticConfig);
      }
    });
    currentPath.pop();
  }
};
