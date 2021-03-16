import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import defaultConfig from './defaultConfig';
import { getRandomFileName, normalizeRoutes } from './utils';

export default function (api, userConfig) {
  const pkg = require(path.join(api.paths.absNodeModulesPath, 'umi', 'package.json'));
  const umiMajorVersion = pkg.version.split('.')[0];
  let syntheticConfig: any = {};
  let routes: any[] = [];
  if (umiMajorVersion == 2) {
    syntheticConfig = Object.assign({}, defaultConfig, userConfig);
    routes = api.routes;
  } else if (umiMajorVersion == 3) {
    api.describe({
      key: 'routeJSON',
      config: {
        schema(joi) {
          return joi.object({
            dist: joi.string(),
            filename: joi.string(),
            flag: joi.string(),
            reservedAttributes: joi.array().items(joi.string()),
            localeFilePath: joi.string(),
            i18n: joi.string()
          });
        }
      }
    });
    syntheticConfig = Object.assign({}, defaultConfig, api.userConfig.routeJSON || {});
    routes = api.userConfig.routes;
  }
  const { dist, filename, localeFilePath } = syntheticConfig;
  api.onStart(() => {
    const cwd = process.cwd();
    // 提取国际化内容
    let localeFileName = getRandomFileName() + '.js';
    while (fs.existsSync(path.join(cwd, localeFileName))) {
      localeFileName = getRandomFileName() + '.js';
    }
    esbuild
      .build({
        entryPoints: [path.join(cwd, localeFilePath)],
        bundle: true,
        platform: 'node',
        outfile: localeFileName
      })
      .then(() => {
        const locales = require(path.join(cwd, localeFileName));
        // 提取路由信息
        const leftRoutes = [];
        const currentPath = [];
        normalizeRoutes(routes, currentPath, leftRoutes, locales, syntheticConfig);

        if (!fs.existsSync(path.join(cwd, dist))) {
          fs.mkdirSync(path.join(cwd, dist), {
            recursive: true
          });
        }
        fs.writeFile(path.join(cwd, dist, filename), JSON.stringify(leftRoutes), (err) => {
          if (err) throw err;
          fs.unlink(path.join(cwd, localeFileName), function (err) {
            if (err) throw err;
          });
        });
      })
      .catch((e) => console.error(e));
  });
}
