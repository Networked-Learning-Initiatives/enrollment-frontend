'use strict';
angular.module('enrollmentFrontendApp').controller('NavCtrl', ['$scope', '$routeParams', '$location', 'User', function ($scope, $routeParams, $location, User) {
	$scope.isActive = function(query) {
		if($routeParams.hasOwnProperty('semester')&& $routeParams.semester == query) {
			return true;
		}
		else if ($location.path()) {
			var path = $location.path();
			if (path.substr(1, query.length)==query) {
				return true;
			}
		}
		return false;
	};

	$scope.userService = User;

	$scope.loginLogout = function() {
		console.log($scope.userService.loggedIn);
		$scope.userService.loggedIn = !$scope.userService.loggedIn;
	};
}]);