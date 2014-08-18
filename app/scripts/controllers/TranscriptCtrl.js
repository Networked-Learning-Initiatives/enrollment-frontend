'use strict';

angular.module('enrollmentFrontendApp').controller('TranscriptCtrl', [
  '$scope', '$routeParams', 'ngTableParams', '$filter', 
  'Upcoming', '$rootScope', '$http', '$cookies', 'User', 
  function ($scope, $routeParams, ngTableParams, $filter, 
    Upcoming, $rootScope, $http, $cookies, User) {
  var transcriptCtrlScope = $scope;

  $scope.email = function(section) {
    $rootScope.$emit('email-modal', {section: section});
  }

  $scope.transcript = [];
  User.loadUserData(function(data){
    transcriptCtrlScope.transcript = data.transcript;
  });

  $scope.searchQuery = '';
  $scope.upcomingService = Upcoming;

  $scope.tableParams = new ngTableParams({
      count: 1000,          // count per page
      sorting: {
        startdt: 'asc'     // initial sorting
      }
    }, {
    counts: [],
    total: $scope.transcript.length, 
    getData: function($defer, params) {
      var filteredData = $scope.transcript;
      if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
        filteredData = $filter('filter')($scope.transcript,$scope.searchQuery, function(actual, expected) {
          var idx = actual.toString().toLowerCase().indexOf(expected);
          return idx > -1;
        });          
      }
      var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  $rootScope.$on('transcript-loaded', function(evt, arg){
    transcriptCtrlScope.tableParams.reload();
  });

  $rootScope.$on('query', function(evt, arg){
    transcriptCtrlScope.searchQuery = arg;
    transcriptCtrlScope.tableParams.reload();
  });
}]);