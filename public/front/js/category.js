$($ => {
  function renderById(id) {
    $.ajax({
      url: '/category/querySecondCategory',
      data: { id },
      dataType: 'json',
      success(info) {
        const htmlStr = template('secondTpl', info)
        $('.lt_right ul').html(htmlStr)
      }
    })
  }

  $.ajax({
    url: '/category/queryTopCategory',
    dataType: 'json',
    success(info) {
      // console.log(info);
      
      const htmlStr = template('tpl', info)

      $('.lt_left ul').html(htmlStr)
      renderById(info.rows[0].id)
    }
  })

  $('.lt_left ul').on('click', 'a', function () {
    $(this).addClass('current').parent().siblings().find('a').removeClass('current')

    renderById($(this).data('id'))
  })


})