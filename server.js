const dns = require('node:dns');
const express = require('express');
const socket = require('socket.io');

dns.setDefaultResultOrder("ipv4first");

const app = express();

const flutterV = "flutter-v0.4";

let num = 'error';
let buf = '404';
let userCounter = 0;

let whiteList = {};
let blackList = {};
let addr = '404';

app.get("/", (req, res) => {
  for (var key in blackList){
    if (blackList[key] == (req.headers['x-forwarded-for'] ||  req.connection.remoteAddress).split('.').at(-1)){
      if (`blacklist ${key}의 접근 감지` == buf){
        return;
      }
      buf = `blacklist ${key}의 접근 감지`;
      sendMessage(`blacklist ${key}의 접근 감지`);
      return res.send('blocked');
    }
  }
  if (req.headers['user-header'] == flutterV){
    return res.json({
      title : 'DSM_Chat',
      address : addr,
      main : "Chat log"
    });
  }
  res.sendFile(__dirname + '/index.html');
});

app.get('/privacy', (req, res) => {
  if (req.headers['user-header'] == flutterV){
    return res.json({
      title : '개인정보처리방침',
      main : [
        '수집 정보 : ip주소',
        '수집 목적 : 사용자 식별, 서버 장애 발생 원인 제거',
        '수집 기한 : 페이지에 들어왔을 때 부터, 서버가 종료될 때 까지'
      ]
    });
  }
  res.sendFile(__dirname + '/privacy.html');
});

const server = app.listen(8080, () => {
  console.log('listening...');
});

const addWhiteList = (name, ip) => {
  if (name in whiteList){
    return false;
  }
  whiteList[name] = ip;
  return true;
}

const unaddWhiteList = (identifer) => {
  delete whiteList[identifer];
  return true;
}

const addBlackList = (name, ip) => {
  if (name in blackList){
    return false;
  }
  blackList[name] = ip;
  return true;
}

const unaddBlackList = (identifer) => {
  delete blackList[identifer];
  return true;
}

const command = (data) => {
  let temp = data.split(' ');
  if (temp[0] == '!add'){
    if (addWhiteList(temp[1], temp[2])){
      sendMessage(`페이지가 ${temp[1]}을 기억합니다`);
    }
    return true;
  }
  if (temp[0] == '!block'){
    if (addBlackList(temp[1], temp[2])){
      sendMessage(`페이지가 ${temp[1]}을 차단합니다`);
    }
    return true;
  }
  if (temp[0] == '!unadd'){
    if (unaddWhiteList(temp[1])){
      sendMessage(`페이지가 ${temp[1]}을 까먹습니다`);
    }
    return true;
  }
  if (temp[0] == '!unblock'){
    if (unaddBlackList(temp[1])){
      sendMessage(`페이지가 ${temp[1]}을 용서합니다`);
    }
    return true;
  }
  if (temp[0] == '!cls'){
    io.emit('cls', '페이지가 강제 새로고침 되었습니다.');
    return true;
  }
  return false;
}

/** 메세지, 이름, 번호, 타입, 색 */
const sendMessage = (Gmessage, Gname = null, Gnum = null, Gtype = false, Gcolor = 'black') => {
  let data = {
    Sname : Gname,
    Snum : Gnum,
    Smessage : Gmessage,
    Stype : Gtype,
    Scolor : Gcolor
  }
  io.emit('sendAll', JSON.stringify(data));

  return;
}

const io = socket(server, { path: '/socket.io' });

IsJsonString = (str) => {
  try {
    var json = JSON.parse(str);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

io.on('connection', (ws) => {
  let clientIp = `${ws.request.connection.remoteAddress}`;
  clientIp = (clientIp == '::1') ? 'host' : clientIp.split('.').at(-1);

  for (key in whiteList){
    if (clientIp = whiteList[key]){
      sendMessage(`${key} 들어옴`);
    }
  }

  ws.emit('address', addr);

  ws.on('getNum', (name) => {
    num = clientIp.toString();
    ws.emit('yourNum', num);
    sendMessage(`${name}[${num}] 접속 | 총 방문 : ${++userCounter}명`);
  });

  ws.on('error', (err) => {
    console.error(err);
  });

  ws.on('message', (message) => {

    if (!IsJsonString(message)){
      console.log("not a json");
      return;
    }

    for (var ip in blackList){
      if (blackList[ip] == clientIp){
        return;
      }
    }

    message = JSON.parse(message);
    if (message['message'].length > 32 || message['name'].length > 16) {
        return;
    }
    let data = {
      Sname : message['name'],
      Snum : message['num'],
      Smessage : message['message'],
      Stype : true,
      Scolor : 'black'
    }
    if (clientIp == 'host'){
      if (command(message['message'])){
        return;
      }
    }
    io.emit('sendAll', JSON.stringify(data));
  });
});

addr = 'https://dsm-chat.injunweb.com/';