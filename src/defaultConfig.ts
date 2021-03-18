export default {
  // 路由文件放在什么位置
  dist: 'dist',
  // 生成的路由文件名
  filename: 'menu.json',
  // 标注了embedded的路由项会被提取出来
  flag: 'embedded',
  // 在生成的每个路由前添加的前缀，默认为空字符串
  pathPrefix: '',
  // 保留路由的哪些字段
  reservedAttributes: [],
  // 默认locale文件存放的位置
  localeFilePath: 'src/locales/zh-CN',
  // 输出的文件locale字段对应的名称
  i18n: 'i18n',
  // 遇到有带参数的路由时，这里可以配置它的默认路由
  defaultParams: {}
};
