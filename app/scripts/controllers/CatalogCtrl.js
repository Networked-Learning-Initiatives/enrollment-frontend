'use strict';

angular.module('enrollmentFrontendApp').controller('CatalogCtrl', function ($scope, $routeParams) {
	console.log($routeParams);
	$scope.isActive = function(query) {
		console.log(query);
		console.log($routeParams.semester);
		console.log($routeParams.semester == query);
		if($routeParams.hasOwnProperty('semester')&& $routeParams.semester == query) {
			return true;
		}
		else if (true) {

		}
		return false;
	};
});