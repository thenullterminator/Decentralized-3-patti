const socket = io('http://localhost:3000');

const create_game_button = document.getElementById('create_game_button');
const join_game_button = document.getElementById('join_game_button');
const name_input = document.getElementById('name_input');
const room_id_input = document.getElementById('room_id_input');
const room_id_display = document.getElementById('room_id_display');
const active_users= document.getElementById('active_users');
const start_page = document.getElementById('start_page');
const game_start_page = document.getElementById('game_start_page');
const chatbox = document.getElementById('chatbox');
const chat_input = document.getElementById('chat_input');
const chat_button = document.getElementById('chat_button');

const current_user={
      name:"",
      room_id:""
};

create_game_button.addEventListener('click', (e)=>{

      const name = name_input.value;
      current_user.name=name;
      socket.emit('create new game',name)
});

join_game_button.addEventListener('click', (e)=>{

      const name = name_input.value;
      const room_id = room_id_input.value;
      current_user.name=name;
      socket.emit('join game',name,room_id);
});

chat_button.addEventListener('click',(e)=>{

      const msg = chat_input.value;
      chat_input.value ="";
      const room_id = current_user.room_id;
      const sender = current_user.name;

      socket.emit('send message',msg,sender,room_id);
});

socket.on('new room id',(room_id)=>{
      room_id_display.innerText = room_id;

      current_user.room_id = room_id;
      start_page.style.display='none';
      game_start_page.style.display='block';
});

socket.on('new users',(users)=>{
      
      var user_list="";
      for (var i=0;i<users.length;i++){
            user_list+='<p>'+users[i].username+'</p>';
      }
      active_users.innerHTML=user_list;
});

socket.on('new message',(messages)=>{

      if(messages === undefined || messages.length === 0){
            return;
      }
      
      var msg_list="";
      for (var i=0;i<messages.length;i++){
            msg_list+='<p>'+'<b>'+messages[i].sender+':'+'</b>'+messages[i].message+'</p>';
      }
      chatbox.innerHTML = msg_list;
});

socket.on('room_id does not exist',()=>{
      console.log("Invalid room id");
});