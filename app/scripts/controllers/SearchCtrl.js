'use strict';

angular.module('enrollmentFrontendApp').controller('SearchCtrl', function ($scope, $routeParams, $location, $rootScope) {
	// console.log('SearchCtrl');
	$scope.searchQuery='';
	// $scope.search = function() {
	// 	console.log('SEARCH', $scope.searchQuery);
	// }
	// $rootScope.$on('$routeUpdate', function(scope, next, current) {
	// 	console.log('route update detected in SearchCtrl');
	// 	$scope.searchQuery='';
	// });

	$rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
		// console.log('$routeChangeSuccess detected in SearchCtrl', scope, next, current);
		$scope.searchQuery='';
	});

	// $rootScope.$on('$routeChangeStart', function(scope, next, current) {
	// 	console.log('$routeChangeStart detected in SearchCtrl');
	// 	$scope.searchQuery='';
	// });

	$scope.$watch('searchQuery', function() {
		// var offeringsBase = '/offerings';
		// // if ($location.path().substr(0,offeringsBase.length) != offeringsBase) {
		// 	console.log('redir');
		// 	var semester = 'fall';
		// 	var year = '2014';
		// 	if ($location.path().indexOf('spring') > -1) {
		// 		semester = 'spring';
		// 		year = '2015';
		// 	}
		// 	$location.search({q:$scope.searchQuery});
		// // }
		// // else {
		$rootScope.$emit('query', $scope.searchQuery);
		// // }
	})
});