const fs = require('fs-extra')
const code = require('./code')
const requiredVersion = require('./package.json').engines.node
const semver = require('semver')

function WebpackPluginPerformance(options) {
  if (!semver.satisfies(process.version, requiredVersion)) {
    error(
      `You are using Node ${process.version}, but @mkt/webpack-plugin-performance-tracker ` +
      `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    );
    process.exit(1);
  }
  this.options = options
  this.runing = false
}

function injectWithin(html, content, head = true) {
  let before = head ? html.indexOf('</head>') : html.indexOf('</body>')
  if (before < 0) return html
  let injected = [
    `<!--[if !IE]><!-->
      <script>performance.mark('start')</script>
      <script>${content}</script>
    <!--<![endif]-->`
  ]
  injected.unshift(html.substr(0, before))
  injected.push(html.substr(before))
  return injected.join('\n')
}

WebpackPluginPerformance.prototype.apply = function(compiler) {
  let that = this
  let options = that.options
  // 生产环境才注入tracker代码
  if (compiler.options.mode !== 'production') {
    return
  }
  let emit = function(compilation, callback = () => {}) {
    let html = ''
    if (that.runing) {
      callback()
      return
    }

    function injector(outputPath) {
      try {
        html = fs.readFileSync(outputPath, 'utf8')
      } catch (e) {
        compilation.errors.push(
          new Error('WebpackPluginPerformance read filename failed')
        )
        callback()
        return
      }
      html = injectWithin(html, code(options).toString(), true)
      return html
    }
    const outputPath = `${compiler.options.output.path}/index.html`
    fs.writeFileSync(outputPath, injector(outputPath))
    that.runing = true
    callback()
  }
  if (compiler.hooks) {
    // for webpack4
    compiler.hooks.afterEmit.tap('WebpackPluginPerformance', emit)
  } else {
    compiler.plugin('afterEmit', emit)
  }
}

module.exports = WebpackPluginPerformance