'use strict';

angular.module('enrollmentFrontendApp').controller('OfferingsCtrl', [
  '$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', 
  '$location', '$timeout', '$http', 'Upcoming', '$cookies', 'User', 'Offering', 
  function ($scope, $routeParams, ngTableParams, $filter, $rootScope, 
    $location, $timeout, $http, Upcoming, $cookies, User, Offering) {
  $scope.year = $routeParams.year;
  var offeringsCtrlScope = $scope;
  $scope.currentOffering = [];
  $scope.userService = User;

  $scope.offerings = {
    spring: [],
    summer: [],
    fall: []
  };
  
  $scope.semester = function() {
    if ($routeParams.hasOwnProperty('semester')) {
      return $routeParams.semester;
    }
    else {
      return "fall";
    }
  }

  $scope.isActive = function(query) {
    if($routeParams.hasOwnProperty('semester')&& $routeParams.semester == query) {
      return true;
    }
    return false;
  };

  $scope.showEnroll = function(offering) {
    // not enrolled physically
    // not waitlisted physically
    // seats left
    return $scope.seatsAvailable(offering) > 0 &&
      (!$scope.userService.loggedIn() ||
        ($scope.userService.loggedIn() && 
          (!$scope.userService.enrollment(offering.id) || 
          ($scope.userService.enrollment(offering.id) && $scope.userService.enrollment(offering.id).online))));
  };

  $scope.showEnrollOnline = function(offering) {
    // not enrolled online
    // not waitlisted online
    // seats left
    return $scope.seatsAvailableOnline(offering) > 0 &&
      (!$scope.userService.loggedIn() ||
        ($scope.userService.loggedIn() && 
          (!$scope.userService.enrollment(offering.id) || 
          ($scope.userService.enrollment(offering.id) && !$scope.userService.enrollment(offering.id).online))));
  };

  $scope.showJoinWaitlist = function(offering) {
    // no seats left physically 
    // not enrolled physically
    // not waitlisted physically
    // if (offering.id == 369) {
    //   console.log($scope.seatsAvailable(offering));
    // }
    return $scope.seatsAvailable(offering) == 0 &&
      (!$scope.userService.loggedIn() ||
        ($scope.userService.loggedIn() && 
          (!$scope.userService.enrollment(offering.id) || 
          ($scope.userService.enrollment(offering.id) && $scope.userService.enrollment(offering.id).online))));
  };

  $scope.showJoinWaitlistOnline = function(offering) {
    // no seats left online 
    // not enrolled online
    // not waitlisted online
    // console.log(offering.id);
    // if (offering.id == 369) {
    //   console.log($scope.userService.enrollment(offering.id));
    //   console.log(!$scope.userService.enrollment(offering.id)&&true);
    // }
    return $scope.seatsAvailableOnline(offering) == 0 &&
      (!$scope.userService.loggedIn() ||
        ($scope.userService.loggedIn() && 
          (!$scope.userService.enrollment(offering.id) || 
          ($scope.userService.enrollment(offering.id) && !$scope.userService.enrollment(offering.id).online))));
  };

  $scope.disableEnroll = function(offering) {
    // enrolled online OR waitlisted online
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      $scope.userService.enrollment(offering.id).online;
  };

  $scope.disableEnrollOnline = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      !$scope.userService.enrollment(offering.id).online;
  };

  $scope.disableJoinWaitlist = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      $scope.userService.enrollment(offering.id).online;
  };

  $scope.disableJoinWaitlistOnline = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      !$scope.userService.enrollment(offering.id).online;
  };

  $scope.showUnenroll = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      !$scope.userService.enrollment(offering.id).online && 
      !$scope.userService.enrollment(offering.id).waitlisted;
  };

  $scope.showUnenrollOnline = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      $scope.userService.enrollment(offering.id).online && 
      !$scope.userService.enrollment(offering.id).waitlisted;
  };

  $scope.showLeaveWaitlist = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      !$scope.userService.enrollment(offering.id).online && 
      $scope.userService.enrollment(offering.id).waitlisted;
  };

  $scope.showLeaveWaitlistOnline = function(offering) {
    return $scope.userService.loggedIn() && 
      $scope.userService.enrollment(offering.id) && 
      $scope.userService.enrollment(offering.id).online && 
      $scope.userService.enrollment(offering.id).waitlisted;
  };

  $scope.seatsAvailable = function(offering) {
    var result = offering.maxPhysical - offering.enrolledPhysically;
    if (result > -1) {
      return result;
    }
    return 0;
  };

  $scope.seatsAvailableOnline = function(offering) {
    var result = offering.maxOnline - offering.enrolledOnline;
    if (result > -1) {
      return result;
    }
    return 0;
  };

  function enrollUser (args) {
    offeringsCtrlScope.userService.enroll(args, function() {
      offeringsCtrlScope.resetOfferings(offeringsCtrlScope.year, offeringsCtrlScope.semester(), function(){
        offeringsCtrlScope.tableParams.reload();
      });
    });
  }

  $scope.enroll = function(offering, isOnline, isWaitlisted) {
    if ($scope.userService.loggedIn()) {
      enrollUser({offering:offering, isOnline:isOnline, isWaitlisted:isWaitlisted});
    } else {
      $rootScope.$emit('login-modal', {
        attemptedAction: enrollUser, 
        args: {offering:offering, isOnline:isOnline, isWaitlisted:isWaitlisted}
      });
    }
  };

  $scope.unenroll = function(offering) {
    $scope.userService.unenroll(offering.id, function(){
      offeringsCtrlScope.resetOfferings(offeringsCtrlScope.year, offeringsCtrlScope.semester(), function(){
        offeringsCtrlScope.tableParams.reload();
      });
    });
  };

  $scope.resetOfferings = function(year, sem, cb) {
    Offering.getOfferings(year, sem, cb);
  };

  $scope.select = function(offeringId) {
    console.log($scope.semester());
    var offering = $scope.offerings[$scope.semester()][objIdxById(offeringId, $scope.offerings[$scope.semester()])];
    // if ($scope.currentOffering.hasOwnProperty('expanded')) {
    if (offeringId != $scope.currentOffering.id) {
      $scope.currentOffering.expanded = false;
    }
    // }
    $scope.currentOffering = offering;
    $scope.currentOffering.expanded = !$scope.currentOffering.expanded;
    if ($scope.currentOffering.expanded) {
      $location.search({offering:$scope.currentOffering.id});
    }
    else {
      $location.search('offering', null);
    }
  };

  function selectOffering() {
    if ($routeParams.hasOwnProperty('query') && $routeParams.query.length > 0) {
      offeringsCtrlScope.searchQuery = $routeParams.query;
    }

    if ($routeParams.hasOwnProperty('offering')) {
      offeringsCtrlScope.offerings[offeringsCtrlScope.semester()][objIdxById($routeParams.offering, offeringsCtrlScope.offerings[offeringsCtrlScope.semester()])].expanded = true;
      offeringsCtrlScope.currentOffering = offeringsCtrlScope.offerings[offeringsCtrlScope.semester()][objIdxById($routeParams.offering, offeringsCtrlScope.offerings[offeringsCtrlScope.semester()])];
      $timeout(function(){
        window.scrollTo(0,angular.element('#'+$routeParams.offering)[0].offsetTop+245);
      }, 1);
    }

    if ($location.search('offering')) {
      offeringsCtrlScope.offerings[offeringsCtrlScope.semester()][objIdxById($location.search('offering'), offeringsCtrlScope.offerings[offeringsCtrlScope.semester()])].expanded = true;
      offeringsCtrlScope.currentOffering = offeringsCtrlScope.offerings[offeringsCtrlScope.semester()][objIdxById($location.search('offering'), offeringsCtrlScope.offerings[offeringsCtrlScope.semester()])];
      $timeout(function(){
        window.scrollTo(0,angular.element('#'+$location.search('offering'))[0].offsetTop+245);
      }, 1);
    }
  }

  $rootScope.$on('select-offering', function(evt, id){
    offeringsCtrlScope.select(id);
    //if we're not on the right offerings page, change to it?
  });  

  $scope.upcomingService = Upcoming;

  $scope.filteredData = $scope.offerings[$scope.semester()];

  function objIdxById(id, arr) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  function tableFilter (query, items) {
    var filteredResults = [];
    for (var i=0; i<items.length; i++) {
      var item = items[i];
      for (var prop in item) {
        if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filteredResults.push(item);
          break;
        }
      }
    }
    return filteredResults;
  }

  $scope.tableParams = new ngTableParams({
    count: 1000,          // count per page
    sorting: {
        datetime: 'asc'     // initial sorting
    }
  }, {
    counts: [],
    total: $scope.offerings[$scope.semester()].length, 
    getData: function($defer, params) {
      $scope.filteredData = $scope.offerings[$scope.semester()];
      if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
        $scope.filteredData = tableFilter($scope.searchQuery, $scope.filteredData, params.orderBy());    
      }
      var orderedData = params.sorting() ? $filter('orderBy')($scope.filteredData, params.orderBy()) : $scope.filteredData;
      $defer.resolve(orderedData);
    }
  });

  Offering.getOfferings($scope.year, $scope.semester(), function(data){
    offeringsCtrlScope.offerings[offeringsCtrlScope.semester()] = offeringsCtrlScope.offerings[offeringsCtrlScope.semester()].concat(data);
    offeringsCtrlScope.tableParams.reload();
    var queryStr = $location.search();
    if (queryStr.hasOwnProperty('offering')) {
      offeringsCtrlScope.select(queryStr.offering);
    }
  });

  $rootScope.$on('query', function(evt, arg){
    offeringsCtrlScope.searchQuery = arg;
    offeringsCtrlScope.tableParams.reload();
  });
}]);
