// 全局ajax进度条功能
$($ => {
  $(document).ajaxStart(() => {
    NProgress.start()
  })
  $(document).ajaxStop(() => {
    NProgress.done()
  })
})

// 公共侧边栏和头部功能
$($ => {
  
})