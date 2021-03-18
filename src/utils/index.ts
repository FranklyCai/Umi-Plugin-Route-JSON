const path = require('path');

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

const processPathDefaultParams = (defaultParams, path) => {
  if (defaultParams) {
    return Object.keys(defaultParams).reduce((path, paramKey) => {
      path = path.replace(new RegExp(':' + paramKey, 'g'), defaultParams[paramKey]);
      return path;
    }, path);
  }
  return path;
};

export const normalizeRoutes = (
  routes,
  currentName,
  currentPath,
  leftRoutes,
  locales,
  syntheticConfig,
  umiMajorVersion
) => {
  routes.forEach((route) => {
    if (route.name && route.routes) {
      currentName.push(route.name);
    }
    if (route.path && route.routes) {
      if (route.path.startsWith('/')) {
        currentPath.pop();
        currentPath.push(route.path);
      } else {
        currentPath.push(route.path);
      }
    }
    if (route[syntheticConfig.flag]) {
      const routeCopy = { ...route };
      if (umiMajorVersion == 2) {
        routeCopy.path = processPathDefaultParams(route.defaultParams, syntheticConfig.pathPrefix + routeCopy.path);
      } else if (umiMajorVersion == 3) {
        routeCopy.path = route.routes
          ? processPathDefaultParams(
              route.defaultParams,
              (syntheticConfig.pathPrefix + path.join(...currentPath)).replace(/\\/g, '/')
            )
          : processPathDefaultParams(
              route.defaultParams,
              (syntheticConfig.pathPrefix + path.join(...currentPath, route.path)).replace(/\\/g, '/')
            );
      }
      routeCopy[syntheticConfig.i18n] = route.routes
        ? locales[['menu'].concat(currentName).join('.')]
        : locales[['menu'].concat(currentName).concat(routeCopy.name).join('.')];
      leftRoutes.push(
        processFilteredRoute(
          routeCopy,
          ['path'].concat(syntheticConfig.reservedAttributes.concat(syntheticConfig.i18n))
        )
      );
    }
    if (route.routes) {
      normalizeRoutes(route.routes, currentName, currentPath, leftRoutes, locales, syntheticConfig, umiMajorVersion);
    }
  });
  currentName.pop();
  currentPath.pop();
};
