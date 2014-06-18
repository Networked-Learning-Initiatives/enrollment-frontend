'use strict';

angular.module('enrollmentFrontendApp').controller('ScheduleCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', 'Upcoming', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, Upcoming) {
  $scope.schedule = [
    {title: 'Making Learning Visible Through Sustained Student Engagement', start: 'April 9, 2014', startdt:'2014-4-9', end: 'April 09, 2014', enddt:'2014-4-9',  theme: 'None',  credits: '1',  section: 366, role: 'learner'},
    {title: 'Field Trip to the Future - the Visionarium', start: 'March 7, 2014', startdt: '2014-3-7', end: 'March 7, 2014', enddt: '2014-3-7',  theme: 'None',  credits: '1',  section: 431, role: 'learner'},
    {title: 'University Libraries - Best Websites for Teaching and Instruction', start: 'March 3, 2014', end: 'March 03, 2014',  startdt: '2014-3-3', enddt: '2014-3-3', theme: 'None',  credits: '1',  section: 335, role: 'learner'},
    {title: 'Seven Technology Tools to Use in Your Teaching Today', start: 'Feb. 06, 2014', end: 'Feb. 6, 2014', startdt: '2014-2-6', enddt: '2014-2-6',  theme: 'None',  credits: '1',  section: 313, role: 'coordinator'},
    {title: 'Scholar - Engaging Students with Lessons', start: 'Feb. 4, 2014', end: 'Feb. 04, 2014', startdt: '2014-2-4', enddt: '2014-2-4',  theme: 'None',  credits: '1',  section: 387, role: 'instructor'},
    {title: 'Designed Interaction Specialist Certificate', start: 'Feb. 4, 2014', end: 'April 15, 2014', startdt: '2014-4-15', enddt: '2014-4-15',  theme: 'Engaging Learners',  credits: '6*',  section: 430, role: 'learner'}
  ];

  $scope.searchQuery = '';

  $scope.rm = function (offering) {
    var idx = -1;
    for (var i=0; i<$scope.schedule.length; i++) {
      if ($scope.schedule[i].section == offering.section) {
        idx = i;
        break;
      }
    }
    if (idx > -1) {
      console.log(idx);
      console.log($scope.schedule[idx]);
      $scope.schedule.splice(idx,1);
      console.log($scope.schedule[idx]);
      $scope.tableParams.reload();
    }
  };

  $scope.upcomingService = Upcoming;
  $scope.tableParams = new ngTableParams({
    count: 1000,          // count per page
    sorting: {
      startdt: 'asc'     // initial sorting
    }
  }, {
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
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  var scheduleCtrlScope = $scope;
  $rootScope.$on('query', function(evt, arg){
    scheduleCtrlScope.searchQuery = arg;
    scheduleCtrlScope.tableParams.reload();
  });
}]);