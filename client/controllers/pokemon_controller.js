board.controller('PokemonController', function($scope,PokemonFactory,$uibModal,$log,socket, $routeParams, BackgroundService) {
		BackgroundService.setCurrentBg('game-bg')
		$scope.isCollapsed = true;

		PokemonFactory.index(function(data) {
		  $scope.pokemon = data;
		});

		$scope.refresh = function (){
			PokemonFactory.index(function(data) {
				$scope.pokemon = data;
			});

			socket.emit("battle_ready");
		}

		$scope.download = function (){
			PokemonFactory.getAll();
		}

		$scope.animationsEnabled = true;

	  $scope.yourpokeman = function (size,pokeman) {

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	        pokeman: function() {
	        	return $scope.pokemon[$scope.pokemon.indexOf(pokeman)];
	        }
	      }
	    });
	   }

	   $scope.battle = function (size) {

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'battle.html',
	      controller: 'BattleCtrl',
	      size: size,
	      windowClass: 'app-modal-window',
	      resolve: {
	        mypokemon: function() {
	        	return $scope.pokemon;
	        },
	        mychar : function() {
	        	return $scope.mychar;
	        },
	      }
	    });

	   }

	   $scope.battle2 = function (size,pokeman) {
	   	$scope.current_pokemon = pokeman;

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'battle.html',
	      controller: 'BattleCtrl',
	      size: size,
	      resolve: {
	        mypokemon: function() {
	        	return $scope.pokemon;
	        },
	        mychar : function() {
	        	return $scope.mychar;
	        }
	      }
	    });
	   }

	var a;
	var b;
	//socket listeners
	socket.on('START',function(data){

		if (data.status == "Character1"){
			$scope.mychar = data.status;
			a = new PlayGround('ch1',120,165,'DOWN',true);
			a.initialize();
			setInterval(a.mainLoop, 200);
			setInterval(function(){
				socket.emit("update1",a.character)
			},200);


			if (data.character2 != null){
			$('#ch2').css('top',data.character2.ch_y).css('left',data.character2.ch_x);
			b = new PlayGround('ch2',data.character2.ch_x,data.character2.ch_y,data.character2.action,true)
			setInterval(b.mainLoop, 200);
			}

			socket.on("char2update",function(char2){
				if (char2){
					$('#ch2').css('top',char2.ch_y).css('left',char2.ch_x);
					b = new PlayGround('ch2',char2.ch_x,char2.ch_y,char2.action,true)
					setInterval(b.mainLoop, 200);
				}
				else {
					$('#ch2').css('background','');
				}
			});

			socket.on("Battle",function(){
				$scope.battle();
			});

			$scope.player_count = 0;
		}

		if (data.status == "Character2"){
			$scope.mychar = data.status;
			a = new PlayGround('ch2',400,190,'DOWN',true);
			a.initialize();
			setInterval(a.mainLoop, 200);
			setInterval(function(){
				socket.emit("update2",a.character)
			},200);


			if (data.character1 != null){
			$('#ch1').css('top',data.character1.ch_y).css('left',data.character1.ch_x);
			b = new PlayGround('ch1',data.character1.ch_x,data.character1.ch_y,data.character1.action,true)
			setInterval(b.mainLoop, 200);
			}

			socket.on("char1update",function(char1){
				if (char1){
					$('#ch1').css('top',char1.ch_y).css('left',char1.ch_x);
					b = new PlayGround('ch1',char1.ch_x,char1.ch_y,char1.action,true)
					setInterval(b.mainLoop, 200);
				}
				else {
					$('#ch1').css('background','');
				}
			});

			socket.on("Battle",function(){
				$scope.battle();
				var themesong = document.getElementById("themesong");
				themesong.pause();
			})

			$scope.player_count = 1;
		}

		if(data.status=="Full"){
			$scope.player_count = 2;
		}

	});


});

board.controller('ModalInstanceCtrl', function($scope,$uibModalInstance,pokeman) {

	  $scope.pokeman = pokeman;

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('close');
	  };
});

board.controller('BattleCtrl', function($scope,$uibModalInstance,mypokemon,mychar,socket) {


	  $scope.mypokemon = mypokemon;
	  $scope.mychar = mychar;
	  $scope.won = false;

	  if ($scope.mychar == "Character1")
		  {
		  	socket.on("character2_pokemon",function(opponent_pokemon){
		  		$scope.opponent_pokemon = opponent_pokemon
		  	});
		  	socket.on("attacked1",function(move){
		  		$scope.current_pokemon.current_hp -= move.power;
		  		if ($scope.current_pokemon.current_hp <= 0)
		  		{
		  			$scope.current_pokemon.current_hp = 0;
		  			$scope.mypokemon[$scope.current_pokemon_index] = $scope.current_pokemon;
		  			$scope.alert = $scope.current_pokemon + " has fainted!";
		  			$scope.current_pokemon = null;
		  			$scope.lost = true;
		  			for (index in $scope.mypokemon)
		  			{
		  				if ($scope.mypokemon[index].current_hp > 0){
		  					$scope.lost = false;
		  				}
		  			}
		  			if ($scope.lost == true){
		  				socket.emit("lost",{player:$scope.mychar})
		  			}
		  			console.log($scope.lost)
		  		}


		  	});
		  }

		else if($scope.mychar == "Character2")
		  {
		  	socket.on("character1_pokemon",function(opponent_pokemon){
		  		$scope.opponent_pokemon = opponent_pokemon
		  	});
		  	socket.on("attacked2",function(move){
		  		$scope.current_pokemon.current_hp -= move.power;
		  		if ($scope.current_pokemon.current_hp <= 0)
		  		{
		  			$scope.current_pokemon.current_hp = 0;
		  			$scope.mypokemon[$scope.current_pokemon_index] = $scope.current_pokemon;
		  			$scope.alert = $scope.current_pokemon + " has fainted!";
		  			$scope.current_pokemon = null;
		  			$scope.lost = true;
		  			for (index in $scope.mypokemon){
		  				if ($scope.mypokemon[index].current_hp > 0){
		  					$scope.lost = false;
		  				}
		  			}
		  			if ($scope.lost == true){
		  				socket.emit("lost", {player:$scope.mychar})
		  			}
		  		}
		  	});
		  }

		socket.on("Turn",function(player){
			if (player == $scope.mychar)
			{
				$scope.your_turn = true;
			}
			else
			{
				$scope.your_turn = false;
			}
		})

	  $scope.choosepokemon = function (pokeman){
	  	$scope.current_pokemon = pokeman;
	  	$scope.current_pokemon_index = $scope.mypokemon.indexOf(pokeman);
	  	socket.emit("new_pokemon",$scope.current_pokemon.name + " has appeared to fight!")
	  	if ($scope.mychar == "Character1")
		  {
		  	socket.emit("character1_current_pokemon",$scope.current_pokemon);
		  }
		if ($scope.mychar == "Character2")
		  {
		  	socket.emit("character2_current_pokemon",$scope.current_pokemon);
		  }

	  };

	  $scope.attack = function(move){
	  	var crit_chance = Math.floor((Math.random() * 100) + 1);
	  	if (crit_chance < 7){
	  		move.power = Math.floor(move.power*1.5)
	  		var alert = $scope.current_pokemon.name + " used " + move.name + " and it was a critical hit!!"
	  	}
	  	else {
	  		var alert = $scope.current_pokemon.name + " used " + move.name + " and it did " + move.power + " damage!!"
	  	}
	  	if ($scope.mychar == "Character1"){
	  		socket.emit("attack1",{move:move, alert:alert})
	  	}
	  	if ($scope.mychar == "Character2"){
	  		socket.emit("attack2",{move:move, alert:alert})
	  	}
	  }

	  socket.on("won",function(character){
	  	if ($scope.mychar == character)
	  	{
	  		$scope.won = true;
	  	}
	  })

	  socket.on("alert",function(alert){
	  	$scope.alert = alert;
	  })

	  $scope.cancel = function () {
	  	$scope.won = false;
	  	$scope.lost = false;
	  	var battlesong = document.getElementById("battletheme");
		battlesong.pause();
	    $uibModalInstance.dismiss('close');
	  };


});
