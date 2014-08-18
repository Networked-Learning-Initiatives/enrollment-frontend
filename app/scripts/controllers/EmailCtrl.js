'use strict';

angular.module('enrollmentFrontendApp').controller('EmailCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', '$location', '$timeout', 'Upcoming', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout, Upcoming) {
  $scope.lonely = function() {
    return $scope.registered.length < 1;
  };

  $scope.registered = [
    {
      firstName: 'Steve',
      lastName: 'Harrison',
      present: false
    },
    {
      firstName: 'Deborah',
      lastName: 'Tatar',
      present: false
    },
    {
      firstName: 'Shelli',
      lastName: 'Fowler',
      present: false
    },
    {
      firstName: 'Mary',
      lastName: 'English',
      present: true
    },
    {
      firstName: 'Jacques',
      lastName: 'Walker',
      present: false
    },
    {
      firstName: 'Shannon',
      lastName: 'Lipscomb',
      present: false
    },
    {
      firstName: 'Dan',
      lastName: 'Yaffe',
      present: true
    },
    {
      firstName: 'Ben',
      lastName: 'Knapp',
      present: false
    },
    {
      firstName: 'Michael',
      lastName: 'Stewart',
      present: false
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
}]);
