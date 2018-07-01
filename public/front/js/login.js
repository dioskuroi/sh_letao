$($ => {
  $('#loginBtn').on('click', e => {
    e.preventDefault()
    const username = $('[name="username"]').val()
    const password = $('[name="password"]').val()
    
    if (!username) {
      return mui.toast('请输入用户名')
    }
    if (!password) {
      return mui.toast('请输入密码')
    }
    $.ajax({
      url: '/user/login',
      data: { username, password },
      dataType: 'json',
      type: 'POST',
      success(info) {
        if (info.error) {
          return mui.toast('用户名或密码错误')
        }
        if (info.success) {
          location.href = location.search.slice(8) ? location.search.slice(8) : '/front/user.html'
        }
      }
    })
  })
})