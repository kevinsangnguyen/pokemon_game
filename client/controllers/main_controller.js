board.controller('MainController', function($scope, $location,BackgroundService) {
       $scope.bgService = BackgroundService;
       $scope.game = function (){
		$location.path('/game');
		}
    });

board.factory('BackgroundService', function() {
	"use strict";
    var currentBackgroundClass = 'start-bg';
    var factory = {};
    factory.setCurrentBg = function(x) {
          currentBackgroundClass = x;
        };
    factory.getCurrentBg = function() {
           return currentBackgroundClass;
       }
    return factory;
});
