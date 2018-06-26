$($ => {
  let currentPage = 1
  let pageSize = 5

  // 渲染表格
  function render() {
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      data: { page: currentPage, pageSize },
      dataType: 'json',
      success(info) {
        const htmlStr = template('tpl', info)
        $('tbody').html(htmlStr)

        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size: "small",//设置控件的大小，mini, small, normal,large
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

  // 添加分类按钮功能
  $('#addBtn').on('click', () => {
    // 显示模态框
    $('.modal_add').modal('show')
    // 获取一级分类名称并设置到下拉菜单中
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      data: {page:1,PageSize:100},
      dataType: 'json',
      success(info) {
        const htmlStr = template('dropdownTpl',info)
        $('.dropdown-menu').html(htmlStr)
      }
    })
  })

  $('.dropdown-menu').on('click','a',function () {
    // 设置下拉按钮的值为选中项
    const txt = $(this).text()
    $('#dropdownTxt').text(txt)

    // 存储categoryId值到隐藏域中
    const id = $(this).data('id')
    $('[name=categoryId]').val(id)

    // 更新下拉菜单校验状态
    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID')
  })

  // 上传图片插件
  $("#fileUpload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data.result.picAddr);
      // 设置img的src
      $('.form-group img').attr('src',data.result.picAddr)

      // 将img的src存储到隐藏域中
      $('[name=brandLogo]').val(data.result.picAddr)

      // 更新上传图片校验状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID')
    }
  });

  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类名称'
          }
        }
      },
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传图片'
          }
        }
      }
    }
  })

  $('#form').on('success.form.bv',e=>{
    e.preventDefault()
    $('.modal_add').modal('hide')
    $.ajax({
      url: '/category/addSecondCategory',
      type: 'POST',
      data: $('#form').serialize(),
      dataType: 'json',
      success(info) {
        if (info.success) {
          currentPage = 1
          render()
          $('#form').data('bootstrapValidator').resetForm(true)
          $('#dropdownTxt').text('请选择一级分类')
          $('.form-group img').attr('src','./images/none.png')
        }
      }
    })
  })
})