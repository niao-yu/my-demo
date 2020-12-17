// 绑定激活和离开的方法
function pageWatch(objData, success) {
  var _this = this
  _this.status = undefined // 当前的状态
  _this.visibleNum = undefined // 离开的次数
  _this.hiddenNum = undefined // 归来的次数
  _this._prefix = undefined // 前缀
  _this._eventName = undefined // 浏览器监听事件的事件名，可能需要加前缀
  _this._attributeName = undefined // 浏览器获取当前状态的事件名，可能需要加前缀
  _this._nowEvent = undefined // 当前绑定的归来或离开的事件们
  _this._init = function (eventObj) {
    _this.status = undefined
    _this.visibleNum = 0
    _this.hiddenNum = 0
    _this._nowEvent = {}
    // 判断浏览器是否支持
    _this._prefix = null // 前缀
    if ('hidden' in document) _this._prefix = '';
    else {
      var prefixes = ['webkit', 'moz', 'ms', 'o'];
      for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'Hidden') in document)
          _this._prefix = prefixes[i]
        break
      }
    }
    let obj = { // 记录浏览器支持情况
      reload: true,
      visible: true,
      hidden: true
    }
    if (_this._prefix === null) {
      obj.visible = false
      obj.hidden = false
    }
    _this._eventName = (_this._prefix ? _this._prefix + 'Hidden' : 'hidden').replace(/[H|h]idden/, '') + 'visibilitychange';
    _this._attributeName = _this._prefix ? _this._prefix + 'VisibilityState' : 'visibilityState';
    // 如果初始化时传入了事件对象
    if (typeof (eventObj) === 'object' && Array.isArray(eventObj) === false) _this.add(objData)
    _this._eventChange.updataEvent(obj) // 监听事件，一直监听
    success && success(obj)
  }
  // 移除事件监听
  _this.removeEvent = function() {
    _this._eventChange.removeEvent()
  }
  _this.add = function (eventObj) {
    if (!(typeof (eventObj) === 'object' && Array.isArray(eventObj) === false)) return new Error(eventObj, ' 不是对象')
    // 更新要绑定的事件
    for (var key in eventObj) {
      if (key === 'visible' || key === 'hidden' || key === 'reload') {
        _this._nowEvent[key] = eventObj[key]
      }
    }
  }
  // _this.remove 需要的字符串判断和处理函数
  _this._remove_handle = function(string) {
    if (string === 'visible' || string === 'hidden' || string === 'reload') {
      delete _this._nowEvent[string]
    }
  }
  _this.remove = function (eventNames) {
    if (typeof (eventNames) !== 'string' && Array.isArray(eventNames) !== true) return new Error(eventNames, ' 不是 string 且不是 array')
    // 更新要绑定的事件
    if (typeof (eventNames) === 'string') _this._remove_handle(eventNames)
    else if (Array.isArray(eventNames)) {
      for (let i = 0; i < eventNames.length; i++) {
        _this._remove_handle(eventNames[i])
      }
    }
  }
  // 内部更新事件
  _this._eventChange = (function () {
    var inside_event = {
      hidden: function () {
        _this.hiddenNum++ // 更新离开的次数
        _this.status = 'hidden'
        _this._nowEvent.hidden && _this._nowEvent.hidden(_this)
      },
      visible: function () {
        _this.visibleNum++ // 更新归来的次数
        _this.status = 'visible'
        _this._nowEvent.visible && _this._nowEvent.visible(_this)
      },
      reload: function (e) {
        if (!_this._nowEvent.reload) return false
        var needTip = {} // 用于判断是否需要浏览器弹窗提醒
        _this._nowEvent.reload && _this._nowEvent.reload(_this, needTip)
        // 判断是否需要浏览器弹窗提醒
        if (typeof(needTip) === 'object') {
          var bool = false
          for (var key in needTip) {
            if (needTip[key]) {
              bool = true
              break
            }
          }
          // 需要阻止
          if (bool) {
            var confirmationMessage = "\o/";
            (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
            return confirmationMessage;  
          }
        }
      }
    }
    // 监听到页面前后台切换发生了变化
    var insideFn_show = function () {
      inside_event[document[_this._attributeName]]()
    }
    // 监听到页面更新了
    var insideFn_reload = function() {
      inside_event['reload']()
    }
    return {
      updataEvent: function (obj) {
        obj.visible && document.addEventListener(_this._eventName, insideFn_show, false)
        window.addEventListener('beforeunload', insideFn_reload, false)
      },
      removeEvent: function() {
        document.removeEventListener(_this._eventName, insideFn_show, false)
        window.removeEventListener('beforeunload', insideFn_reload, false)
      }
    }
  })()
  _this._init(objData)
}