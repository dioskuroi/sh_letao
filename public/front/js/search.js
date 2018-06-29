$($ => {

  // let testArr = ['1', '2', '3', '4']
  // localStorage.setItem('search_list', JSON.stringify(testArr))


  function getHistory() {
    let history = localStorage.getItem('search_list') || '[]'
    return JSON.parse(history)
  }

  function render() {
    const arr = getHistory()
    const htmlStr = template('tpl', { arr })
    $('.lt_history').html(htmlStr)
  }


  function deleteByIndex(index) {
    let arr = getHistory()
    arr.splice(index, 1)
    localStorage.setItem('search_list', JSON.stringify(arr))
  }

  function addHistory(data) {
    let arr = getHistory()
    arr.unshift(data)
    console.log(arr);
    arr = [...new Set(arr)].slice(0,10)
    localStorage.setItem('search_list',JSON.stringify(arr))
  }

  render()

  $('.lt_history').on('click', '.btn_delete', function () {
    const index = $(this).parent().data('index')
    deleteByIndex(index)
    render()
  })

  $('.lt_history').on('click', '.btn_clear', () => {
    mui.confirm('你是否要清空所有的历史记录?', '温馨提示', ['取消', '确定'], e =>{
      if (e.index !== 1) return
      localStorage.clear()
      render()
    })
  })

  $('.lt_search button').on('click', () => {
    const searchContent =$('.search_input').val().trim().trim()
    if (searchContent === '') {
      return mui.toast('请输入搜索关键字')
    }
    addHistory(searchContent)

    $('.search_input').val('')

    location.href = '/front/searchList.html'
  })

  $('.lt_history').on('click','a', function () {
    const proName = $(this).text()
    addHistory(proName)
    location.href = '/front/searchList.html'
  })
})