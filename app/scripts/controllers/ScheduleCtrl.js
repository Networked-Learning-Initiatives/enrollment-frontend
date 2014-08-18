'use strict';

angular.module('enrollmentFrontendApp').controller('ScheduleCtrl', [
  '$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', 
  'Upcoming', 'User', '$http', '$cookies',
  function ($scope, $routeParams, ngTableParams, $filter, $rootScope, 
    Upcoming, User, $http, $cookies) {
  var scheduleCtrlScope = $scope;

  $scope.schedule = [];
  $scope.searchQuery = '';
  $scope.userService = User;
  $rootScope.$on('schedule-change', function(evt,data){
    console.log('schedule-change', data);
    scheduleCtrlScope.schedule = data.schedule;
    scheduleCtrlScope.tableParams.reload();
  });

  $scope.rm = function (offering, idx) {
    console.log(offering);
    $scope.schedule.splice(idx,1);
    $scope.userService.unenroll(offering.section.id, function(){scheduleCtrlScope.tableParams.reload();});
  };

  $scope.upcomingService = Upcoming;
  $scope.tableParams = new ngTableParams(
    {
      count: 1000,          // count per page
      sorting: {
        startdt: 'asc'     // initial sorting
      }
    }, 
    {
      counts: [],
      total: $scope.schedule.length, 
      getData: function($defer, params) {
        var filteredData = $scope.schedule;
        if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
          filteredData = $filter('filter')($scope.schedule,$scope.searchQuery, function(actual, expected) {
            var idx = actual.toString().toLowerCase().indexOf(expected);
            return idx > -1;
          });          
        }
        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
        console.log(filteredData);
        console.log(orderedData);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    }
  );

  User.loadUserData(function(data){
    scheduleCtrlScope.schedule = data.schedule;
    scheduleCtrlScope.tableParams.reload();
  });

  $scope.email = function(section) {
    $rootScope.$emit('email-modal', {section: section});
  };

  $rootScope.$on('query', function(evt, arg){
    scheduleCtrlScope.searchQuery = arg;
    scheduleCtrlScope.tableParams.reload();
  });
}]);