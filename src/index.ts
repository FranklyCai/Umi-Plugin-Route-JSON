import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import defaultConfig from './defaultConfig';
import { getRandomFileName, normalizeRoutes } from './utils';

export default function (api, userConfig) {
  const syntheticConfig = Object.assign({}, defaultConfig, userConfig);
  const { dist, filename, localeFilePath } = syntheticConfig;
  api.onGenerateFiles(() => {
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
        const routes = [...api.routes];
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
