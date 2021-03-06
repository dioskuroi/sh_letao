$($ => {
  // 本地校验功能
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            max: 6,
            min: 2,
            message: '用户名长度必须在 2-6位'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            max: 12,
            min: 6,
            message: '密码长度必须在 6-12位'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  })

  // 获取校验实例
  const validator = $('#form').data('bootstrapValidator')

  // 重置表单功能
  $('#resetBtn').on('click', () => {
    validator.resetForm()
  })

  // 后台校验功能
  $('#form').on('success.form.bv', e => {
    e.preventDefault()
    $.ajax({
      url: '/employee/employeeLogin',
      type: 'POST',
      dataType: 'json',
      data: $('#form').serialize(),
      success(info) {
        if (info.success) {
          location.href = '/back/'
        }
        if (info.error === 1000) {
          validator.updateStatus('username', 'INVALID', 'callback')
        }
        if (info.error === 1001) {
          validator.updateStatus('password', 'INVALID', 'callback')
        }
      }
    })
  })

})
