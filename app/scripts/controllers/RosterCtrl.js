'use strict';

angular.module('enrollmentFrontendApp').controller('RosterCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', '$location', '$timeout', 'Upcoming', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout, Upcoming) {
  $scope.lonely = function() {
    return $scope.registered.length < 1;
  };

  $scope.searchQuery = '';

  $scope.registered = [
    {
      firstName: 'Steve',
      lastName: 'Harrison',
      pid: 'SteveHarrison',
      dept: 'Computer Science',
      online: true,
      waitlisted: false
    },
    {
      firstName: 'Deborah',
      lastName: 'Tatar',
      pid: 'DeborahTatar',
      dept: 'Computer Science',
      online: false,
      waitlisted: false
    },
    {
      firstName: 'Shelli',
      lastName: 'Fowler',
      pid: 'ShelliFowler',
      dept: 'NLI',
      online: false,
      waitlisted: true
    },
    {
      firstName: 'Mary',
      lastName: 'English',
      pid: 'MaryEnglish',
      dept: 'NLI',
      online: false,
      waitlisted: false
    },
    {
      firstName: 'Jacques',
      lastName: 'Walker',
      pid: 'JacquesWalker',
      dept: 'NLI',
      online: true,
      waitlisted: false
    },
    {
      firstName: 'Shannon',
      lastName: 'Lipscomb',
      pid: 'ShannonLipscomb',
      dept: 'NLI',
      online: false,
      waitlisted: true
    },
    {
      firstName: 'Dan',
      lastName: 'Yaffe',
      pid: 'DanYaffe',
      dept: 'Education',
      online: false,
      waitlisted: false
    },
    {
      firstName: 'Ben',
      lastName: 'Knapp',
      pid: 'BenKnapp',
      dept: 'ICAT',
      online: false,
      waitlisted: false
    },
    {
      firstName: 'Michael',
      lastName: 'Stewart',
      pid: 'MichaelStewart',
      dept: 'All of the Above',
      online: false,
      waitlisted: false
    }
  ];

  $scope.offering = {
    id:1,
    date:'August 27',
    datetime: '2014-08-27',
    day: 'Monday',
    time: '1-2pm', 
    title: 'ePortfolio Student Showcase1',
    theme: 'Engaging Learners',
    sponsor: 'ATEL',
    leader: 'Summers, Teggin',
    location: 'TBD',
    expanded: false, 
    description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
    credits: 1
  };

  $scope.tableParams = new ngTableParams(
    {
      count: 1000,          // count per page
      sorting: {
          firstName: 'asc'     // initial sorting
      }
    }, {
    counts: [],
    total: $scope.registered.length, 
    getData: function($defer, params) {
      console.log($scope.registered);
      var filteredData = $scope.registered;
      if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
        filteredData = $filter('filter')($scope.registered,$scope.searchQuery, function(actual, expected) {
          var idx = actual.toString().toLowerCase().indexOf(expected);
          return idx > -1;
        });          
      }
      var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  var rosterCtrlScope = $scope;
  $rootScope.$on('query', function(evt, arg){
    console.log('search roster');
    rosterCtrlScope.searchQuery = arg;
    rosterCtrlScope.tableParams.reload();
  });
}]);
