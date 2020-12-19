
const $container = document.getElementById('container');
const $home_page = document.getElementById('home_page');
const $name_input_create_game = document.getElementById('name_input_create_game');
const $create_game_div = document.getElementById('create_game_div');
const $name_input_join_game = document.getElementById('name_input_join_game');
const $room_id_input = document.getElementById('room_id_input');
const $join_game_div = document.getElementById('join_game_div');
const $start_page = document.getElementById('start_page');
const $room_id_display = document.getElementById('room_id_display');
const $active_users = document.getElementById('active_users');
const $start_game_div = document.getElementById('start_game_div');
const $game_content = document.getElementById('game_content');
const $table_container = document.getElementById('table_container');
const $topbar = document.getElementById('topbar');
const $chat_messages_display = document.getElementById('chat_messages_display');
const $chat_input = document.getElementById('chat_input');

var welcome_deck = undefined;


const socket = io('http://localhost:3000');

const current_user = {
        name: "",
        room_id: ""
};


$create_game_div.addEventListener('click', (e) => {

        const name = $name_input_create_game.value;
        current_user.name = name;



        socket.emit('create new game', name);
});

$join_game_div.addEventListener('click', (e) => {

        const name = $name_input_join_game.value;
        const room_id = $room_id_input.value;
        current_user.name = name;

        socket.emit('join game', name, room_id);
});

$start_game_div.addEventListener('click', (e) => {

        welcome_deck.unmount($container);
        $start_page.style.display = "none";
        $game_content.style.display = "block";
        game_start_animation();
});

socket.on('new room id', (room_id) => {

        $room_id_display.value = room_id;

        current_user.room_id = room_id;

        $home_page.style.display = "none";
        $start_page.style.display = "flex";
});

socket.on('new users', (users) => {

        var user_list = "";

        for (var i = 0; i < users.length; i++) {
                user_list += '<input value="' + users[i].username + '" class="input100" type="text" name="username" placeholder="Enter display name" readonly />';
        }

        $active_users.innerHTML = user_list;
});

socket.on('new message', (messages) => {

        if (messages === undefined || messages.length === 0) {
                return;
        }
        
        var msg_list = "";
        for (var i = 0; i < messages.length; i++) {
                if (i%2 === 0){
                        msg_list += '<div class="'+'msg-send'+'">' + '<b>' + messages[i].sender + ':' + '</b>' + messages[i].message + '</div>';
                }
                else{
                        msg_list += '<div class="'+'msg-receive'+'">' + '<b>' + messages[i].sender + ':' + '</b>' + messages[i].message + '</div>';
                }
                
        }

        $chat_messages_display.innerHTML = msg_list;
});

socket.on('room_id does not exist', () => {
        
        e.log("Invalid room id");
});

// Explosion JS ...........................
function welcome_animation() {

        // create Deck
        welcome_deck = Deck();

        // add to DOM
        welcome_deck.mount($container);

        var counter = 0;
        function finished() {
                counter++;
                if (counter === 52) {

                        // setTimeout(function(){ document.getElementById('home_page').style.display='none'; welcome_deck.unmount($container); }, 3000);
                        document.getElementById('home_page').style.display = 'flex';
                }

        };

        welcome_deck.cards.forEach(function (card, i) {
                card.setSide('front');

                // explode
                card.animateTo({
                        delay: 1000 + i * 2, // wait 1 second + i * 2 ms
                        duration: 500,
                        ease: 'quartOut',

                        x: Math.random() * window.innerWidth - window.innerWidth / 2,
                        y: Math.random() * window.innerHeight - window.innerHeight / 2,
                        onComplete: finished
                });
        });

}
// Explosion JS ...........................

welcome_animation();

// Chat Box JS..................
$(function () {

        var arrow = $('.chat-head img');
        var textarea = $('.chat-text textarea');

        arrow.on('click', function () {
                var src = arrow.attr('src');

                $('.chat-body').slideToggle('fast');
                if (src == 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png') {
                        arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_up-16.png');
                }
                else {
                        arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png');
                }
        });

        textarea.keypress(function (event) {
                var $this = $(this);

                if (event.keyCode == 13) { // enter key

                        var msg = $this.val();
                        $this.val('');
                        const room_id = current_user.room_id;
                        const sender = current_user.name;

                        socket.emit('send message', msg, sender, room_id);
                        // $('.msg-insert').append("<div class='msg-send'>" + msg + "</div>");
                        return false;
                }
        });
});
// Chat Box Js ...................



// Game Deck .....................
var prefix = Deck.prefix
var transform = prefix('transform')
var translate = Deck.translate

var $sort = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $fan = document.createElement('button')
var $poker = document.createElement('button')
var $flip = document.createElement('button')

$shuffle.textContent = 'Shuffle'
$sort.textContent = 'Sort'
$bysuit.textContent = 'By suit'
$fan.textContent = 'Fan'
$poker.textContent = 'Poker'
$flip.textContent = 'Flip'

$topbar.appendChild($flip)
$topbar.appendChild($shuffle)
$topbar.appendChild($bysuit)
$topbar.appendChild($fan)
$topbar.appendChild($poker)
$topbar.appendChild($sort)

// Game play Deck ............
var deck = Deck();
// Game play Deck ............

$shuffle.addEventListener('click', function () {
        deck.shuffle()
        deck.shuffle()
})
$sort.addEventListener('click', function () {
        deck.sort()
})
$bysuit.addEventListener('click', function () {
        deck.sort(true) // sort reversed
        deck.bysuit()
})
$fan.addEventListener('click', function () {
        deck.fan()
})
$flip.addEventListener('click', function () {
        deck.flip()
})
$poker.addEventListener('click', function () {
        deck.queue(function (next) {
                deck.cards.forEach(function (card, i) {
                        setTimeout(function () {
                                card.setSide('back')
                        }, i * 7.5)
                })
                next()
        })
        deck.shuffle()
        deck.shuffle()
        deck.poker()
})

deck.cards.forEach(function (card, i) {
        card.enableFlipping();
        card.enableDragging();
});

function game_start_animation() {
        deck.mount($container)
        deck.intro()
        deck.sort()
}

// Game Deck .....................
