'use strict';
angular.module('enrollmentFrontendUser', []).service('User', ['$rootScope' ,'$http', '$cookies', function($rootScope, $http, $cookies){
  this.authenticated = false;
  this.isElevated = false;
  this.loadedUserData = false;
  this.loadedSchedule = false;
  this.loadedTranscript = false;
  this.schedule = [];
  this.transcript = [];
  this.scheduleIds = {};

  var userData = this;

  this.cbWrapper = function() {
    if (this.loadedTranscript && this.loadedSchedule) {
      this.loadedUserData = true;
    }
    if (this.loadedCB) {
      console.log(this.loadedCB, this);
      this.loadedCB(this);
    }
  };

  function parseMeetings (responseObject) {
    var parsedMeetings = [];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (var i=0; i<responseObject.results.length; i++) {
      var date = new Date(responseObject.results[i].start_time);
      var endDate = new Date(responseObject.results[i].end_time);
      var minutes = date.getMinutes();
      if (minutes<10) {
        minutes = '0'+minutes;
      }

      var hours = date.getHours();
      var ampm = 'am';
      if (hours == 0) {
        hours = 12
      }
      else if (hours == 12) {
        ampm = 'pm;'
      }
      else if (hours >12) {
        hours = hours - 12;
        ampm = 'pm';
      }

      var endHours = endDate.getHours();
      var endAmpm = 'am';
      if (endHours == 0) {
        endHours = 12
      }
      else if (endHours == 12) {
        endAmpm = 'pm;'
      }
      else if (endHours >12) {
        endHours = endHours - 12;
        endAmpm = 'pm';
      }


      var endMinutes = endDate.getMinutes();
      if (endMinutes<10) {
        endMinutes = '0'+endMinutes;
      }
      var themes = [];
      for (var j=0; j<responseObject.results[i].section.course.themes.length; j++) {
        themes.push(responseObject.results[i].section.course.themes[j].name)
      }
      var instructors = [];
      for (var j=0; j<responseObject.results[i].section.instructors.length; j++) {
        instructors.push(responseObject.results[i].section.instructors[j].last_name+', '+responseObject.results[i].section.instructors[j].first_name.substr(0,1) + '.');
      }
      var parsedLocation = 'N/A';
      if (responseObject.results[i].hasOwnProperty('location') && responseObject.results[i].location != null && responseObject.results[i].location.hasOwnProperty('building')) {
        parsedLocation = responseObject.results[i].location.building;
        if (responseObject.results[i].location.hasOwnProperty('room_number')) {
          parsedLocation += ' ' + responseObject.results[i].location.room_number;
        }
      }
      var eid = -1;
      var online = false;
      var waitlisted = false;
      for (var j=0; j<responseObject.results[i].section.enrollment_set.length; j++) {
        if (responseObject.results[i].section.enrollment_set[j].user.id == userData.id) {
          eid = responseObject.results[i].section.enrollment_set[j].id;
          online = responseObject.results[i].section.enrollment_set[j].online;
          waitlisted = responseObject.results[i].section.enrollment_set[j].waitlisted;
        }
      }

      var privileged = false;
      var role = 'learner';

      for (var j=0; j<responseObject.results[i].section.coordinator_set.length; j++) {
        if (responseObject.results[i].section.coordinator_set[j].user.id == userData.id) {
          privileged = true;
          role='coordinator'
        }
      }

      for (var j=0; j<responseObject.results[i].section.instructors.length; j++) {
        if (responseObject.results[i].section.instructors[j].id == userData.id) {
          privileged = true;
          role='instructor';
        }
      }

      var async = 'N/A';

      if (responseObject.results[i].section.max_online_seats > 0) {
        if (responseObject.results[i].section.async) {
          async = 'Self-Paced';
        }
        else {
          async = 'Live';
        }
      }


      var meeting = {
        id: responseObject.results[i].id,
        async: async,
        enrollment_id: eid,
        online: online,
        waitlisted: waitlisted,
        date: months[date.getMonth()] + ' ' + date.getDate(),
        datetime: date.getTime(),
        day: days[date.getDay()],
        time: date.getHours() + ':' + minutes,
        start: months[date.getMonth()] + ' ' + date.getDate() + ' ' + hours + ':' + minutes + ' ' + ampm,
        startdt: date,
        enddt: endDate,
        end: months[endDate.getMonth()] + ' ' + endDate.getDate() + ' ' + endHours + ':' + endMinutes + ' ' + endAmpm,
        title: responseObject.results[i].section.course.title,
        theme: themes.join(', '),
        sponsor: 'NLI',
        leader: instructors.join(', '),
        location: parsedLocation,
        expanded: false,
        description: responseObject.results[i].section.course.description.substr(0,50),
        credits: responseObject.results[i].section.course.credit_count,
        section: responseObject.results[i].section,
        role: role,
        privileged: privileged
      };
      parsedMeetings.push(meeting);
    }
    return parsedMeetings;
  }

  function scheduleResultsSuccessCallback(data, status, headers, config) {
    console.log('scheduleResultsSuccessCallback', data);
    
    if (data.count == 0) {
      userData.schedule = [];
      userData.scheduleIds = {};
      userData.cbWrapper();
    }
    else {
      if (userData.schedule.length == 0 || (userData.schedule.length >0 && userData.schedule[0].id != data.results[0].id)) {
        var parsed = parseMeetings(data);
        userData.schedule = userData.schedule.concat(parsed);
        for (var i=0; i<parsed.length; i++) {
          userData.scheduleIds[parsed[i].section.id]={eid: parsed[i].enrollment_id, waitlisted: parsed[i].waitlisted, online:parsed[i].online};
        }
      }
      if (data.hasOwnProperty('next') && data.next != null && data.next.length>0) {
        $http({method: 'GET', url: data.next}).
          success(resultsSuccessCallback).
          error(function(data, status, headers, config) {
            console.log('failed loading next schedule results');
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      } 
      else {
        userData.loadedSchedule = true;
        userData.cbWrapper();

      } 
    }
  }

  function transcriptResultsSuccessCallback(data, status, headers, config) {
    console.log('transcriptResultsSuccessCallback', data);
    if (userData.transcript.length == 0 || (userData.transcript.length >0 && userData.transcript[0].id != data.results[0].id)) {
      userData.transcript = userData.transcript.concat(parseMeetings(data));
    }
    if (data.hasOwnProperty('next') && data.next != null && data.next.length>0) {
      $http({method: 'GET', url: data.next}).
        success(resultsSuccessCallback).
        error(function(data, status, headers, config) {
          console.log('failed loading transcript in results callback');
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    } 
    else {
      // $rootScope.$emit('transcript-loaded', {});
      userData.loadedTranscript = true;
      userData.cbWrapper();

    } 
  }

  function loadSchedule(id){
    $http({method: 'GET', url: '/api/schedule/', params:{id:id}}).
      success(scheduleResultsSuccessCallback).
      error(function(data, status, headers, config) {
        console.log('failed loading schedule');
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }

  function loadTranscript(id) {
    $http({method: 'GET', url: '/api/transcript/', params:{id:id}}).
      success(transcriptResultsSuccessCallback).
      error(function(data, status, headers, config) {
        console.log('failed loading transcript');
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }

  this.loadUserData = function(cb) {
    if (cb) {
      this.loadedCB = cb;
    }

    if (!this.loadedSchedule || !this.loadedTranscript) {
      loadSchedule(this.id);
      this.loadedSchedule = true;
      loadTranscript(this.id);
      this.loadedTranscript = true;
    }
    else {
      this.cbWrapper();
    }
  };

  this.loggedIn = function() {
    if (window.userId == '' || window.userId == 'None'){
      return false;  
    }
    else {
      this.id = window.userId;
      if (!this.loadedUserData) {
        this.loadedUserData = true;
        // loadSchedule(this.id);
        // loadTranscript(this.id);
        this.loadUserData();
      }
      return true;
    }
  };

  this.enrollment = function(id) {
    return this.scheduleIds[id];
  };

  this.unenroll = function(offeringId, cb) {
    console.log('unenroll ', offeringId);
    delete this.scheduleIds[offeringId];
    var url = '/api/meetings/'+offeringId+'/';

    $http.delete(url, {
      url: url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-CSRFToken": $cookies.csrftoken
      }, 
      method: 'POST',
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken'
      }).success(function(data){
        console.log('un-enrolled ', data);
        if (cb) {
          cb();
        }
      }).error(function(){
        console.log('failed to un-enroll');
      });

    var idx = -1;
    for (var i=0; i<this.schedule.length; i++) {
      if (this.schedule[i].section.id == offeringId) {
        idx=1;
        break;
      }
    }
    if (idx >=0){
      console.log('deleted from user schedule');
      this.schedule.splice(idx, 1);
    }
    $rootScope.$emit('schedule-change', {schedule:userData.schedule});
  };

  this.enroll = function(args, cb) {
    // first make sure they're not already enrolled!
    if (!this.scheduleIds.hasOwnProperty(args.offering.id)) {
      var url = '/api/meetings/';
      var enrollment = $.param({
        id: args.offering.id, 
        online: args.isOnline, 
        waitlisted: args.isWaitlisted, 
        credits: args.offering.credits, 
        theme: args.offering.themes[0].id
      });

      $http.post(url, enrollment, {
        url: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          "X-CSRFToken": $cookies.csrftoken
        }, 
        method: 'POST',
        data: enrollment,
        xsrfHeaderName: 'X-CSRFToken',
        xsrfCookieName: 'csrftoken'
      }).success(function(data){
        console.log('enrolled');
        userData.loadedCB = function(){
          $rootScope.$emit('schedule-change', {schedule:userData.schedule});
        };
        userData.schedule = [];
        loadSchedule(userData.id);
        userData.scheduleIds[args.id] = {waitlisted: args.isWaitlisted, online:args.isOnline};
        if (cb) {
          cb();
        }
      }).error(function(){
        console.log('failed to enroll');
      });
    }
  }

}]);