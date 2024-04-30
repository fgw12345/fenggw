//弹窗样式
iziToast.settings({
    timeout: 10000,
    progressBar: false,
    close: false,
    closeOnEscape: true,
    position: 'topCenter',
    transitionIn: 'bounceInDown',
    transitionOut: 'flipOutX',
    displayMode: 'replace',
    layout: '1',
    backgroundColor: '#00000040',
    titleColor: '#efefef',
    messageColor: '#efefef',
    icon: 'Fontawesome',
    iconColor: '#efefef',
});

/* 鼠标样式 */
const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfAlementWidth = element.offsetWidth / 2;
const halfAlementWidth2 = element2.offsetWidth / 2;

function setPosition(x, y) {
    element2.style.transform = `translate(${x - halfAlementWidth2 + 1}px, ${y - halfAlementWidth2 +1}px)`;
}

body.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(function () {
        setPosition(e.clientX, e.clientY);
    });
});



//加载完成后执行
window.addEventListener('load', function () {

    //载入动画
    $('#loading-box').attr('class', 'loaded');
    $('#bg').css("cssText", "transform: scale(1);filter: blur(0px);transition: ease 1.5s;");
    $('.cover').css("cssText", "opacity: 1;transition: ease 1.5s;");
    $('#section').css("cssText", "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important");

    //用户欢迎
    setTimeout(function () {
        iziToast.show({
            timeout: 2500,
            icon: false,
            title: hello,
            message: '欢迎来到我的主页'
        });
    }, 800);


    //移动端去除鼠标样式
    if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
        $('#g-pointer-2').css("display", "none");
    }

}, false)

setTimeout(function () {
    $('#loading-text').html("字体及文件加载可能需要一定时间")
}, 3000);

//获取一言
fetch('https://v1.hitokoto.cn?max_length=24')
    .then(response => response.json())
    .then(data => {
        $('#hitokoto_text').html(data.hitokoto)
        $('#from_text').html(data.from)
    })
    .catch(console.error)

let times = 0;
$('#hitokoto').click(function () {
    if (times == 0) {
        times = 1;
        let index = setInterval(function () {
            times--;
            if (times == 0) {
                clearInterval(index);
            }
        }, 1000);
        fetch('https://v1.hitokoto.cn?max_length=24')
            .then(response => response.json())
            .then(data => {
                $('#hitokoto_text').html(data.hitokoto)
                $('#from_text').html(data.from)
            })
            .catch(console.error)
    } else {
        iziToast.show({
            timeout: 1000,
            icon: "fa-solid fa-circle-exclamation",
            message: '你点太快了吧'
        });
    }
});

//获取天气
//请前往 https://www.mxnzp.com/doc/list 申请 app_id 和 app_secret
//请前往 https://dev.qweather.com/ 申请 key
const add_id = "vcpmlmqiqnjpxwq1"; // app_id
const app_secret = "PeYnsesgkmK7qREhIFppIcsoN0ZShv3c"; // app_secret
const key = "691d007d585841c09e9b41e79853ecc2" // key
function getWeather() {
    fetch("https://www.mxnzp.com/api/ip/self?app_id=" + add_id + "&app_secret=" + app_secret)
        .then(response => response.json())
        .then(data => {
            let str = data.data.city
            let city = str.replace(/市/g, '')
            console.log(data,"sssss")
            $('#city_text').html(city);
            fetch("https://geoapi.qweather.com/v2/city/lookup?location=" + city + "&number=1&key=" + key)
                .then(response => response.json())
                .then(location => {
                    let id = location.location[0].id
                    fetch("https://devapi.qweather.com/v7/weather/now?location=" + id + "&key=" + key)
                        .then(response => response.json())
                        .then(weather => {
                            $('#wea_text').html(weather.now.text)
                            $('#tem_text').html(weather.now.temp + "°C&nbsp;")
                            $('#win_text').html(weather.now.windDir)
                            $('#win_speed').html(weather.now.windScale + "级")
                        })
                })
        })
        .catch(console.error);
}

getWeather();

let wea = 0;
$('#upWeather').click(function () {
    if (wea == 0) {
        wea = 1;
        let index = setInterval(function () {
            wea--;
            if (wea == 0) {
                clearInterval(index);
            }
        }, 60000);
        getWeather();
        iziToast.show({
            timeout: 2000,
            icon: "fa-solid fa-cloud-sun",
            message: '实时天气已更新'
        });
    } else {
        iziToast.show({
            timeout: 1000,
            icon: "fa-solid fa-circle-exclamation",
            message: '请稍后再更新哦'
        });
    }
});

//获取时间
let t = null;
t = setTimeout(time, 1000);

function time() {
    clearTimeout(t);
    dt = new Date();
    let y = dt.getYear() + 1900;
    let mm = dt.getMonth() + 1;
    let d = dt.getDate();
    let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let day = dt.getDay();
    let h = dt.getHours();
    let m = dt.getMinutes();
    let s = dt.getSeconds();
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    $("#time").html(y + "&nbsp;年&nbsp;" + mm + "&nbsp;月&nbsp;" + d + "&nbsp;日&nbsp;" + "<span class='weekday'>" + weekday[day] + "</span><br>" + "<span class='time-text'>" + h + ":" + m + ":" + s + "</span>");
    t = setTimeout(time, 1000);
}

//链接提示文字
$("#social").mouseover(function () {
    $("#social").css({
        "background": "rgb(0 0 0 / 25%)",
        'border-radius': '6px',
        "backdrop-filter": "blur(5px)"
    });
    $("#link-text").css({
        "display": "block",
    });
}).mouseout(function () {
    $("#social").css({
        "background": "none",
        "border-radius": "6px",
        "backdrop-filter": "none"
    });
    $("#link-text").css({
        "display": "none"
    });
});

$("#qq").mouseover(function () {
    $("#link-text").html("my qq number：1292483659");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#email").mouseover(function () {
    $("#link-text").html("来封 Email");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#github").mouseover(function () {
    $("#link-text").html("竞赛组队吗？");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});


//更多页面切换
let shoemore = false;
$('#switchmore').on('click', function () {
    shoemore = !shoemore;
    if (shoemore && $(document).width() >= 990) {
        $('#container').attr('class', 'container mores');
        $("#change").html("Oops&nbsp;!");
        $("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
    } else {
        $('#container').attr('class', 'container');
        $("#change").html("Hello&nbsp;World&nbsp;!");
        $("#change1").html("You wanna find more about me？");
    }
});

$('#switchmore1').on('click', function () {
    shoemore = !shoemore;
    if (shoemore && $(document).width() >= 990) {
        $('#container').attr('class', 'container mores');
        $("#change").html("Oops&nbsp;!");
        $("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
    } else {
        $('#container').attr('class', 'container');
        $("#change").html("Hello&nbsp;World&nbsp;!");
        $("#change1").html("You wanna find more about me？");
    }
});
//更多页面关闭按钮
$('#close').on('click', function () {
    $('#switchmore').click();
});


//更多页面显示关闭按钮
$("#more").hover(function () {
    $('#close').css("display", "block");
}, function () {
    $('#close').css("display", "none");
})

//屏蔽右键
document.oncontextmenu = function () {
    iziToast.show({
        timeout: 2000,
        icon: "fa-solid fa-circle-exclamation",
        message: '为了浏览体验，本站禁用右键'
    });
    return false;
}

//控制台输出
//console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
let styleTitle2 = `
font-size:12px;
color: #425AEF;
`
let styleContent = `
color: rgb(30,152,255);
`
let content = `
博客:  https://bolo.wuhobin.top
Github:  https://github.com/wuhobin
`
