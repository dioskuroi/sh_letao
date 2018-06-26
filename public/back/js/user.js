$($ => {
  let currentPage = 1
  let pageSize = 5
  let id
  let isDelete
  function render() {
    $.ajax({
      url: '/user/queryUser',
      data: { page: currentPage, pageSize },
      dataType: 'json',
      success(info) {
        // console.log(info)
        // 模板渲染
        const htmlStr = template('tpl', info)
        $('tbody').html(htmlStr)

        // 分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size: "normal",//设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page
            render()
          }
        })

      }
    })
  }
  render()

  $('tbody').on('click','.btn',function () {
    $('.modal_disable').modal('show')
    id = $(this).parent().data('id')
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1
  })

  $('#confirm').on('click',()=>{
    $('.modal_disable').modal('hide')
    $.ajax({
      url: '/user/updateUser',
      type: 'POST',
      data: {id, isDelete},
      dataType: 'json',
      success() {
        render()
      }
    })
  })
})