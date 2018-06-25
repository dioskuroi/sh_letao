// 验证是否登录功能
if (!location.href.includes('login.html')) {
  $.ajax({
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success(info) {
      if (info.error===400) {
        location.href='login.html'
      }
    }
  })
}



// 全局ajax进度条功能
$(document).ajaxStart(() => {
  NProgress.start()
})
$(document).ajaxStop(() => {
  NProgress.done()
})


// 公共侧边栏和头部功能
$($ => {
  // 侧边栏显示隐藏
  $('.icon_menu').on('click', () => {
    $('.lt_aside').toggleClass('menu_hidden')
    $('.lt_topbar').toggleClass('menu_hidden')
    $('.lt_main').toggleClass('menu_hidden')
  })

  // 侧边栏二级菜单显示隐藏
  $('.nav .category').on('click', () => {
    $('.nav .child').stop().slideToggle()
  })

  // 退出模态框隐藏与显示
  $('.icon_logout').on('click', () => {
    $('.modal_logout').modal()
  })
  // 登出功能
  $('#logout').on('click', () => {
    $.ajax({
      url: '/employee/employeeLogout',
      dataType: 'json',
      success(info) {
        if (info.success) {
          location.href = 'login.html'
        }
      }
    })
  })
})