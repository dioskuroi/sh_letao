$($ => {
  let currentPage = 1
  let pageSize = 2
  function render() {
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      data: { page: currentPage, pageSize },
      dataType: 'json',
      success(info) {
        const htmlStr = template('tpl', info)
        $('tbody').html(htmlStr)

        $('#paginator').bootstrapPaginator({
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

  $('#addBtn').on('click', () => {
    $('.modal_add').modal('show')

    $('#form').bootstrapValidator({
      //2. 指定校验时的图标显示，默认是bootstrap风格
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },

      fields: {
        categoryName: {
          validators: {
            notEmpty: {
              message: '请输入一级分类名称'
            }
          }
        }
      }
    })
  })
  $('#form').on('success.form.bv',e=>{
    e.preventDefault()
    $('.modal_add').modal('hide')
    $.ajax({
      url: '/category/addTopCategory',
      type: 'POST',
      data: $('#form').serialize(),
      dataType: 'json',
      success(info) {
        if (info.success) {
          currentPage = 1
          render()
          $('#form').data('bootstrapValidator').resetForm(true)
        }
      }
    })
  })

})