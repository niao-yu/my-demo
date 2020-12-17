$(function () {
  var game = {
    shade: $('.shade'),
    gameCon: $('.shade .shade-con'),
    title: $('.shade .shade-con > h2'),
    game: $('.input-msg .left').eq(1),
    choose: $('.shade .choose'),
    gameSelect: $('.game .game-select'),
    gamePeople: $('.game .game-people'),
    gameWait: $('.game .game-wait'),
    gameBox: $('#game'),
    gameRank: $('#game .game-rank'),
    timer: null,
    msg: {
      name: '',
      id: '',
      friends: []
    },
    //关闭按钮
    close: function () {
      $('.shade').animate({ 'opacity': 0 }, 200, function () {
        $('.shade').css('display', 'none');
        game.init();
      });
      clearTimeout(game.timer);
      game.timer = setTimeout(function () {
        $('.shade .shade-con').animate({ 'opacity': 0, 'transform': 'translateX(-50%) translateY(-50%) scale(0.4,0.4)' }, 100);
      }, 100);
    },
    //初始化
    init: function () {
      this.titleConfig('选择游戏', false, false);
      this.gameSelect.removeClass('hide');
      this.gameCon.css('display', 'block');
      this.choose.addClass('hide');
      this.gamePeople.addClass('hide');
      this.gameWait.addClass('hide');
      this.gameRank.addClass('hide');
      this.choose.find('.yes').addClass('disabled');
      clearInterval(game.timer);
      clearTimeout(game.timer);
      // game.gameBox.html('');
      game.msg = {};
      var _ul = '';
      for (var i = 0; i < 20; i++) {
        _ul += '<li><i class="iconfont icon-xuanze"></i><span class="friend-logo"></span><span class="friend">好友' + (i + 1) + '</span><b>' + i + '</b></li>'
      }
      this.gamePeople.find('ul').html(_ul);

    },
    //设置title的值和按钮
    titleConfig: function (str, logoUrl, boolBack) {
      var iconBack = game.title.find('.back');
      var gameLogo = game.title.find('.game-logo');
      game.title.find('span').html(str);
      boolBack ? iconBack.removeClass('hide') : iconBack.addClass('hide');
      if (logoUrl) gameLogo.removeClass('hide').css({ 'background-image': 'url(' + logoUrl + ')' });
      else gameLogo.addClass('hide');
    },
    //点击确认后的动画
    change: function (dom1, dom2, fn) {
      var hS = parseInt(dom1.css('height'));
      var hE = parseInt(dom2.css('height'));
      dom1.css({ 'height': hS, 'opacity': 1 });
      dom2.css({ 'height': hE, 'opacity': 0 });
      dom1.animate({
        opacity: 0,
        height: hE
      }, 200, function () {
        dom1.css({ 'opacity': 1, 'height': hS }).addClass('hide');
        dom2.removeClass('hide').css({ 'opacity': 0 }).animate({ 'opacity': 1 }, 200);
        fn ? fn(dom2) : game.init();
      });
    }
  };
  //初始化
  game.init();
  //游戏主按钮
  game.game.on('touchstart', function () {
    $('.shade').css({ 'display': 'block', 'opacity': 0 }).animate({ 'opacity': 1 }, 200);
    $('.shade .shade-con').css({ 'opacity': 0, 'transform': 'translateX(-50%) translateY(-50%) scale(0.4,0.4)' });
    clearTimeout(game.timer);
    game.timer = setTimeout(function () {
      $('.shade .shade-con').animate({ 'opacity': 1, 'transform': 'translateX(-50%) translateY(-50%) scale(1,1)' }, 100);
    }, 100);
  });
  //关闭按钮
  game.shade.on('touchstart', '.close', function () {
    game.close();
  });
  //绑定选择好友的事件
  game.gamePeople.on('touchstart', 'li', function () {
    var li = $(this);
    if (li.hasClass('iconfont-true')) {
      li.removeClass('iconfont-true');
    } else {
      li.addClass('iconfont-true');
    }
    //判断确定按钮是否可用
    var confirm = game.choose.find('.yes');
    if (game.gamePeople.find('ul li.iconfont-true').length) {
      confirm.removeClass('disabled');
    } else {
      confirm.addClass('disabled');
    }
  });
  //绑定确认按钮
  // game.choose.find('.yes').on('touchstart', function () {
  //   if ($(this).hasClass('disabled')) return;
  //   goGame();
  // });
  //绑定back按钮
  game.title.find('.back').on('touchstart', function () {
    game.change(game.gamePeople, game.shade.find('.game-select'));
  });
  //选择好友的页面的函数
  // function choosePeople(people) {
  //   game.titleConfig('选择好友', false, true);
  //   game.choose.removeClass('hide');
  //   game.gamePeople.find('li').removeClass('iconfont-true');
  // }
  //选择游戏
  game.gameSelect.on('touchstart', 'span.item', function () {
    goGame();
  });
  //完成游戏
  // window.gameEnd = function (data) {
  //   game.gameBox.addClass('hide');
  //   game.gameCon.css('display', 'block');
  //   game.titleConfig('排行榜', false, false);
  //   game.gameRank.removeClass('hide');
  //   gameRank(data);
  // }
  //游戏时间到的函数(排名)
  // function gameRank(data) {
  //   var numAll = [data];
  //   for (var i = 0; i < game.msg.friends.length; i++) {
  //     var num = data + Math.ceil(Math.random() * 10 - 7) * 50;
  //     if (num < 0) num = 0;
  //     numAll.push(num);
  //   }
  //   numAll.sort(function (a, b) { return b - a });
  //   var ul = '';
  //   var bool = false;
  //   for (var i = 0; i <= game.msg.friends.length; i++) {
  //     if (numAll[0] === data && !bool) {
  //       ul += '<li><span>' + (i + 1) + '、</span><span>您</span>';
  //       ul += '<span>的分数：' + numAll.shift() + '</span></li>';
  //       bool = true;
  //     } else {
  //       ul += '<li><span>' + (i + 1) + '、</span><span>' + game.msg.friends[Math.floor(Math.random() * game.msg.friends.length)] + '</span>';
  //       ul += '<span>的分数：' + numAll.shift() + '</span></li>';
  //     }
  //   }
  //   $('.game .paiming').html(ul);
  // }
  //其他输入
  // var other = $('.footer .other');
  // $('.input-other').on('touchstart', '.item', function () {
  //   other.animate({ 'height': '3.4rem' }, 100);
  // });
  // goGame();
  function goGame() {
    //设置背景草地
    $('#game').css('background-image', 'url("./img/grass.png")');
    $('#game').css({ 'opacity': 0, 'display': 'block' });
    $('#game .advise').css('height', $('body').height() - $('#game .game-box').height());
    $('#game').animate({ 'opacity': 1 }, 500);
    var otherBoxData = {
      width: $('#game .other-box').width(),
      height: $('#game .other-box').height()
    };
    var otherGrigData = {
      width: $('#game .other-box .other-people .grig').width(),
      height: $('#game .other-box .other-people .grig').height(),
    }
    // console.log(otherGrigData);
    var gameTime = 60;
    //总倒计时
    function progressBar() {
      //换算为多少毫秒
      var gameTimer = null;
      var time = grig.gameTime;
      clearInterval(grig.gameTimer);
      // console.log(grig.timeDom[0]);
      // console.log(grig.progressBar[0]);
      // var timeDom = grig.progressBar.parent().find('.time span');
      grig.gameTimer = setInterval(function () {
        grig.timeDom.html(--time);
        grig.progressBar.css('width', time / grig.gameTime * 100 + '%')
        if (time === -1) {
          gameOver();
        }
      }, 1000);
    }
    //游戏结束，打开排名
    function gameOver() {
      clearInterval(grig.gameTimer);
      var kill = 0,
        bite = 0;
      for (var k in grig.grade) {
        kill += grig.grade[k].kill;
        bite += grig.grade[k].bite;
      }
      var obj = {
        name: '我',
        kill: kill,
        bite: bite,
        qudou: bite * 10 + kill * 20,
        box: kill
      }
      gameRank(obj);
    }
    //绑定关闭排名的按钮
    $('#game .game-rank .close').on('touchstart', function () {
      $('.shade').css('display', 'none');
      setTimeout(function () {
        $('#game').animate({ 'opacity': 0 }, 500, function () {
          location.reload();
        });
      }, 100);

    });
    //初始化对象
    var grig = (function () {
      //初始化圆形进度条
      function radObj() {
        return radialIndicator($('#game .my-box'), {
          displayNumber: false,
          barWidth: 4,
          initValue: 0,
          roundCorner: true,
          percentage: true,
          barColor: {
            0: '#0f0',
            // 29: '#0f0',
            // 30: '#ff0',
            // 89: '#ff0',
            // 90: '#f00',
            100: '#f00'
          }
        });
      }
      //End 配置圆形进度条
      var otherGrigs = $('#game .other-box .other-people');
      function fn() {
        this.otherBox = $('#game .other-box');
        this.otherBoxData = otherBoxData;
        this.otherGrigs = otherGrigs;
        this.otherGrigData = otherGrigData;
        this.myBox = $('#game .my-box');
        this.time = 3; //蓄力倒计时
        this.sendTimer = null;
        this.radObj = radObj();
        this.myGrig = $('#game .game-box > .grig');
        this.progressBar = $('#game .progress-bar span');//倒计时条
        this.advise = $('#game .advise');
        this.myGrigData = {
          x: this.myGrig.offset().left + this.myGrig.width() / 2,
          y: this.myGrig.offset().top + this.myGrig.height() / 2
        };
        //判断是否拉开自己的蛐蛐
        this.bool = false;
        this.goldBox = null; //宝箱的盒子
        this.timeDom = $('#game .progress-bar .time span');
        this.rank = $('#game .game-rank'); //排名
        this.gameTime = gameTime;//游戏总时间
        this.gameTimer = null;//游戏总时间定时器
        this.mightNum = $('#game .might .mightNum span');
        // this.maxLength = 1 * length; //最大的射出距离，我的蛐蛐到左上角对角的距离
        this.touchingData = {
          moveX: '',
          moveY: '',
          degTemp: '',
          deg: '',
          might: ''
        }
        //保存击杀、咬中次数情况
        this.grade = {
          a1: {
            kill: 0,
            bite: 0
          },
          a2: {
            kill: 0,
            bite: 0
          },
          a3: {
            kill: 0,
            bite: 0
          }
        }
        this.might = $('#game .game-box .might span');
        var length = Math.pow((Math.pow(this.myGrigData.x, 2) + Math.pow(this.myGrigData.y, 2)), 1 / 2);
        this.mightMax = length;
        this.radObjInit = function () {
          clearInterval(grig.sendTimer);
          $('#game .my-box canvas').remove();
          this.radObj = radObj();
        };
        //发射倒计时
        this.sendDown = function () {
          //设定总时长 s
          var time = grig.time - 1;
          var tempNum = 0;
          clearInterval(grig.sendTimer);
          grig.sendTimer = setInterval(function () {
            grig.radObj.value(++tempNum * 10 / time);
            if (tempNum * 10 / time > 100) {
              clearInterval(grig.sendTimer);
              sendAfter();
            }
          }, 100);
        };
        //发射落地后
        this.send = function (x, y) {
          grig.myGrig.find('img')[0].src = './img/蛐蛐_爬行.png';
          var center1 = {
            x: x,
            y: y + grig.otherGrigData.height / 2,
          }
          // var span = $('<span>');
          // span.css({
          //   'width': '10px',
          //   'height': '10px',
          //   'position': 'fixed',
          //   'top': center1.y + 'px',
          //   'left': x + 'px',
          //   'background': 'red',
          //   'transform': 'translateX(-50%) translateY(-50%)'
          // })
          // $('body').append(span);
          var tempArr_1 = [];
          var tempArr_2 = [];
          for (var i = 0; i < grig.otherGrigs.length; i++) {
            var center2 = {
              x: $(grig.otherGrigs[i]).offset().left + grig.otherGrigData.width / 2,
              y: $(grig.otherGrigs[i]).offset().top + grig.otherGrigData.height / 2
            }
            var distance = Math.pow((Math.pow((center1.x - center2.x), 2) + Math.pow((center1.y - center2.y), 2)), 1 / 2);
            if (distance < 50) {
              tempArr_1.push($(grig.otherGrigs[i]));
            }
          }
          if (tempArr_1.length) { // 咬住了
            //移除我的蛐蛐
            grig.myGrig.remove();
            //新建打架图片
            var span = $('<span>');
            span.addClass('tussle');
            span.html('<img src="./img/tussle.gif" alt="">');
            span.css({
              'left': center1.x,
              'top': center1.y,
              'opacity': 0,
              'transform': 'translateX(-50%) translateY(-50%) scale(0.4,0.4)'
              // 'background-image': 'url("../img/tussle.gif")'
            });
            $('body').append(span);
            span.animate({ 'opacity': 1, 'transform': 'translateX(-50%) translateY(-50%) scale(1,1)' }, 100, 'ease-in');
            //编辑咬中的
            for (var i = 0; i < tempArr_1.length; i++) {
              // 获取被咬住盒子的位置和index，并存入 tempArr_2
              var tempObj = {
                x: tempArr_1[i].offset().left,
                y: tempArr_1[i].offset().top,
                index: tempArr_1[i].attr('index'),
                name: tempArr_1[i].attr('name')
              };
              tempArr_2.push(tempObj);
              //新建一个咬中的弹出提示
              var str = '<span class="fr">咬中了' + tempObj.name + '</span>';
              var div = $('<div>');
              div.html(str);
              grig.advise.prepend(div);
              tempArr_1[i].remove();
              //获取index，得知咬中的哪一个
              var witch = tempObj.index;
              grig.grade[witch].bite++;
              //判断是否击杀
              if (grig.grade[witch].bite === 3) {
                grig.grade[witch].kill = 1;
                //新建击杀提示
                var str = '<span class="fr kill">击杀了' + tempObj.name + '！</span>';
                var div = $('<div>');
                div.html(str);
                grig.advise.prepend(div);
              }
            }
            setTimeout(function () {
              $('body .tussle').animate({ 'opacity': 0, 'transform': 'translateX(-50%) translateY(-50%) scale(0.4,0.4)' }, 100, 'ease-out', function () {
                $('body .tussle').remove();
                //新建蛐蛐，重新爬
                newOtherGrig(tempArr_2);
                //我的蛐蛐重新出现
                hideAndShow();
                //判断是否全部击杀
                var killNum = 0;
                for (var k in grig.grade) {
                  killNum += grig.grade[k].kill;
                }
                if (killNum === 3) {
                  gameOver();
                }
              });
            }, 1500);
          } else {//没有咬住
            grig.myGrig.css('opacity', 1);
            setTimeout(function () {
              grig.myGrig.animate({ 'opacity': 0 }, 1000, function () {
                grig.myGrig.remove();
                hideAndShow();
              });
            }, 100);
          }
          //我的蛐蛐重新出现
          function hideAndShow() {
            // grig.myGrig.css('opacity', 1);
            // setTimeout(function () {
            // grig.myGrig.animate({ 'opacity': 0 }, 1000, function () {
            // grig.myGrig.remove();
            var tempMyGirg = grig.myGrig.clone(false);
            tempMyGirg[0].style = '';
            tempMyGirg.css('opacity', 0);
            $('#game .game-box').append(tempMyGirg);
            tempMyGirg.animate({ 'opacity': 1 }, 500, function () {
              grig.myGrig = tempMyGirg;
              //绑定事件
              tempMyGirg.on('touchstart', downGrig);
            });
            // });
            // }, 500);
          }
          //新建蛐蛐，重新爬
          function newOtherGrig(tempArr_2) {
            for (var i = 0; i < tempArr_2.length; i++) {
              //如果已击杀
              if (grig.grade[tempArr_2[i].index].kill === 1) continue;
              //如果未击杀
              var srcArr = ['./img/蛐蛐_爬行_包.gif', './img/蛐蛐_爬行_绷带.gif'];
              var str = '<div class="grig" index="' + tempArr_2[i].index + '"><img src=' + srcArr[grig.grade[tempArr_2[i].index].bite - 1] + ' alt=""></div>';
              var otherGrig = $('<div>');
              otherGrig.addClass('other-people').html(str);
              otherGrig.attr('index', tempArr_2[i].index);
              otherGrig.attr('name', tempArr_2[i].name);
              otherGrig.css({
                'left': tempArr_2[i].x,
                'top': tempArr_2[i].y
              });
              grig.otherBox.append(otherGrig);
              //再次开始移动
              nextPosition(tempArr_2[i].x, tempArr_2[i].y, 0, otherGrig[0], true);
            }
            grig.otherGrigs = $('#game .other-box .other-people');
          }
        };
        //游戏倒计时
        // this.gameTimeChange = ()();
        //初始化其他蛐蛐
        otherGrigInit();
        function otherGrigInit() {
          // var obj = {};
          for (var i = 0; i < otherGrigs.length; i++) {
            initMove(otherGrigs[i]);
          }
        };
        //初始化其他蛐蛐爬动的方向、角度等等
        function initMove(dom) {
          dom = $(dom);
          // var x = Math
          var x = getRandom(0, otherBoxData.width - otherGrigData.width);
          var y = getRandom(0, otherBoxData.height - otherGrigData.height);
          // console.log(x,y)
          // var rotate = getRandom(0, 360) - 180;
          dom.css({ 'left': x, 'top': y });
          dom.css({ 'transform': 'rotate(0deg)' });
          var obj = nextPosition(x, y, 0, dom[0]);
        }
        /**
         * 随机生成蛐蛐的下一个终点和角度，并开始移动、递归
         * x: 现在的left
         * y: 现在的top
         * deg: 现在的角度
         * dom: 哪个蛐蛐
         * 
         * return: 对象：下一个目标的left和top值，和角度
         */
        function nextPosition(x, y, deg, dom, bool) {
          dom = $(dom);
          //目标点（肯定是在边界上）由随机数得出点在四条边界线的哪条上面(上右下左)
          //如果bool为true,则只向最顶部跑
          var num = bool ? 1 : getRandom(0, 4);
          //声明终点left和top值
          var _x, _y;
          switch (num) {
            case 1:
              _x = getRandom(0, otherBoxData.width - otherGrigData.width);
              _y = 0;
              break;
            case 2:
              _x = otherBoxData.width - otherGrigData.width;
              _y = getRandom(0, otherBoxData.height - otherGrigData.height);
              break;
            case 3:
              _x = getRandom(0, otherBoxData.width - otherGrigData.width);
              _y = otherBoxData.height - otherGrigData.height;
              break;
            case 4:
              _x = 0;
              _y = getRandom(0, otherBoxData.height - otherGrigData.height);
              break;
            default:
              console.log('bug了');
              break;
          }
          var diff_x = _x - x;
          var diff_y = _y - y;
          var _deg = (Math.atan(diff_y / diff_x)) * 180 / Math.PI;
          if (diff_x > 0) _deg = _deg + 90;
          if (diff_x < 0) _deg = _deg - 90;
          // dom.css({ 'transform': 'rotate(' + _deg + '_deg)' });
          dom.css({ 'left': x, 'top': y, 'transform': 'rotate(' + deg + 'deg)' });
          dom.animate({ 'transform': 'rotate(' + _deg + 'deg)' }, 1000, function () {
            $(this).animate({
              'left': _x,
              'top': _y
            }, 3000, function () {
              // console.log(dom.find('.grig').html(),dom.offset().left);
              nextPosition(_x, _y, _deg, this);
            });
          });
          // console.log(dom.find('.grig').html(),dom.offset().left);
        }
      }
      return new fn();
    })();
    function getRandom(a, b) {
      return Math.ceil(Math.random() * (b - a) + a);
    }
    //End 初始化对象
    //倒计时
    progressBar();
    // gameRank();
    //游戏时间到的函数(排名)
    function gameRank(obj) {
      var tempArr = '小明，小红，小鹤，小强，大明，大红，大鹤，大强，小河'.split('，');
      var arr = [obj];
      for (var i = 0; i < 9; i++) {
        var kill = getRandom(0, 4) - 1;
        // var tempNum = kill === 3 ? 9
        var bite = getRandom(kill * 3, kill * 3 + 3) - 1;
        bite = kill === 3 ? 9 : bite;
        // console.log(kill, bite)
        var newObj = {
          name: tempArr[i],
          kill: kill,
          bite: bite,
          qudou: bite * 10 + kill * 20,
          box: kill
        }
        arr.push(newObj);
      }
      arr.sort(function (b, a) {
        return (a.kill * 100 + a.bite) - (b.kill * 100 + b.bite);
      });
      var tr = '<tr><td>姓名</td><td>击杀</td><td>咬中</td><td>趣豆</td><td>宝箱</td></tr>';
      for (var i = 0; i < 10; i++) {
        var box = arr[i].box + '个';
        if (arr[i].name === obj.name) {
          var className = arr[i].box ? 'have' : 'no';
          box = '<div class="' + className + '" num="' + arr[i].box + '"></div>'
        }
        tr += '<tr><td>' + arr[i].name + '</td><td>' + arr[i].kill + '</td><td>' + arr[i].bite + '</td><td>+' + arr[i].qudou + '</td><td><div class="gold-box">' + box + '</div></td></tr>';
      }
      $('#game .table table').html(tr);
      var have = $('#game .table table .have');
      if (have.length) {
        have.on('tap', function () {
          have.removeClass('have').addClass('no');
          alert('得到' + have.attr('num') + '件礼品');
          have.off('tap');
        });
      }
      grig.goldBox = $('#game .gold-box');
      grig.rank.removeClass('hide');
    }
    //按住自己蛐蛐再松手后的函数
    function sendBefore() {
      //清除事件
      $('body').off('touchmove touchend');
      grig.myGrig.off('touchstart');
      //移除箭头
      grig.myGrig.removeClass('arrow');
      grig.radObjInit();
    }
    // End 初始化对象
    //发射出去之后
    function sendAfter() {
      sendBefore();
      if (grig.bool === false) {
        grig.myGrig.find('img')[0].src = './img/蛐蛐_爬行.png';
        grig.myGrig.on('touchstart', downGrig)
        return;
      }
      grig.bool = false;
      grig.myGrig.find('img')[0].src = './img/蛐蛐_飞出.png';
      var bili = 2;
      // var length = Math.pow((Math.pow(grig.touchingData.moveX * bili, 2) + Math.pow(grig.touchingData.moveY * bili, 2)), 1 / 2)
      //如果射出的距离，大于我的蛐蛐到左上角的距离，也就是射出的屏幕范围内
      // if (length > grig.maxLength) {

      // }
      console.log(grig.touchingData.moveX, grig.touchingData.moveY);
      if (grig.touchingData.might === grig.mightMax / 2) {
        grig.touchingData.moveX = -grig.mightMax/2 * Math.cos((90 - deg)*0.017453293);
        grig.touchingData.moveY = grig.mightMax/2 * Math.sin((90 - deg)*0.017453293);
        // console.log(deg, grig.touchingData.moveX, grig.touchingData.moveY);
      }
      console.log(grig.touchingData.moveX, grig.touchingData.moveY);
      var x = grig.myGrigData.x - (grig.touchingData.moveX * bili);
      var y = grig.myGrigData.y - (grig.touchingData.moveY * bili);
      grig.myGrig.animate({
        'left': x,
        'top': y,
        'transform': 'translateX(-50%) rotate(' + deg + 'deg) scale(1,1)'
      }, 300, 'ease-out', function () {
        grig.might.css('width', 0);
        grig.mightNum.html(0);
        grig.send(x, y);
      });
      grig.touchingData = {};
    }
    //按住我的蛐蛐
    grig.myGrig.on('touchstart', downGrig);
    function downGrig(e) {
      sendBefore();
      //添加箭头
      $(this).addClass('arrow');
      grig.bool = false; //是否已拉住
      //拖动
      $('body').on('touchmove', function (e) {
        //禁止微信默认的下拉事件
        e.preventDefault();
        // 切换背景
        if (grig.bool === false) {
          grig.bool = true;
          grig.myGrig.find('img')[0].src = './img/蛐蛐_拉扯.png';
          grig.sendDown();
        }
        grig.touchingData.moveX = e.touches[0].clientX - grig.myGrigData.x;
        grig.touchingData.moveY = e.touches[0].clientY - grig.myGrigData.y;
        grig.touchingData.degTemp = Math.atan(grig.touchingData.moveY / grig.touchingData.moveX) * 180 / Math.PI;
        if (grig.touchingData.moveX >= 0) deg = grig.touchingData.degTemp - 90;
        else deg = grig.touchingData.degTemp + 90;
        grig.touchingData.might = Math.pow(Math.pow(grig.touchingData.moveX, 2) + Math.pow(grig.touchingData.moveY, 2), (1 / 2));
        // var moveLength = Math.pow((Math.pow(grig.touchingData.moveX, 2) + Math.pow(grig.touchingData.moveY, 2)), 1 / 2);
        // 距离过大会超出边界那种
        // if (grig.touchingData.might > grig.maxLength/2) {

        // }
        if (grig.touchingData.might > grig.mightMax / 2) grig.touchingData.might = grig.mightMax / 2;
        grig.myGrig.css('transform', 'translateX(-50%) rotate(' + deg + 'deg)');
        //更新力度条
        grig.might.css('width', grig.touchingData.might / (grig.mightMax / 2) * 100 + '%');
        grig.mightNum.html(Math.floor(grig.touchingData.might / (grig.mightMax / 2) * 100));
      });
      //松开
      $('body').on('touchend', sendAfter);
    }
  }
})