'use strict';
angular.module('enrollmentFrontendApp').controller('NavCtrl', function ($scope, $routeParams, $location) {
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
});