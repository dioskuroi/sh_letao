$($ => {
  let currentPage = 1
  let pageSize = 2
  let proName = getHistory().shift()
  $('.search_input').val(proName)

  // 获取localStorage中的搜索历史记录
  function getHistory() {
    let history = localStorage.getItem('search_list') || '[]'
    return JSON.parse(history)
  }

  // 添加localstorage中的搜索历史记录
  function addHistory(data) {
    let arr = getHistory()
    arr.unshift(data)
    arr = [...new Set(arr)].slice(0, 10)
    localStorage.setItem('search_list', JSON.stringify(arr))
  }

  // 设置ajax请求中的排序参数
  function sortMethod(element) {
    if (!element.hasClass('current')) return
    return element.find('i').hasClass('fa-angle-down') ? 2 : 1
  }

  // 发送ajax获取参数
  function sendAjax() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const priceSort = sortMethod($('.price_btn'))
        const numSort = sortMethod($('.num_btn'))
        $.ajax({
          url: '/product/queryProduct',
          data: { proName, page: currentPage, pageSize, price: priceSort, num: numSort },
          dataType: 'json',
          success(info) {
            resolve(info)
          }
        })
      }, 800);
    })
  }

  // 设置高亮显示和切换字体图标
  function setClass(element) {
    if (element.hasClass('current')) {
      element.find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up')
    }
    else {
      element.addClass('current').siblings().removeClass('current')
    }
  }

  // 下拉刷新和上拉刷新初始化
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback() {
          currentPage = 1
          sendAjax().then(info => {
            const htmlStr = template('tpl', info)
            $('.lt_product ul').html(htmlStr)
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh()
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh()
          })
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up: {
        callback() {
          currentPage++
          sendAjax().then(info => {
            if (info.data.length === 0) {
              return mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true)
            }
            const htmlStr = template('tpl', info)
            $('.lt_product ul').append(htmlStr)
            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh()
          })
        }
      }
    }
  });

  // 搜索栏获取焦点时重置
  $('.search_input').on('focus', () => {
    $('.search_input').val('')
  })

  // 添加搜索功能
  $('.lt_search button').on('click', () => {
    proName = $('.search_input').val().trim().trim()
    if (proName === '') {
      return mui.toast('请输入搜索关键字')
    }
    addHistory(proName)
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
  })

  // 添加价格排序功能
  $('.price_btn').on('tap', function () {
    setClass($(this))
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()

  })

  // 添加库存排序功能
  // 在mui的下拉刷新区域中, a标签的click事件无效, 需要用tap(轻触)事件代替
  $('.num_btn').on('tap', function () {
    setClass($(this))
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()

  })

  // 点击商品跳转到详情页面
  $('.lt_product ul').on('tap', 'a', function () {
    const id = $(this).data('id')
    location.href = `/front/product.html?productId=${id}`
  })
})