$($ => {
  let currentPage = 1
  let pageSize = 2
  const picArr = []
  let ajaxData
  function render() {
    $.ajax({
      url: '/product/queryProductDetailList',
      data: { page: currentPage, pageSize },
      dataTye: 'json',
      success(info) {
        // console.log(info);
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
          },
          itemTexts(type, page) {
            switch (type) {
              case 'first':
                return '首页'
              case 'last':
                return '尾页'
              case 'prev':
                return '上一页'
              case 'next':
                return '下一页'
              case 'page':
                return page
            }
          },
          tooltipTitles(type, page) {
            switch (type) {
              case 'first':
                return '首页'
              case 'last':
                return '尾页'
              case 'prev':
                return '上一页'
              case 'next':
                return '下一页'
              case 'page':
                return `前往第${page}页`
            }
          },
          useBootstrapTooltip: true

        })
      }
    })
  }
  render()

  $('#addBtn').on('click', () => {
    $('.modal_add').modal('show')

    $.ajax({
      url: '/category/querySecondCategoryPaging',
      data: { page: 1, pageSize: 100 },
      dataType: 'json',
      success(info) {
        // console.log(info);

        const htmlStr = template('dropdownTpl', info)
        $('.dropdown-menu').html(htmlStr)
      }
    })
  })

  $('.dropdown-menu').on('click', 'a', function () {
    const txt = $(this).text()
    $('#dropdownTxt').text(txt)

    $('[name=brandId]').val($(this).data('id'))

    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID')
  })

  $('#fileUpload').fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      picArr.push(data.result)
      const img = new Image(100, 100)
      img.src = data.result.picAddr
      $('.imgBox').prepend(img)

      if (picArr.length > 3) {
        picArr.shift()
        $('.imgBox img:nth-of-type(4)').remove()
      }

      if (picArr.length == 3) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID')
        console.log(picArr);

        ajaxData = picArr.map((ele, index) => {
          let str = ''
          Object.keys(ele).forEach(key => {
            str += `&${key + (index + 1)}=${ele[key]}`
          })
          return str
        }).join('')

      }
      else {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'INVALID')
      }
    }
  })

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
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^(?!0)\d+$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品尺码'
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 xx-xx 例如: 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品价格'
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传3张图片'
          }
        }
      },
    }
  })

  $('#form').on('success.form.bv', e => {
    e.preventDefault()
    
    $('.modal_add').modal('hide')
    ajaxData = $('#form').serialize() + ajaxData

    $.ajax({
      url: '/product/addProduct',
      data: ajaxData,
      dataType: 'json',
      type: 'POST',
      success(info) {
        if (info.success) {
          currentPage = 1
          render()
        }
      }
    })
  })
})