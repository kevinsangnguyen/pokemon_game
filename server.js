// require express so that we can build an express app
var express = require('express');
// require path so that we can use path stuff like path.join
var path = require('path');
// instantiate the app
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb'}));
// set up a static file server that points to the "client" directory
app.use(express.static(path.join(__dirname, './client')));

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);


var server = app.listen(8000, function() {
  console.log('cool stuff on: 8000');
});

var io = require('socket.io').listen(server)
var player_count;
var characters = [];
var character1;
var character2;
var character1_current_pokemon;
var character2_current_pokemon;
var battle_log;
var turn;
var battling = false;
var number_players = characters.length

io.sockets.on('connection', function (socket) {

  // Check characters for open slot
	if(!character1){
		socket.emit("START",{status:"Character1",character1 : character1, character2: character2})
		character1 = {};
		character1.socketid = socket.id;
	}
	else if (!character2){
		socket.emit("START",{status:"Character2",character1 : character1, character2: character2})
		character2 = {};
		character2.socketid = socket.id;
	}
	else {
		socket.emit("START",{status:"Full"})
	}


  // Update each character's location/id
	socket.on('update1',function(char1){
		if (character1){
			if (character1.socketid){
				var temp = character1.socketid;
			}
			character1 = char1;
			character1.socketid = temp;
		}
	})
	socket.on('update2',function(char2){
		if(character2){
			if (character2.socketid){
				var temp = character2.socketid;
			}
			character2 = char2;
			character2.socketid = temp;
		}
	})

  // Constant update
	setInterval(function() {
		socket.emit("char1update",character1)
	},200);
	setInterval(function() {
		socket.emit("char2update",character2)
	},200);

  // Collision detection for Battle
	setInterval(function() {
		if (character1 && character2){
			delta_x = Math.abs(character1.ch_x - character2.ch_x);
			delta_y = Math.abs(character1.ch_y - character2.ch_y);
			if (delta_x < 16 && delta_y < 16 && battling == false){
				battling = true;
				io.emit("Battle");
				var random = Math.floor(Math.random() * 2) + 1;
				if (random == 1){
					io.emit("Turn","Character1");
				}
				else {
					io.emit("Turn","Character2");
				}
			}
		}
	},200);


// Battle sequence
	socket.on("character1_current_pokemon",function(pokemon){
		character1_current_pokemon = pokemon;
		io.emit("character1_pokemon", character1_current_pokemon)
	})
	socket.on("character2_current_pokemon",function(pokemon){
		character2_current_pokemon = pokemon;
		io.emit("character2_pokemon", character2_current_pokemon)
	})

	socket.on('attack1', function(attack){
		io.emit('attacked2', attack.move);
		character2_current_pokemon.current_hp -= attack.move.power;
		io.emit("alert", attack.alert)
		if (character2_current_pokemon.current_hp <= 0){
			io.emit("alert", character2_current_pokemon.name + " has fallen!")
		}
		io.emit("character2_pokemon", character2_current_pokemon)
		io.emit("Turn","Character2");
	})
	socket.on('attack2', function(attack){
		io.emit('attacked1', attack.move);
		character1_current_pokemon.current_hp -= attack.move.power;
		io.emit("alert", attack.alert)
		if (character1_current_pokemon.current_hp <= 0){
			io.emit("alert", character1_current_pokemon.name + " has fallen!")
		}
		io.emit("character1_pokemon", character1_current_pokemon)
		io.emit("Turn","Character1");
	})

	socket.on('lost',function(player){
		console.log(player);
		io.emit("alert", "Your opponent has no more Pokemon! Battle is over! Please refresh your pokemon to battle again.")
		if (player.player == "Character1"){
			io.emit("won","Character2")
		}
		if (player.player == "Character2"){
			io.emit("won","Character1")
		}
	});

	socket.on("new_pokemon",function(alert){
		io.emit('alert',alert)
	})

	socket.on("battle_ready",function(){
		battling = false;
	})


	socket.on('disconnect', function(){
		console.log("disconnected")
		if (character1){
			if(character1.socketid === socket.id){
				character1 = null;
				battling=false;
			}
		}
		if (character2){
			if (character2.socketid === socket.id ){
				character2 = null;
				battling=false;
			}
		}
	})


});
