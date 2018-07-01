$($ => {
  function render() {
    setTimeout(() => {
      $.ajax({
        url: '/cart/queryCart',
        dataType: 'json',
        success(info) {
          if (info.error ===400) {
            location.href = '/front/login.html'
          }
          console.log(info);
          const htmlStr = template('tpl', { info })
          $('.mui-table-view').html(htmlStr)
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh()
        }
      })
    }, 500);
  }

  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback() {
          render()
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

  $('.mui-table-view').on('tap', '.btn_delete', function () {
    const id = $(this).data('id')
    mui.confirm('你是否要删除这个商品?', '温馨提示', ['否', '是'], e => {
      if (e.index !== 1) return
      $.ajax({
        url: '/cart/deleteCart',
        data: { id },
        dataType: 'json',
        success(info) {
          if (info.success) {
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
          }
        }
      })
    })

  })

  $('.mui-table-view').on('tap', '.btn_edit', function () {
    const data = this.dataset
    const htmlStr = template('editTpl', data).replace(/\n/g, '')
    mui.confirm(htmlStr, '编辑商品', ['确定', '取消'], e => {
      if (e.index !== 0) return
      const id = $(this).data('id')
      const num = $('.mui-numbox-input').val()
      const size = $('.pro_size span.current').text()

      $.ajax({
        url: '/cart/updateCart',
        data: {id, size, num},
        dataType: 'json',
        type: 'POST',
        success(info) {
          if (info.success) {
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
          }
        }
      })
    })

    $('body').on('click', '.pro_size span', function () {
      $(this).addClass('current').siblings().removeClass('current')
    })
    mui('.mui-numbox').numbox()
  })

  $('.mui-table-view').on('change', '.ck', () => {
    let total = 0
    $('.ck:checked').each((index, ele) => {
      total += $(ele).data('price') * $(ele).data('num')
    })
    $('.lt_total span').text(total.toFixed(2))
  })
})