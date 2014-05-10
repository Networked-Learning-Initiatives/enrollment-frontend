'use strict';

angular.module('enrollmentFrontendApp').controller('SearchCtrl', function ($scope, $routeParams, $location, $rootScope) {
	// console.log('SearchCtrl');
	$scope.searchQuery='';
	// $scope.search = function() {
	// 	console.log('SEARCH', $scope.searchQuery);
	// }
	$scope.$watch('searchQuery', function() {
		var offeringsBase = '/offerings';
		// if ($location.path().substr(0,offeringsBase.length) != offeringsBase) {
			console.log('redir');
			var semester = 'fall';
			var year = '2014';
			if ($location.path().indexOf('spring') > -1) {
				semester = 'spring';
				year = '2015';
			}
			$location.path(offeringsBase+'/'+year+'/'+semester+'/search/'+$scope.searchQuery);
		// }
		// else {
		// 	$rootScope.$emit('query', $scope.searchQuery);
		// }
	})
});