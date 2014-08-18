'use strict';

angular.module('enrollmentFrontendApp').controller('AttendanceCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', '$location', '$timeout', 'Upcoming', '$http', '$cookies', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout, Upcoming, $http, $cookies) {
  $scope.lonely = function() {
    return $scope.registered.length < 1;
  };

  var attendanceCtrlScope = $scope;
  var meetingId = $routeParams.meetingId;

  $scope.registered = [];

  $scope.offering = {};

  var baseURL = '/api/attendance/';

  var listUrl = baseURL+meetingId+'/';

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function parseResults (results) {
    var parsed = [];
    for (var i=0; i<results.length; i++) {
      if (i==0) {
        var date = new Date(results[i].meeting.start_time);
        var endDate = new Date(results[i].meeting.end_time);
        var minutes = date.getMinutes();
        if (minutes<10) {
          minutes = '0'+minutes;
        }

        var endMinutes = endDate.getMinutes();
        if (endMinutes<10) {
          endMinutes = '0'+endMinutes;
        }
        
        var instructors = [];
        for (var j=0; j<results[i].meeting.section.instructors.length; j++) {
          instructors.push(results[i].meeting.section.instructors[j].first_name+' '+results[i].meeting.section.instructors[j].last_name);
        }
        var parsedLocation = 'N/A';
        if (results[i].meeting.hasOwnProperty('location') && results[i].meeting.location != null && results[i].meeting.location.hasOwnProperty('building')) {
          parsedLocation = results[i].meeting.location.building;
          if (results[i].meeting.location.hasOwnProperty('room_number')) {
            parsedLocation += ' ' + results[i].meeting.location.room_number;
          }
        }
        attendanceCtrlScope.offering.date = months[date.getMonth()] + ' ' + date.getDate();
        attendanceCtrlScope.offering.day = days[date.getDay()];
        attendanceCtrlScope.offering.time = date.getHours() + ':' + minutes + '-' + endDate.getHours() + ':' + endMinutes;
        attendanceCtrlScope.offering.title = results[i].meeting.section.course.title;
        attendanceCtrlScope.offering.leaders = instructors;
        attendanceCtrlScope.offering.location = parsedLocation;
      }
      var attendance = {
        attendanceId: results[i].id,
        firstName: results[i].user.first_name,
        lastName: results[i].user.last_name,
        attended: results[i].attended,
      };
      parsed.push(attendance);
    }
    return parsed;
  }

  function resultsSuccessCallback (data, status, headers, config) {
    console.log(data);
    attendanceCtrlScope.registered = attendanceCtrlScope.registered.concat(parseResults(data));
    // for (var i=0; i<data.length; )
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

  $http({method: 'GET', url: listUrl}).
    success(resultsSuccessCallback).
    error(function(data, status, headers, config) {
      console.log('FAIL!');
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  $scope.toggleAttendance = function(person) {
    person.attended = !person.attended;
    var updateUrl = baseURL+person.attendanceId+'/';
    $http.put(updateUrl, person.attended, {
      url: updateUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-CSRFToken": $cookies.csrftoken
      }, 
      method: 'POST',
      data: person.attended,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken'
    }).success(function(data){
      console.log('attendance updated to ', person.attended);
    }).error(function(){
      console.log('failed to update attendance');
    });
  };
}]);
