; (function () {
    //加载图片
    //每次加载图片前，没有拖拽图片用默认图片，有图片用拖拽图片
    var tim=0;
    var Getimg = (function () {
        var morenimg = '';
        var getimg = $('.getimg')[0]
        var isdrop = false;
        var init = function () {
            upimg = get_img();
            console.log(upimg);
            //图片分割加载
            Split_loading.init();
        }
        var get_img = function () {
            //监听是否有图片放入拖拽框
            $('.getimg').on('dragover drop', function (event) {
                
                if (event.type == 'dragover') {
                    event.preventDefault();
                } 
                if(isdrop==false){
                    if (event.type == 'drop') {
                        event.preventDefault();
                        isdrop = true
                        console.log('drop')
                        var fs = event.originalEvent.dataTransfer.files;
                        if (fs.length > 1) {
                            alert("上传错误！")
                            return
                        }
                        //文件类型
                        var _type = fs[0].type;
                        //判断文件类型
                        if (_type.indexOf('image') == -1) {
                            alert('请上传图片文件！');
                        }
                        //文件大小控制
                        console.log(fs[0].size);
                        if (fs[0].size > 2097152) {
                            alert('亲！图片太大了！');
                        }

                        //读取文件对象
                        var reader = new FileReader();
                        //读为DataUrl,无返回值
                        reader.readAsDataURL(fs[0]);
                        //当读取成功时触发，this.result为读取的文件数据
                        reader.onload = function () {
                            //文件数据
                            //console.log(this.result);
                            //添加文件预览
                            var oImg = $("<img class='pintuimg' style='width:200px;' src='' />");
                            oImg.attr("src", this.result);
                            $(getimg).append(oImg); //oDiv转换为js对象调用方法
                            morenimg = this.result;
                            $.session.set('img', this.result);
                            Split_loading.init();
                        }
                }
                }
   
            });
            
            if($.session.get('img')===undefined)
                $.session.set('img', 'mm.jpg')
            return $.session.get('img');
        }
        return { init: init, get_img: get_img }
    })()
    //将图片划成块
    var Split_loading = (function () {
        var col = 3, row = 3;
        var win_arr = [];
        var imgurl;
        var init = function () {
            imgurl = Getimg.get_img();
            makeFragments();
            Timecount.Timehide();
        }
        var makeFragments = function () {
            //生成m*n个div元素
            var frags = "<table id = 'fragTable' style='margin: auto;' border='0'>";
            for (var i = 0; i < col; i++) {
                frags += "<tr>";
                for (var j = 0; j < row; j++) {
                    frags += "<td class='mubiao'><div id='div" + i + j + "'></div></td>";
                }
                frags += "</tr>";
            }
            frags += "</table>";
            $(".container")[0].innerHTML = frags;
            addImage();
        }
        var addImage = function () {
            for (var i = 0; i < col; i++) {
                for (var j = 0; j < row; j++) {
                    var curdiv = document.getElementById("div" + i + j);
                    var wid = 798 / 2;
                    var hgt = 498 / 2;
                    curdiv.className = "tuozuai";
                    curdiv.draggable = "true";

                    curdiv.style.background = "url(" + imgurl + ") no-repeat scroll";
                    curdiv.style.backgroundSize = "399px 249px";

                    curdiv.style.width = (wid / row) + "px";
                    curdiv.style.height = (hgt / col) + "px";

                    curdiv.style.backgroundPosition = getInverse(j * (wid / row)) + "px" + ' ' + getInverse(i * (hgt / col)) + "px";

                }
            }
            // dargPic.init(curdiv)
            get_winarr();
            Game.init(curdiv)
        }
        var get_winarr = function () {
            for (let m = 0; m < 9; m++) {
                win_arr.push($('td')[m].firstElementChild.id.slice(3))
            }
            return win_arr;
        }
        //取相反数
        var getInverse = function (num) { return (0 - num); }
        return { init: init, win_arr: win_arr }
    })();
    //拖拽图片
    var dargPic = (function () {
        var init = function (obj) {
            dargmove(obj);
        }
        var dargmove = function (obj) {
            var pretarget;
            $('.tuozuai').on('dragstart', function (event) {
                if (event.type == 'dragstart') {
                    event.originalEvent.dataTransfer.setData("tuozuai", event.target.id);
                    pretarget = event.target
                } else {
                    console.log('no')
                }
            });
            $('.mubiao').on('dragover drop', function (event) {
                if (event.type == 'dragover') {
                    event.preventDefault();
                } else if (event.type == 'drop') {
                    event.preventDefault();

                    var preNode = $(event.originalEvent.dataTransfer.getData("tuozuai"));
                    var nowNode = $(event.target.id);

                    exchange(document.getElementById(preNode.selector), document.getElementById(nowNode.selector))
                    Game.isWin(event)
                } else {
                    console.log('no')
                }
            });
            $('.tuozuai').on('touchstart', function (event) {
                console.log(event)
            });
            $('.mubiao').on('touchmove touchend', function (event) {
                console.log(event)
            });
        }
        var exchange = function (el1, el2) {
            var ep1 = el1.parentNode,
                ep2 = el2.parentNode,
                index1 = Array.prototype.indexOf.call(ep1.children, el1),
                index2 = Array.prototype.indexOf.call(ep2.children, el2);
            ep2.insertBefore(el1, ep2.children[index2]);
            ep1.insertBefore(el2, ep1.children[index1]);
        }
        return { init: init, exchange: exchange }
    })();
    //游戏
    var Game = (function () {
        var clock_time = 0;
        var game_state = false;
        var init = function (curdiv) {
            $('#startGame').click(function () {
                if (game_state == false) {
                    startGame();
                    dargPic.init(curdiv)
                }
            });
            $('#restartGame').click(function () {
                restartGame(curdiv);
            });
        }
        var random_disorder = function () {
            //所有div进行随机交换
            for (let i = 0; i < 10; i++) {
                var Two_Random = get_Twonum($('td').length)
                //console.log($('td')[i].firstElementChild)
                dargPic.exchange($('td')[Two_Random[0]].firstElementChild, $('td')[Two_Random[1]].firstElementChild)
            }
            if (clock_time >= 10) {
                // console.log("clearInterval")
                clearInterval(clock);
                clock_time = 0;
            }
            clock_time++;

        }
        var startGame = function (event) {
            game_state = true;
            clock = setInterval(random_disorder, 40);
            Timecount.init();
            Timecount.Timeshow();
        }
        var restartGame = function () {
            game_state = false;
            Split_loading.init()
            Timecount.clear1();
        }

        var get_Twonum = function (maxNum) {

            v1 = get_Random(maxNum);
            v2 = get_Random(maxNum);
            while (v1 == v2) {
                v2 = get_Random(maxNum);
            }

            if (v1 != v2) {
                // console.log(v1,v2)
                return [v1, v2];
            }
        }
        //获取随机数
        var get_Random = function (maxNum) {
            return Math.floor(Math.random() * maxNum);
        }
        var isWin = function (event) {
            var now_arr = []
            var win_arr = [];
            if (win_arr.length == 0) {
                win_arr = Split_loading.win_arr;
            }

            console.log(win_arr)
            // ["00","01","02","10","11","12","20","21","22"]
            for (let m = 0; m < 9; m++) {
                now_arr.push($('td')[m].firstElementChild.id.slice(3))
                //.slice(3)
            }
            if (now_arr.toString() == win_arr.toString()) {
                Split_loading.init();
                Timecount.stop1();
                var gettime = Timecount.get_Time();
                var count=gettime[0]*3600+gettime[1]*60+gettime[2]+0.001*gettime[3];
                tim=tim+1;
                localStorage.setItem("tim",gettime[2] + '秒 ' + gettime[3] + 'ms '); 
                alert('你用时：' + gettime[0] + 'h ' + gettime[1] + 'm ' + gettime[2] + 's ' + gettime[3] + 'ms ');
                // Timecount.clear1();
                restartGame();
            }
        }
        return { init: init, isWin: isWin }
    })()
    //记时计分
    var Timecount = (function () {

        var time = 0;
        var pre_time = 0;
        var intervals = 0;
        var pre_intervals = 0;
        var flag;

        var init = function () {
            whenClick();
        }
        var milliSeconds1 = $("#span4")[0];
        var seconds1 = $("#span3")[0];
        var minutes1 = $("#span2")[0];
        var hours1 = $("#span1")[0];

        var whenClick = function () {//  开始/暂停

            var date = new Date();
            time = date.getTime();
            pre_time = time;
            start1();

        }

        var clear1 = function () {//  清零
            stop1();
            milliSeconds1.innerHTML = seconds1.innerHTML = minutes1.innerHTML = hours1.innerHTML = "00";
            time = 0;
            pre_time = 0;
            intervals = 0;
            pre_intervals = 0;
        }

        var start1 = function () {//  开始/继续
            flag = setInterval(timeIncrement, 10);
        }

        var timeIncrement = function () {
            date = new Date();
            intervals = date.getTime() - time + pre_intervals;
            var a = intervals % 1000 / 10;
            var b = intervals % 60000 / 1000;
            var c = intervals % 3600000 / 60000;
            var d = intervals / 3600000;
            milliSeconds1.innerHTML = (a < 10) ? ('0' + Math.floor(a)) : (Math.floor(a));
            seconds1.innerHTML = (b < 10) ? ('0' + Math.floor(b)) : (Math.floor(b));
            minutes1.innerHTML = (c < 10) ? ('0' + Math.floor(c)) : (Math.floor(c));
            hours1.innerHTML = (d < 10) ? ('0' + Math.floor(d)) : (Math.floor(d));
        }

        var stop1 = function () {//  暂停/停止
            date = new Date();
            pre_intervals += date.getTime() - pre_time;
            clearInterval(flag);
        }

        var get_Time = function () {
            return [hours1.innerText, minutes1.innerText, seconds1.innerText, milliSeconds1.innerText];
        }

        var Timehide = function () {
            $("#timecount").hide();
        }
        var Timeshow = function () {
            $("#timecount").show();
        }
        return { init: init, stop1: stop1, clear1: clear1, get_Time: get_Time, Timehide: Timehide, Timeshow: Timeshow }

    })()

    Getimg.init();
})();
