'use strict';

angular.module('enrollmentFrontendApp')
  .controller('OfferingsCtrl', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout) {
    console.log($routeParams);
  	console.log($scope.searchQuery);
  	$scope.isActive = function(query) {
  		console.log(query);
  		console.log($routeParams.semester);
  		console.log($routeParams.semester == query);
  		if($routeParams.hasOwnProperty('semester')&& $routeParams.semester == query) {
  			return true;
  		}
  		return false;
  	};

    // $scope.searchQuery = '';

    $scope.select = function(offering) {
      offering.expanded=!offering.expanded;
      console.log(offering, $location.search());
      $location.path('/offerings/'+$routeParams.year+'/'+$routeParams.semester+'/'+offering.id);
      // $location.search('cheese');
    };

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
        expanded: false
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
        expanded: false
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
        expanded: false
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
        expanded: false
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
        expanded: false
      }      
    ];

    $scope.filteredData = $scope.offerings;

    function objIdxById(id, arr) {
      for (var i=0; i<arr.length; i++) {
        if (arr[i].id == id) {
          return i;
        }
      }
      return -1;
    }

    if ($routeParams.hasOwnProperty('offeringid') && $routeParams.offeringid.length > 0) {
      var idx = objIdxById($routeParams.offeringid, $scope.filteredData);
      if (idx >= 0) {
        $scope.select($scope.filteredData[idx]);
        console.log($routeParams.offeringid);
        $timeout(function(){
          console.log('HEEEEEY');
          console.log(angular.element('#'+$routeParams.offeringid));
          console.log(angular.element('#'+$routeParams.offeringid)[0].offsetTop);
          window.scrollTo(0,angular.element('#'+$routeParams.offeringid)[0].offsetTop+260);
        }, 1);
        // window.scrollTo(0,angular.element('#'+$routeParams.offeringid).offsetTop+260);
      }
    }

    $scope.tableParams = new ngTableParams({
      count: 1000,          // count per page
      sorting: {
          datetime: 'asc'     // initial sorting
      }
    }, {
    	counts: [],
      total: $scope.offerings.length, 
      getData: function($defer, params) {
        $scope.filteredData = $scope.offerings;
        if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
          $scope.filteredData = $filter('filter')($scope.offerings,$scope.searchQuery, function(actual, expected) {
            // console.log(actual, expected);;
            var idx = actual.toString().toLowerCase().indexOf(expected);
            return idx > -1;
          });          
        }
        // else { //maybe don't need else bc of assigning to offerings before filtering every time

        // } 
        var orderedData = params.sorting() ? $filter('orderBy')($scope.filteredData, params.orderBy()) : $scope.filteredData;
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
