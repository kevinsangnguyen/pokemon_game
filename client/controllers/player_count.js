board.controller('PlayerCount', function($scope,$location) {
	$scope.player_count;


	$scope.game = function (){
		$location.path('/game');
	}

});
