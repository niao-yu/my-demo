$(function () {
  //生成用户
  var userMy = new (function () {
    // function random(){
    //   return 'a' + Math.ceil(Math.random() * 1000);
    // }
    this.homeId = '123';
    this.userId = 'a';
    this.user = 'a';
    this.userOtherId = 'b';
    this.userOther = 'b';
    this.close = false;
    this.containt = {
      giftType: '',
      giftNum: ''
    }
  })();
  var room = (function () {
    var waitJoin_top = 0;
    var otherMsg_bottom = '-5rem'
    return new function () {
      this.room = $('.room');//总room类名盒子
      this.other = $('.room .other');//对方的大盒子
      this.other_top = 0; //初始时距离顶部的距离
      this.waitJoin = $('.room .other .wait-join');//等待加入时的盒子
      this.waitJoin_top = waitJoin_top;//初始时距离顶部的距离
      this.otherMsg_bottom = otherMsg_bottom;
      this.close = $('.room .other .slide-close');//关闭按钮
      this.user = $('.room .user');//自己的大盒子
      this.user_bottom = '-2rem';//自己的盒子初始时距离底部的距离
      this.myGift = $('.room .user .my-gift');//我的礼物的盒子
      this.inputs = $('.room .user .inputs');//我的输入框功能盒子
      this.giftNum1 = 20;//礼物的数量
      this.giftNum2 = 2;//礼物的数量
      this.giftNum3 = 10;//礼物的数量
      this._giftNum1 = this.giftNum1;//保存礼物的数量
      this._giftNum2 = this.giftNum2;//保存礼物的数量
      this._giftNum3 = this.giftNum3;//保存礼物的数量
      this.timer = null;
      this.other_offset = {//对方头像位置的中心点坐标
        x: undefined,
        y: undefined
      };
      //当礼物有或没有时（'.item',true或false）
      this._giftLogoChange = function (dom, bool) {
        if (bool) {
          dom.find('.disabled').animate({ 'opacity': 0 }, 500, function () {
            $(this).remove();
          });
        } else {
          var span = $('<span>');
          span.addClass('disabled');
          dom.find('.gift-img').append(span);
          span.animate({ 'opacity': 1 }, 500);
        }
      };
      //礼物数量发生改变
      this.giftNumChange = function (dom, bool) {
        if (!dom) return;
        var _dom = dom.find('.gift-num');
        var index = _dom.attr('index');
        var bool_1 = !!room[index];
        bool ? room[index]++ : room[index]--;
        _dom.html(room[index]);
        var bool_2 = !!room[index];
        if (bool_1 !== bool_2) room._giftLogoChange(dom, bool_2);
      };
      //得到礼物
      this.getGift = function (giftType) {
        // console.log(2);
        var theDom = room.myGift.find('span[index=' + giftType + ']').parent().siblings('.gift-img');
        var gift = theDom.clone(true).removeClass('gift-img').addClass('moving');

        var w = theDom.width();
        var h = theDom.height();
        var _x = theDom.offset().left;
        var _y = theDom.offset().top;
        var y = room.other_offset.y - h / 2;
        var x = room.other_offset.x - w / 2;
        gift.css({ 'position': 'fixed', 'top': y, 'left': x, 'opacity': 0, transform: 'scale(.4,.4)' });
        $('body').append(gift);
        gift.animate({ 'top': _y / 2, 'left': _x / 2, 'opacity': 1, transform: 'scale(1,1)' }, 200, 'ease-out', function () {
          setTimeout(function () {
            gift.animate({ 'top': _y, 'left': _x, 'opacity': 0, transform: 'scale(.4,.4)' }, 400, 'ease-in', function () {
              gift.remove();
              room.giftNumChange(theDom.parent(), true);
            });
          }, 1);

        });
      }
      //初始化
      this.init = function () {
        giftNum1: this._giftNum1;
        giftNum2: this._giftNum2;
        giftNum3: this._giftNum3;
        //定义礼物数量
        this.myGift.find('.item .gift-num').each(function (k, v) {
          $(v).html(room['giftNum' + ++k]);
        });
        //绑定拖动送礼物事件
        this.myGift.on('touchstart', '.item', function (e) {
          var that = $(this);
          if (that.find('.disabled').length !== 0) return;
          var gift = that.find('.gift-img').clone(true).removeClass('gift-img').addClass('moving');
          var x = that.find('.gift-img').offset().left;
          var y = that.find('.gift-img').offset().top;
          gift.css({ 'position': 'fixed', top: y, left: x });
          $('body').append(gift);
          //获取按下的此时，触发点的坐标
          var _x = e.touches[0].clientX;
          var _y = e.touches[0].clientY;
          //鼠标拖动
          $('body').on('touchmove', function (e) {
            var moveX = e.touches[0].clientX - _x + x;
            var moveY = e.touches[0].clientY - _y + y;
            gift.css({ 'top': moveY, 'left': moveX });
            //实时判断是否进入成功的范围
            if (gift.offset().top < room.user.offset().top) {
              $('body').addClass('success');
            } else {
              $('body').removeClass('success');
            }
            //鼠标抬起
            $('body').on('touchend', function () {
              $('body').removeClass('success').off('touchend touchmove');
              //判断位置是否为赠送成功
              if (gift.offset().top < room.user.offset().top) { //成功
                var w = gift.width();
                var h = gift.height();
                var x_ = room.other_offset.x - w / 2;
                var y_ = room.other_offset.y - h / 2;
                gift.animate({ left: x_, top: y_, 'transform': 'scale(.4,.4)', 'opacity': 0 }, 300, function () {
                  gift.remove();
                });
                room.giftNumChange(that, false);
                //发送送出礼物的ajax
                // send(sendData({
                //   close: false,
                //   giftType: that.find('.gift-num').attr('index')
                // }));
              } else {//失败
                gift.animate({ 'left': x, 'top': y }, 100, function () {
                  gift.remove();
                });
              }
            });
          })
        });
        this.myGift.find('.item').each(function (k, v) {
          if ($(v).find('.gift-num').html() <= 0) room._giftLogoChange($(v), false);
        });
      }
    }
  })();
  // //发送的数据
  // function sendData(obj) {
  //   return {
  //     homeId: userMy.homeId,
  //     userId: userMy.userId,
  //     user: userMy.user,
  //     userOtherId: userMy.userOtherId,
  //     userOther: userMy.userOther,
  //     close: obj.close,
  //     giftType: obj.giftType,
  //     giftNum: 1
  //   };
  // }
  // //发送数据
  // function send(d) {
  //   console.log(d);
  //   function callback(data) {
  //     console.log(1, data);
  //   }
  //   $.ajax({
  //     url: 'http://192.168.137.169:8081/springmvc/home',
  //     type: 'get',
  //     data: sendData({ close: d.close, giftType: d.giftType }),
  //     dataType: 'jsonp',
  //     success: function (data) {
  //       console.log(2, data);
  //     },
  //     error: function (data) {
  //       console.log(3, data);
  //     }
  //   })
  // }
  // //获取数据
  // function get() {
  //   $.ajax({
  //     url: 'http://192.168.137.169:8081/springmvc/rehome',
  //     type: 'get',
  //     data: sendData({
  //       giftType: '',
  //       giftNum: '',
  //       close: false
  //     }),
  //     dataType: 'jsonp',
  //     success: function (data) {
  //       data = data.data;
  //       console.log(5, data);
  //       if (JSON.stringify(data) === '[]' || JSON.stringify(data) === '[{}]') return;
  //       if (data[0].close === 'true') {
  //         slideClose();
  //         clearInterval(room.timer);
  //         return;
  //       }
  //       var timer = null;
  //       timer = setInterval(function () {
  //         if (!!data && data.length !== 0 && data[0].containt.giftType == 0) {
  //           roomGo();
  //           console.log(1,'asdf');
  //           data.shift();
  //           clearInterval(timer);
  //           return ;
  //         }
  //         if (!data || data.length === 0) {
  //           clearInterval(timer);
  //           data.shift();
  //           return ;
  //         }
  //         console.log(2,'asdf');
  //         room.giftNumChange(room.getGift(data[0].containt.giftType), true);
  //         data.shift();
  //       }, 300);
  //     },
  //     error: function (data) {
  //       console.log(data);
  //     }
  //   });
  // }
  //点击生成二维码时
  $('.index .qr-code').on('tap', function () {
    clearInterval(room.timer);
    // room.timer = setInterval(function () {
    //   // console.log()
    //   get();
    // }, 1000);
    $('.index').animate({ 'opacity': 0 }, 200, function () {
      $('.index').css('opacity', 1).addClass('hide');
      $('.room').removeClass('hide');
      room.other.animate({ 'top': room.other_top }, 200);
      room.user.animate({ 'bottom': room.user_bottom }, 200);
    });
    $('.room .other .wait-join').css({ 'top': room.waitJoin_top, 'opacity': 1 });
    $('.room .other .other-msg').css('bottom', room.otherMsg_bottom);

  });
  //点击扫一扫时
  $('.index .scan').on('tap', function () {
    $('.index').animate({ 'opacity': 0 }, 200, function () {
      $('.index').css('opacity', 1).addClass('hide');
      $('.scan-tip').css('opacity', 0).removeClass('hide').animate({ 'opacity': 1 }, 200);
    });
  });
  //点击扫一扫，输入房间号+点击按钮
  (function () {
    function change() {
      $('.scan-tip div input').val('');
      $('.scan-tip').animate({ 'opacity': 0 }, 200, function () {
        $('.scan-tip').css('opacity', 1).addClass('hide');
        $('.index').removeClass('hide').css('opacity', 0).animate({ 'opacity': 1 });
      });
    }
    var bgc = $('.scan-tip div span').css('background-color');
    $('.scan-tip div span').off('tap').on('tap', change);
    $('.scan-tip div input').on('keyup', function () {
      if ($(this).val() !== '') {
        $('.scan-tip div span').html('加入').css('background-color', '#52ADE7');
        $('.scan-tip div span').off('tap').on('tap', function () {
          $('.scan-tip').addClass('hide');
          room.room.removeClass('hide');
          $('.scan-tip div input').val('');
          userMy.userId = 'b';
          userMy.user = 'b';
          userMy.userOtherId = 'a';
          userMy.userOther = 'a';
          // send({ close: false, giftType: 0 });
          // room.timer = setInterval(function () {
          //   get();
          // }, 1000);
          roomGo();
        });
      } else {
        $('.scan-tip div span').html('返回').css('background-color', bgc);
        $('.scan-tip div span').off('tap').on('tap', change);
      }
    });
  })();
  //
  function roomGo() {
    room.init();
    $('.other').animate({ 'top': '-4rem' }, 300, 'ease-out');
    $('.room .other .wait-join').animate({ 'top': '-4rem', 'opacity': 0 }, 400, 'ease-out');
    $('.room .other .other-msg').animate({ 'bottom': '.4rem' }, 400, 'ease-out', function () {
      var that = $(this).find('.user-img');
      var x = that.offset().left;
      var y = that.offset().top;
      var w = that.width();
      var h = that.height();
      room.other_offset.x = x + w / 2;
      room.other_offset.y = y + h / 2;
    });
    $('.user').animate({ 'bottom': 0 }, 300, 'ease-out');
    //点击自己头像,模拟对方送自己礼物动画
    $('.room .user .user-img').on('tap', function () {
      var giftType = 'giftNum2';
      room.getGift(giftType);
    });
  }
  //点击二维码时
  room.waitJoin.find('.qr-code').on('tap', roomGo);
  //点击关闭
  room.close.on('tap', function () {
    slideClose();
    // send({ close: true, giftType: undefined });
    clearInterval(room.timer);
  });
  //关闭函数
  function slideClose() {
    room.other.animate({ "top": -room.other.height() }, 100);
    room.user.animate({ "bottom": -room.user.height() }, 100, function () {
      $('.index').removeClass('hide').css('opacity', 0).animate({ 'opacity': '1' }, 100);
      room.room.addClass('hide');
    });
    room.myGift.off('touchstart', '.item');
    room.myGift.find('.disabled').remove();
    room.myGift.find('.gift-num').html('');
    $('.room .user .user-img').off('tap');
    // setTimeout(function() {
    //   window.location.reload();
    // }, 100);
  }
});

// var obj = {
//   userA: str,
//   userB: str,
//   homeId: str,
//   close: str,
//   containt: {
//     giftType: str,
//     giftNum: str
//   }
// }

// var objs = {
//   a2b(userB的id): arr,
//   b2a(userA的id): arr
// }
// var arr = [
//   {obj},
//   {obj},
//   {obj}
// ];