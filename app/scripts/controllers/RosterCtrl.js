'use strict';

angular.module('enrollmentFrontendApp').controller('RosterCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', '$location', '$timeout', 'Upcoming', '$http', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout, Upcoming, $http) {
  var rosterCtrlScope = $scope;
  $scope.lonely = function() {
    return $scope.registered.length < 1;
  };

  var url = '/api/sections/'+$routeParams.sectionId+'/';


  $scope.searchQuery = '';

  $scope.registered = [
    // {
    //   firstName: 'Steve',
    //   lastName: 'Harrison',
    //   pid: 'SteveHarrison',
    //   dept: 'Computer Science',
    //   online: true,
    //   waitlisted: false
    // },
    // {
    //   firstName: 'Deborah',
    //   lastName: 'Tatar',
    //   pid: 'DeborahTatar',
    //   dept: 'Computer Science',
    //   online: false,
    //   waitlisted: false
    // },
    // {
    //   firstName: 'Shelli',
    //   lastName: 'Fowler',
    //   pid: 'ShelliFowler',
    //   dept: 'NLI',
    //   online: false,
    //   waitlisted: true
    // },
    // {
    //   firstName: 'Mary',
    //   lastName: 'English',
    //   pid: 'MaryEnglish',
    //   dept: 'NLI',
    //   online: false,
    //   waitlisted: false
    // },
    // {
    //   firstName: 'Jacques',
    //   lastName: 'Walker',
    //   pid: 'JacquesWalker',
    //   dept: 'NLI',
    //   online: true,
    //   waitlisted: false
    // },
    // {
    //   firstName: 'Shannon',
    //   lastName: 'Lipscomb',
    //   pid: 'ShannonLipscomb',
    //   dept: 'NLI',
    //   online: false,
    //   waitlisted: true
    // },
    // {
    //   firstName: 'Dan',
    //   lastName: 'Yaffe',
    //   pid: 'DanYaffe',
    //   dept: 'Education',
    //   online: false,
    //   waitlisted: false
    // },
    // {
    //   firstName: 'Ben',
    //   lastName: 'Knapp',
    //   pid: 'BenKnapp',
    //   dept: 'ICAT',
    //   online: false,
    //   waitlisted: false
    // },
    // {
    //   firstName: 'Michael',
    //   lastName: 'Stewart',
    //   pid: 'MichaelStewart',
    //   dept: 'All of the Above',
    //   online: false,
    //   waitlisted: false
    // }
  ];

  $scope.offering = {
    // id:1,
    // date:'August 27',
    // datetime: '2014-08-27',
    // day: 'Monday',
    // time: '1-2pm', 
    // title: 'ePortfolio Student Showcase1',
    // theme: 'Engaging Learners',
    // sponsor: 'ATEL',
    // leader: 'Summers, Teggin',
    // location: 'TBD',
    // expanded: false, 
    // description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
    // credits: 1
  };

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function resultsSuccessCallback(data, status, headers, config) {

  
        
    console.log(data);
    if (data.length > 0) {
      var entry = data[0];

      var date = new Date(entry.section.meeting_set[0].start_time);
      var minutes = date.getMinutes();
      if (minutes<10) {
        minutes = '0'+minutes;
      }

      var themes = [];
      for (var j=0; j<entry.section.course.themes.length; j++) {
        themes.push(entry.section.course.themes[j])
      }

      var instructors = [];
      for (var j=0; j<entry.section.instructors.length; j++) {
        instructors.push(entry.section.instructors[j].last_name+', '+entry.section.instructors[j].first_name.substr(0,1) + '.');
      }

      var parsedLocation = 'N/A';
      if (entry.section.meeting_set[0].hasOwnProperty('location') && entry.section.meeting_set[0].location != null && entry.section.meeting_set[0].location.hasOwnProperty('building')) {
        parsedLocation = entry.section.meeting_set[0].location.building;
        if (entry.section.meeting_set[0].location.hasOwnProperty('room_number')) {
          parsedLocation += ' ' + entry.section.meeting_set[0].location.room_number;
        }
      }
        
      $scope.offering = {
        id: entry.section.id,
        date: months[date.getMonth()] + ' ' + date.getDate(),
        datetime: date.getTime(),
        day: days[date.getDay()],
        time: date.getHours() + ':' + minutes, 
        title: entry.section.course.title,
        themes: themes,
        sponsor: 'NLI',
        leader: instructors.join(', '),
        location: parsedLocation,
        // expanded: false, 
        description: entry.section.course.description.substr(0,50),
        credits: entry.section.course.credit_count
      };
    }
    // console.log(JSON.parse(data));
    var rosterEntries = data;
    if ($scope.registered.length == 0) {
      $scope.registered = rosterEntries;
    }
    else {
      for (var i=0; i<rosterEntries.length; i++) {
        $scope.registered.push(rosterEntries[i]);
      }
    }
    rosterCtrlScope.tableParams.reload();

    if (data.hasOwnProperty('next') && data.next != null && data.next.length>0) {
      $http({method: 'GET', url: data.next}).
        success(resultsSuccessCallback).
        error(function(data, status, headers, config) {
          console.log('FAIL!');
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
  }


  $http({method: 'GET', url: url}).
    success(resultsSuccessCallback).
    error(function(data, status, headers, config) {
      console.log('FAIL!');
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

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

  $rootScope.$on('query', function(evt, arg){
    console.log('search roster');
    rosterCtrlScope.searchQuery = arg;
    rosterCtrlScope.tableParams.reload();
  });
}]);
