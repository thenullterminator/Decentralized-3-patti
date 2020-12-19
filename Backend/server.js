const express = require('express');
const app = express(); // creating an express application
const cors = require('cors');
app.use(cors()); // setting up cors for app

const port = process.env.PORT || 3000; // specifying port

const http = require('http').createServer(app); // creating http server of the express ap
const io = require('socket.io')(http,{ // creating an io socket from the http server.
      cors: {
            origin: "*",
      }
});

function makeid(length) { // utility function to create a new room id

      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
}

let users = {} // all connected users room_id => array of all users in that room.
let messages = {} // room_id => array of all messages in that room
let clientRooms = {} // client id => room_id
let players = {}  // room_id => card data of all players in that room

// setting up even listener
io.on('connection',  (client) => {

      console.log('A user connected: ' + client.id);

      client.on('create new game',(username)=>{

            let room_id=makeid(7);

            const user = {
                  username:username,
                  client_id:client.id,
                  room_id:room_id
            };

            users[room_id]=[];
            messages[room_id]=[];
            
            users[room_id].push(user);
            clientRooms[client.id] = room_id;

            client.emit('new room id',room_id);
            client.join(room_id);
            io.to(room_id).emit('new users',users[room_id]);

            console.log(user);
            console.log(users);
            console.log(io.sockets.adapter.rooms)
      });

      client.on('join game',(username,room_id)=>{

            if (users[room_id] === undefined){ // if room_id does not exist
                  console.log("Invalid room id");
                  client.emit('room_id does not exist');
                  return;
            }     

            const user = {
                  username:username,
                  client_id:client.id,
                  room_id:room_id
            };

            
            users[room_id].push(user);
            clientRooms[client.id] = room_id;

            client.emit('new room id',room_id);
            client.join(room_id);
            io.to(room_id).emit('new users',users[room_id]);
            

            console.log(user);
            console.log(users)
            console.log(io.sockets.adapter.rooms)
      });

      client.on('send message',(message,sender,room_id)=>{
            
            messages[room_id].push({message,sender});

            io.to(room_id).emit('new message',messages[room_id]);
      });

      client.on('disconnect',()=>{
            
            console.log('disconnect');

            if (clientRooms[client.id] === undefined){ // if room_id does not exist
                  return;
            }  

            var room_id=clientRooms[client.id];
            delete clientRooms[client.id];

            users[room_id] = users[room_id].filter(u => u.client_id !== client.id);
            
            if(users[room_id].length === 0){

                  delete users[room_id];
                  delete messages[room_id];
            }
            else{
                  io.to(room_id).emit('new users',users[room_id]);
            }

            console.log(clientRooms)
            console.log(users)
      });

      client.on('start new game',()=>{

            const room_id=clientRooms[client.id];
            io.to(room_id).emit('start game for all users');
      });
      
      client.on('distribute',(cards,sender,room_id)=>{
            
            // turn of the player distrbuting card
            let turn = 0;
            let N = users[room_id].length;
            let game_data = {};

            /* 
                  each player will recieve 3 cards,
                  
                  turn+1 player recieves cards = 0, N, 2*N 
                  turn+2 player cards          = 1, N+1, 2*N+1
                  and so on ...
                  
                  This is stored in card_data as 

                  card_data = 
                  {
                        0 : [],
                        1 : [],
                        ...
                        N-1 : [],
                  }
            */

            let idx = turn;
            for (let i = 0; i < N; i++) {

                  idx = (idx + 1) % N;
                  game_data[idx] = [];
                  for (let j = 0; j < 3; j++)
                        game_data[idx].push(51 - (N * j + i));
            }

            
            // emit the cards and information about players to all clients
            game_data["cards"] = cards;
            game_data["N"] = N;
            game_data["turn"] = turn;
            io.to(room_id).emit('distribution done',game_data);
            
            // add all information in global DS
            players[room_id]=game_data;
      })
});

http.listen(port, function () { // http server listening at port
      console.log('Server started!');
});

