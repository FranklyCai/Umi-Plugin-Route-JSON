export default {
  // 路由文件放在什么位置
  dist: 'dist',
  // 生成的路由文件名
  filename: 'menu.json',
  // 标注了embedded的路由项会被提取出来
  flag: 'embedded',
  // 保留路由的哪些字段
  reservedAttributes: ['path'],
  // 默认locale文件存放的位置
  localeFilePath: 'src/locales/zh-CN',
  // 输出的路由JSON里path对应的名称
  i18n: 'i18n'
};
