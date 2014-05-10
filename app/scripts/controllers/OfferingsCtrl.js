'use strict';

angular.module('enrollmentFrontendApp')
  .controller('OfferingsCtrl', function ($scope, $routeParams, ngTableParams, $filter, $rootScope) {
  	// console.log($routeParams);
  	$scope.isActive = function(query) {
  		console.log(query);
  		console.log($routeParams.semester);
  		console.log($routeParams.semester == query);
  		if($routeParams.hasOwnProperty('semester')&& $routeParams.semester == query) {
  			return true;
  		}
  		return false;
  	};

    $scope.searchQuery = '';

    if ($routeParams.hasOwnProperty('query') && $routeParams.query.length > 0) {
      console.log($routeParams.query);
      $scope.searchQuery = $routeParams.query;
    }


    $scope.offerings = [
      {
        id:1,
        date:'April 28',
        datetime: '2014-08-27',
        day: 'Monday',
        time: '1-2pm', 
        title: 'ePortfolio Student Showcase1',
        theme: 'Engaging Learners',
        sponsor: 'ATEL',
        leader: 'Summers, Teggin',
        location: 'TBD',
      },
      {
        id:2,
        date:'April 28',
        datetime: '2014-08-28',
        day: 'Monday',
        time: '1-2pm', 
        title: 'ePortfolio Student Showcase2',
        theme: 'Engaging Learners',
        sponsor: 'ATEL',
        leader: 'Summers, Teggin',
        location: 'TBD',
      },
      {
        id:3,
        date:'April 28',
        datetime: '2014-08-29',
        day: 'Monday',
        time: '1-2pm', 
        title: 'ePortfolio Student Showcase3',
        theme: 'Engaging Learners',
        sponsor: 'ATEL',
        leader: 'Summers, Teggin',
        location: 'TBD',
      },
      {
        id:4,
        date:'April 28',
        datetime: '2014-08-30',
        day: 'Monday',
        time: '1-2pm', 
        title: 'ePortfolio Student Showcase4',
        theme: 'Engaging Learners',
        sponsor: 'ATEL',
        leader: 'Summers, Teggin',
        location: 'TBD',
      },
      {
      	id:5,
      	date:'April 28',
      	datetime: '2014-08-31',
      	day: 'Monday',
      	time: '1-2pm', 
      	title: 'ePortfolio Student Showcase5',
      	theme: 'Engaging Learners',
      	sponsor: 'ATEL',
      	leader: 'Summers, Teggin',
      	location: 'TBD',
      }      
    ];

    $scope.tableParams = new ngTableParams({
      count: 1000,          // count per page
      sorting: {
          datetime: 'asc'     // initial sorting
      }
    }, {
    	counts: [],
      total: $scope.offerings.length, 
      getData: function($defer, params) {
        var filteredData = $scope.offerings;
        if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
          filteredData = $filter('filter')($scope.offerings,$scope.searchQuery, function(actual, expected) {
            // console.log(actual, expected);;
            var idx = actual.toString().toLowerCase().indexOf(expected);
            return idx > -1;
          });          
        }
        // else { //maybe don't need else bc of assigning to offerings before filtering every time

        // } 
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    var offeringsCtrlScope = $scope;
    $rootScope.$on('query', function(evt, arg){
      // console.log(arg);
      offeringsCtrlScope.searchQuery = arg;
      offeringsCtrlScope.tableParams.reload();
    });
  });
