'use strict';

angular.module('enrollmentFrontendApp').controller('TranscriptCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', 'Upcoming', '$rootScope', function ($scope, $routeParams, ngTableParams, $filter, Upcoming, $rootScope) {
  $scope.transcript = [
    {title: 'Making Learning Visible Through Sustained Student Engagement', start: 'April 9, 2014', startdt:'2014-04-09', end: 'April 09, 2014', enddt:'2014-04-09',  leader: 'Fowler, Shelli',  credits: '1',  section: 366, role: 'learner'},
    {title: 'Field Trip to the Future - the Visionarium', start: 'March 7, 2014', startdt: '2014-03-07', end: 'March 7, 2014', enddt: '2014-03-07',  leader: 'English, Mary',  credits: '1',  section: 431, role: 'learner'},
    {title: 'University Libraries - Best Websites for Teaching and Instruction', start: 'March 3, 2014', end: 'March 03, 2014',  startdt: '2014-03-03', enddt: '2014-03-03', leader: 'Walker, Jacques',  credits: '1',  section: 335, role: 'coordinator'},
    {title: 'Seven Technology Tools to Use in Your Teaching Today', start: 'Feb. 6, 2014', end: 'Feb. 6, 2014', startdt: '2014-02-06', enddt: '2014-02-06',  leader: 'Summers, Teggin',  credits: '1',  section: 313, role: 'learner'},
    {title: 'Scholar - Engaging Students with Lessons', start: 'Feb. 4, 2014', end: 'Feb. 04, 2014', startdt: '2014-02-04', enddt: '2014-02-04',  leader: 'Bond, Aaron',  credits: '1',  section: 387, role: 'instructor'},
    {title: 'Designed Interaction Specialist Certificate', start: 'April 15, 2014', end: 'April 15, 2014', startdt: '2014-04-15', enddt: '2014-04-15',  leader: 'Yaffe, Dan',  credits: '6*',  section: 430, role: 'learner'}
  ];

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

  var transcriptCtrlScope = $scope;
  $rootScope.$on('query', function(evt, arg){
    transcriptCtrlScope.searchQuery = arg;
    transcriptCtrlScope.tableParams.reload();
  });
}]);