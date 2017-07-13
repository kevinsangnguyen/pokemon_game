board.factory('PokemonFactory', function($http) {
		function imgIndex(index){
			var new_index = "00" + index
			return new_index.slice(-3);
		}
		var factory = {};
		var pokemon = [];

		function uppercase(str)
		{
		      return str.charAt(0).toUpperCase() + str.substring(1,str.length);
		}

		factory.index = function(callback) {
			pokemon = [];
			for (var i=0;i<3;i++)
			{
				random_number = Math.floor((Math.random() * 151) + 1);
				$http.get('/pokemon/' + random_number).success(function(output) {
					output.move_set = [];
					for (var j=0;j<4;j++){
						random_move = Math.floor((Math.random() * output.moves.length) + 1);
						$http.get(output.moves[random_move].move.url).success(function(move){
							if (move.power == null){
								move.power = 25;
								move.name = uppercase(move.name)
								output.move_set.push(move);

							}
							else {
							move.power = Math.floor(move.power * .55)
							move.name = uppercase(move.name)
							output.move_set.push(move);
							}
						})
					}
					output.current_hp = Math.floor(output.current_hp * 1.25)
					output.base_experience = Math.floor(output.base_experience * 1.25)
					output.imgindex = imgIndex(output.index);
					console.log(output)
					pokemon.push(output);
				});
			}
			callback(pokemon);

		};

		factory.getAll = function() {

			for (var i=1;i<152;i++)
			{
				$http.get('http://pokeapi.co/api/v2/pokemon/' + i).success(function(output) {
					output.name = uppercase(output.name);
					output.types[0].type.name = uppercase(output.types[0].type.name)
					output.current_hp = output.base_experience
					factory.create(output);
				});
			}

		};

		// factory.get_current_user = function(userid,callback){
		// 	$http.get('/current_user/'+userid).success(function(output){
		// 		callback(output);
		// 	})
		// }

		factory.create = function(pokemon) {
			$http.post('/create_pokemon',pokemon).success(function(created_pokemon){
				if (created_pokemon){
				}
				else {

				}
			})
		}

		// factory.find = function(user,callback) {
		// 	$http.post('/login', user).success(function(output_user){
		// 		if (output_user.length == 0){
		// 			console.log("Adding new user")
		// 			factory.create(user);
		// 			callback(current_user)

		// 		}
		// 		else {
		// 			console.log("Found user")
		// 			current_user = output_user[0]
		// 			callback(current_user)
		// 		}
		// 	})
		// }
		// note the use of callbacks!
		// Restful syntax: create = add one to that object

		// factory.remove = function(user) {

		// 	$http.delete('/remove_user/' + user._id).success(function(output){
		// 		if (output){
		// 			users.splice(users.indexOf(user),1);
		// 		}
		// 	});
		// }

		return factory;
	});
