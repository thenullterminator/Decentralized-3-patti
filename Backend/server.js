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
let players = {}  // client_id(unique across rooms) => index of user in room
let game_data = {} // game_id => all infromation about that particular room

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

            client.emit('new room id',room_id,client.id);
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

            client.emit('new room id',room_id,client.id);
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
            
            // set up game_data and players
            game_data[room_id] = {};

            for(let i=0; i<users[room_id].length; i++) {
                 players[users[room_id][i].client_id] = i;
            }

            io.to(room_id).emit('start game for all users',users[room_id]);
      });
      
      client.on('distribute',(cards,sender,room_id)=>{
            
            // turn of the player distrbuting card
            let turn = 0;
            let N = users[room_id].length;
            
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
            /*
                  pidx = player index according to users[room_id]

            */
           game_data[room_id]["distribution"] = {};
            for (let pidx = 0; pidx < N; pidx++) {

                  game_data[room_id]["distribution"][idx] = [];
                  
                  for (let j = 0; j < 3; j++)
                        game_data[room_id]["distribution"][idx].push({
                              "deck_idx" : 51-(N*j+pidx),
                              "card_idx" : cards[51-(N*j+pidx)].i     
                        });
                  console.log(game_data[room_id]["distribution"][idx]);
                  idx = (idx + 1) % N;
            }

            
            // emit the cards and information about players to all clients
            game_data[room_id]["cards"] = cards; 
            
            console.log("game_data at server");
            console.log(game_data);
            
            io.to(room_id).emit('distribution done',game_data);
      })

      client.on('request own card data',(room_id,client_id) => {
            let pidx = players[client_id];
            client.emit("view own cards",game_data[room_id]["distribution"][pidx]);
      })
});

http.listen(port, function () { // http server listening at port
      console.log('Server started!');
});



// Get result of game

// playerOneCards and playerTwoCards are arrays containing 'i' values of the cards
function getResult(playerOneCards, playerTwoCards) {
      let playerOneCardsRank = getRank(playerOneCards);
      let playerTwoCardsRank = getRank(playerTwoCards);

      if (playerOneCardsRank > playerTwoCardsRank) {
              // playerOne wins
              return 1;
      } else if (playerTwoCardsRank > playerOneCardsRank) {
              // playerTwo wins
              return 2;
      } else {
              // draw
              return 0;
      }
}

function getRank(cards) {
      let categoryRank = getCategoryRank(cards);

      let cardRanks = [];

      for (let i = 0; i < 3; i++) {
              if (cards[i] % 13 + 1 === 1) {
                      cardRanks.push(14);
              } else {
                      cardRanks.push(cards[i] % 13 + 1);
              }
      }

      cardRanks.sort((a, b) => b - a);

      let rankInCategory;

      switch (categoryRank) {
              case 6:
                      rankInCategory = cardRanks[0];
                      break;
              case 5:
              case 4:
                      if (cardRanks[0] === 14 && cardRanks[1] === 13 && cardRanks[2] === 12) {
                              rankInCategory = 15;
                      } else if (cardRanks[0] === 14 && cardRanks[1] === 3 && cardRanks[2] === 2) {
                              rankInCategory = 14;
                      } else {
                              rankInCategory = cardRanks[0];
                      }
                      break;
              case 3:
                      rankInCategory = cardRanks[0] * 1e4 + cardRanks[1] * 1e2 + cardRanks[2];
                      break;
              case 2:
                      if (cardRanks[0] === cardRanks[1]) {
                              rankInCategory = cardRanks[0] * 1e2 + cardRanks[2];
                      } else if (cardRanks[0] === cardRanks[2]) {
                              rankInCategory = cardRanks[0] * 1e2 + cardRanks[1];
                      } else {
                              rankInCategory = cardRanks[1] * 1e2 + cardRanks[0];
                      }
                      break;
              case 1:
                      rankInCategory = cardRanks[0] * 1e4 + cardRanks[1] * 1e2 + cardRanks[2];
      }

      return categoryRank * 1e6 + rankInCategory;
}

function getCategoryRank(cards) {
      let cardRanks = [];
      let cardSuits = [];

      for (let i = 0; i < 3; i++) {
              if (cards[i] % 13 + 1 === 1) {
                      cardRanks.push(14);
              } else {
                      cardRanks.push(cards[i] % 13 + 1);
              }
              cardSuits.push(Math.floor(cards[i] / 13));
      }

      cardRanks.sort((a, b) => b - a);
      cardSuits.sort();

      if (cardRanks[0] === cardRanks[1] && cardRanks[0] === cardRanks[2]) {
              // Trail (three of same rank)
              return 6;
      } else if ((cardRanks[0] === cardRanks[1] + 1 && cardRanks[0] === cardRanks[2] + 2)
              || (cardRanks[0] === 14 && cardRanks[1] === 3 && cardRanks[2] === 2)) {
              // Sequence

              if (cardSuits[0] === cardSuits[1] && cardSuits[0] === cardSuits[2]) {
                      // Pure sequence
                      return 5;
              } else {
                      // Regular sequence
                      return 4;
              }
      } else if (cardSuits[0] === cardSuits[1] && cardSuits[0] === cardSuits[2]) {
              // Color (Three of same suit)
              return 3;
      } else if (cardRanks[0] === cardRanks[1] || cardRanks[0] === cardRanks[2] || cardRanks[1] === cardRanks[2]) {
              // Pair 
              return 2;
      } else {
              // High card
              return 1;
      }
}
