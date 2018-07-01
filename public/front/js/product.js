$($ => {
  let size
  const id = getSearchParam('productId')
  $.ajax({
    url: '/product/queryProductDetail',
    data: { id },
    dataType: 'json',
    success(info) {
      console.log(info);
      const arr = info.size.split('-')
      const sizeArr = []
      for (let i = arr[0]; i <= arr[1]; i++) {
        sizeArr.push(i)
      }
      info.sizeArr = sizeArr
      const htmlStr = template('tpl', info)
      $('.mui-scroll').html(htmlStr)

      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 3000//自动轮播周期，若为0则不自动播放，默认为0；
      })
      mui('.mui-numbox').numbox()
    }
  })

  $('.mui-scroll').on('click',' .pro_size span',function () {
    size = $(this).text()
    $(this).addClass('current').siblings().removeClass('current')
  })

  $('#go-cart').on('click',() => {
    const num = mui('.mui-numbox').numbox().getValue()
    if (!size) return mui.toast('请选择尺码')
    $.ajax({
      url: '/cart/addCart',
      data: {
        productId: id,
        num,
        size
      },
      dataType: 'json',
      type: 'POST',
      success(info) {
        if (info.error === 400) {
          location.href= `/front/login.html?retUrl=${location.href}`
        }
        if (info.success) {
          mui.confirm('添加成功','温馨提示',['去购物车', '继续浏览'],function (e) {
            if (e.index === 0) {
              location.href = '/front/cart.html'
            }
          })
        }
      }
    })
  })

  
})