$($ => {
  let proName = getHistory().shift()
  $('.search_input').val(proName)

  function getHistory() {
    let history = localStorage.getItem('search_list') || '[]'
    return JSON.parse(history)
  }

  function addHistory(data) {
    let arr = getHistory()
    arr.unshift(data)
    arr = [...new Set(arr)].slice(0, 10)
    localStorage.setItem('search_list', JSON.stringify(arr))
  }

  function sortMethod(element) {
    if (!element.hasClass('current')) return 
    return element.find('i').hasClass('fa-angle-down') ? 2 : 1
  }

  function render() {
    $('.lt_product ul').html('<div id="loading"></div>')
    setTimeout(() => {
      const priceSort = sortMethod($('.price_btn'))
      const numSort = sortMethod($('.num_btn'))
      $.ajax({
        url: '/product/queryProduct',
        data: { proName, page: 1, pageSize: 100, price: priceSort, num: numSort },
        dataType: 'json',
        success(info) {
          // console.log(info);

          const htmlStr = template('tpl', info)
          $('.lt_product ul').html(htmlStr)
        }
      })
    }, 800);
  }

  function setClass(element) {
    if (element.hasClass('current')) {
      element.find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up')
    }
    else {
      element.addClass('current').siblings().removeClass('current')
    }
  }

  render()

  $('.search_input').on('focus', () => {
    $('.search_input').val('')
  })

  $('.lt_search button').on('click', () => {
    proName = $('.search_input').val().trim().trim()
    if (proName === '') {
      return mui.toast('请输入搜索关键字')
    }
    addHistory(proName)
    render()

  })

  $('.price_btn').on('click',function () {
    setClass($(this))
    render()
  })

  $('.num_btn').on('click',function () {
    setClass($(this))
    render()
  })
})