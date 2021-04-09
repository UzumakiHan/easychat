var app = require('express')();
var server = require('http').Server(app);
var express = require('express');
var path = require('path')
var io = require('socket.io')(server);
var users= [];
server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
 res.render('/index.html')
});

io.on('connection', function (socket) {
//   console.log('新用户连接');

  //接受客户端传来的用户信息
  socket.on('login',(data)=>{
      console.log(data);
      let user = users.find(item=>item.username === data.username);
      if(user){
          socket.emit('loginError',{
              err_code:"登录失败"
          })
      }else{
        console.log(`用户加入`);
          users.push(data);
          socket.emit('loginSuccess',{
              success_code:"登录成功"
          })
          //广播告诉所有人加入群聊
          io.emit('addUser',data);
          //监听用户列表的变化
          console.log(users)
          io.emit('userlist',users);
          socket.username = data.username;
          socket.avatar = data.avatar;

      }
  })
  

  socket.on('disconnect',()=>{
      console.log(`用户离开`)
      let idx = users.findIndex(item=>item.username === socket.username)
      users.splice(idx,1);
      io.emit('delUser',{
          username:socket.username,
          avatar :socket.avatar
      })
      io.emit('userlist',users);
  })

  socket.on('messagedata',data=>{
      console.log(data);
      io.emit('senddata',data)
     
  });
  
});