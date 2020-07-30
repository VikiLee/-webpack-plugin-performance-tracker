## 功能
用于采集性能指标数据，需要配合[performance-tracker](https://github.com/VikiLee/performance-tracker)使用，用于在页面最顶端打点以及long task监控。

### usage
```
const WebpackPerformancePlugin = require('webpack-plugin-performance-tracker');

module.exports = {
  plugins: [
    new WebpackPerformancePlugin()
  ]
};
```