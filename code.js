module.exports = function(options) {
  return `
    performance.mark('start')
    window.__performance = {
      id: Date.now() + '_' + (Math.random().toString()).replace('.', ''),
      fp: 0, // first paint
      fcp: 0, // first contentful paint
      fapi: 0,
      fjs: 0, // first js
      fcss: 0, // first css
      fimg: 0, // first image
      tti: 0,// time to interactive
      fmp: 0 // first meaningful paint
    };
  
    // long task
    if ('PerformanceObserver' in window) {
      var longTaskObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        for (var i = 0, len = entries.length; i < len; i++) {
          var entry = entries[i];
          var time = Number((entry.startTime + entry.duration).toFixed(2));
          __performance.tti = time;
        }
      });
    
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  `
}