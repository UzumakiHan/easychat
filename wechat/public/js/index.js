var socket = io('http://127.0.0.1:3000');
var username;
var avatar;
//点击头像
$('.useravatars ul li').on('click', function () {
    $(this).addClass('nowtouch').siblings().removeClass('nowtouch')
})
// $(document).ready(function(){
//     $('#btn').click(function(){
//         console.log('1111')
//         $('#userlist').after(`<li class="list-group-item">
//         <img src="./image/avatar1.jpg" alt="" class="img-fluid" id="userimg">
//         <span id="user_name">Jeslie He</span>
//         </li>`)
//     })
// })

// $('#userlist').after(`<li class="list-group-item">
// <img src="./image/avatar1.jpg" alt="" class="img-fluid" id="userimg">
// <span id="user_name">Jeslie He</span>
// </li>`)
//登录
$('#loginbtn').on('click', () => {
    username = $('#username').val().trim();
    avatar = $('.useravatars ul li.nowtouch img').attr('src');
    console.log(username, avatar);
    if (!username) {
        alert('用户名不能为空');
        return
    }
    if (!avatar) {
        alert('请选择用户头像');
        return
    }

    // $('#login').css('display', 'none');
    // $('#home').css('display', 'block');

    //把用户名合头像传回服务器
    socket.emit('login', {
        username: username,
        avatar: avatar
    })
    //接收成功的登录信息
    socket.on('loginSuccess', (data) => {
        alert('登录成功');
        $('#login').css('display', 'none');
        $('#home').css('display', 'block');
        $('#userimg').attr('src', avatar);
        $('#user_name').text(username);
    })

    //接收失败的登录信息
    socket.on('loginError', (data) => {
        alert('登录失败,用户名已存在');
    })
})

//用户列表


socket.on('userlist', (data) => {
    $('#userlist').html('');
    $("#group").html('');
    console.log(data);
    data.forEach(item => {
        console.log(item);
        $('#userlist').append(` <li class="list-group-item">
       <img src="${item.avatar}" alt="" class="img-fluid" id="userimg">
       <span id="user_name">${item.username}</span>
   </li>`);
        $("#group").append(`<div class="groupuser">
  <p> <img src="${item.avatar}" alt="" class="img-fluid" ></p>
   <p class="mt-2">${item.username}</p>
</div>`)

    })
    $('#right .title').text(`聊天室(${data.length})`);
    
})
/* <li class="list-group-item">
                            <img src="./image/avatar2.jpg" alt="" class="img-fluid">
                            <span>wang</span>
                        </li>
                        <li class="list-group-item">
                            <img src="./image/avatar3.jpg" alt="" class="img-fluid">
                            <span>Jeslie He</span>
                        </li> */




//监听用户加入
socket.on('addUser', data => {
    console.log(data);
    $('.msg').append(`<p class="text-center">${data.username}加入了群聊</p>`);
    scrollIntoView()
})

//监听用户离开

socket.on('delUser', data => {
    console.log(data);
    $('.msg').append(`<p class="text-center">${data.username}离开了群聊</p>`);
    scrollIntoView()
})

//发送消息
$('#send').click(function () {
    var comment = $('#comment').val().trim();
    $('#comment').val("");
    if (!comment) {
        alert(`内容不能为空`);
        return;
    }
    socket.emit('messagedata', {
        content: comment,
        username: username,
        avatar: avatar,
        chattime: new Date().toLocaleTimeString()
    })
})
socket.on('senddata', data => {
    console.log(data);
    if (data.username === username) {
        $('.content').append(` <div class="row">
        <div class="col-lg-12">
            <div class="my" style="float: right;">
                <div class="my-msg">
                    <p class="my-reply mr-3 mt-2">${data.content}</p>
                </div>
                <p class="mt-2"> <img class="my-img" src="${data.avatar}" /></p>
    
            </div>
    
        </div>
    </div><div class="row mt-2">
    <div class="col-lg-12">
        <div class="msg">
            <p class="text-center">${data.chattime}</p>
        </div>
    </div>
</div>`)
    } else {
        $('.content').append(`<div class="row">
        <div class="col-lg-12">
            <div class="other">
                <p class="mt-2"> <img class="other-img" src="${data.avatar}" /></p>
                <div class="other-msg">
    
                    <p class="otheruser mt-2 ml-1">${data.username}</p>
                    <p class="admin-reply  ml-3">${data.content}</p>
                </div>
            </div>
    
        </div>
    </div><div class="row ">
    <div class="col-lg-12">
        <div class="msg">
            <p class="text-center">${data.chattime}</p>
        </div>
    </div>
</div>`)
    }
    scrollIntoView()
})
function scrollIntoView() {
    $('.content').children(':last').get(0).scrollIntoView(false)
}
//表情
$('.face').on('click',function(){
    console.log('111')
    $('#comment').emoji({
        button: ".face",
        showTab: false,
        animation: 'slide',
        position: 'topRight',
        icons: [{
            name: "QQ表情",
            path: ".././img/qq/",
            maxNum: 91,
            excludeNums: [41, 45, 54],
            file: ".gif",
            placeholder: "#qq_{alias}#"
        }]
    })
})