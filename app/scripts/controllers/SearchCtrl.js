'use strict';

angular.module('enrollmentFrontendApp').controller('SearchCtrl', function ($scope, $routeParams, $location, $rootScope) {
	// console.log('SearchCtrl');
	$scope.searchQuery='';
	// $scope.search = function() {
	// 	console.log('SEARCH', $scope.searchQuery);
	// }
	$scope.$watch('searchQuery', function() {
		var offeringsBase = '/offerings';
		if ($location.path().substr(0,offeringsBase.length) != offeringsBase) {
			console.log('redir');
			$location.path(offeringsBase+'/2014/fall/search/'+$scope.searchQuery);
		}
		else {
			$rootScope.$emit('query', $scope.searchQuery);
		}
	})
});