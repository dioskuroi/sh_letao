$($ => {


  $.ajax({
    url: '/user/queryUserMessage',
    dataType: 'json',
    success(info) {
      console.log(info);
      if (info.error===400) {
        location.href = '/front/login.html'
      }
      const htmlStr = template('tpl', info)
      $('.mui-media').html(htmlStr)
    }
  })

  $('.logout').on('click',() => {
    $.ajax({
      url: '/user/logout',
      dataType: 'json',
      success(info) {
        if (info.success) {
          location.href = '/front/login.html'
        }
      }
    })
  })  
})