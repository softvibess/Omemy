const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let waiting = null;

wss.on('connection', ws => {

  ws.on('message', msg => {
    let data;
    try{ data = JSON.parse(msg); }catch{ return; }

    // لو أرسل offer → نحاول نزاوجه
    if(data.offer){
      if(waiting){
        ws.peer = waiting;
        waiting.peer = ws;

        // أرسل العرض للشخص الثاني
        waiting.send(msg);
        waiting = null;
      }else{
        waiting = ws;
      }
      return;
    }

    // تحويل البيانات بين الطرفين
    if(ws.peer){
      ws.peer.send(msg);
    }

  });

  ws.on('close', ()=>{
    if(waiting === ws) waiting=null;
    if(ws.peer) ws.peer.send(JSON.stringify({msg:"الشخص غادر"}));
  });

});

console.log("server started on port 3000");
