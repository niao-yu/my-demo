window.toast = obj => {
  // {
  //   message, // 消息内容
  //   color, // 非必填-字体颜色
  //   type, // 非必填-消息类型
  //   background, // 非必填-弹框背景色
  //   border, // 非必填-弹框边框样式
  //   timer, // 非必填-定时消失时长
  // }
  let dom = $('.toast-box')
  clearTimeout(window.toastTimer)
  if (!dom.length) {
    dom = $('<div><div></div></div>')
    $('body').append(dom)
  }
  let color = obj.color || '#71c844'
  if (obj.type) {
    if (obj.type === 'warn') color = '#dda639'
    else if (obj.type === 'error') color = '#e9392a'
  }
  dom.css({
    'position': 'fixed',
    'top': '10%',
    'left': '50%',
    'width': '100%',
    'transform': 'translateX(-50%)',
    'display': 'none',
    'justify-content': 'center',
    'opacity': 0,
    'z-index': '1000',
  })
  dom.children('div').html(obj.message).css({
    'background': obj.background || '#fff',
    'font-size': '16px',
    'color': color,
    'display': 'inline-block',
    'max-width': '90%',
    'border-radius': '3px' || obj['border-radius'],
    'border': obj.border || '',
    'padding': '10px 20px',
    'box-shadow': '0 0 2px ' + color,
  })
  dom.addClass('toast-box').css('display', 'flex').animate({ 'opacity': 1 }, () => {
    window.toastTimer = setTimeout(() => {
      dom.animate({ 'opacity': 0 }, () => {
        dom.css('display', 'none')
      })
    }, obj.timer || 3000)
  })
}