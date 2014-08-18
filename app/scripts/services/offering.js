'use strict';
angular.module('enrollmentOfferings', []).service('Offering', ['$http', function ($http){
  
  var offeringsService = this;
  this.offerings = {};
  var numUpcoming = 5;
  
  this.getOfferings = function(year, sem, cb, refresh) {
    function resultsSuccessCallback (data, status, headers, config) {
      function parseOfferings (responseObject) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var themeImages = {
          "Engaging Learners" : 'el',
          "Securing Your Technology" : 'st',
          "Research & Discovery" : 'rnd',
          "Visual Media & Web Design" : 'vm',
          "T.E.A.L. Tools " : 'tl',
          "Programming & Software" : 'ps',
          "Online Strategies and eLearning" : 'onl'
        };

        var parsedOfferings = [];
        for (var i=0; i<responseObject.results.length; i++) {
          var date = new Date(responseObject.results[i].start_time);
          var minutes = date.getMinutes();
          if (minutes<10) {
            minutes = '0'+minutes;
          }
          var themes = [];
          for (var j=0; j<responseObject.results[i].section.course.themes.length; j++) {
            var theThemeName = responseObject.results[i].section.course.themes[j].name;
            themes.push({name:theThemeName, src:themeImages[theThemeName], id:responseObject.results[i].section.course.themes[j].id});
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

          var endDate = new Date(responseObject.results[i].end_time);
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

          var searchTheme = '';
          if (themes && themes.length > 0) {
            searchTheme = themes[0].name;
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
          
          var offering = {
            id: responseObject.results[i].section.id,
            async: async,
            date: months[date.getMonth()] + ' ' + date.getDate(),
            datetime: date.getTime(),
            day: days[date.getDay()],
            time: hours + ':' + minutes + ' ' + ampm,
            longTime: hours + ':' + minutes + ' - ' + endHours + ':' + endMinutes + ' ' + endAmpm,
            title: responseObject.results[i].section.course.title,
            theme: searchTheme,
            themes: themes,
            sponsor: 'NLI',
            leaders: instructors,
            location: parsedLocation,
            expanded: false,
            description: responseObject.results[i].section.course.description.substr(0,50),
            credits: responseObject.results[i].section.course.credit_count,
            enrolledPhysically: responseObject.results[i].section.enrolled_offline,
            enrolledOnline: responseObject.results[i].section.enrolled_online,
            maxPhysical: responseObject.results[i].section.max_seats,
            maxOnline: responseObject.results[i].section.max_online_seats
          };
          parsedOfferings.push(offering);
        }
        return parsedOfferings;
      }
      if (offeringsService.offerings[year][sem].length == 0 || (offeringsService.offerings[year][sem].length > 0 && offeringsService.offerings[year][sem][0].id != data.results[0].section.id)) {
        var parsed = parseOfferings(data);
        console.log('parsed', parsed);
        offeringsService.offerings[year][sem] = offeringsService.offerings[year][sem].concat(parsed);
        if (cb) {
          console.log('has cb', cb);
          cb(parsed);
        }
        if (data.hasOwnProperty('next') && data.next != null && data.next.length>0) {
          $http({method: 'GET', url: data.next}).
            success(resultsSuccessCallback).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        }
      }
      else {
        console.log('send upcoming even though it made a dup req');
        if (cb && 
          offeringsService.hasOwnProperty('offerings') && 
          offeringsService.offerings.hasOwnProperty(year) &&
          offeringsService.offerings[year].hasOwnProperty(sem)) {
            cb(offeringsService.offerings[year][sem]);
        }

      }
    }

    if (this.offerings.hasOwnProperty(year)) {
      if (this.offerings[year].hasOwnProperty(sem)) {
        if (refresh) {
          this.offerings[year][sem] = [];
          $http({method: 'GET', url: '/api/meetings/', params:{year: year, semester: sem}}).
            success(resultsSuccessCallback).
            error(function(data, status, headers, config) {});
        }
        else if (this.offerings[year][sem].length==0) {
          $http({method: 'GET', url: '/api/meetings/', params:{year: year, semester: sem}}).
            success(resultsSuccessCallback).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        }
        else {
          // send the data back via the provided callback
          if (cb) {
            cb(this.offerings[year][sem]);
          }
        }
      }
      else {
        this.offerings[year][sem] = [];
        $http({method: 'GET', url: '/api/meetings/', params:{year: year, semester: sem}}).
          success(resultsSuccessCallback).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      }
    }
    else {
      console.log('get the storage for offerings ready');
      this.offerings[year] = {};
      this.offerings[year][sem] = [];
      $http({method: 'GET', url: '/api/meetings/', params:{year: year, semester: sem}}).
        success(resultsSuccessCallback).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
  };
  
  this.upcomingOfferings = function(year, sem, featureCallback) {
    console.log('upcomingOfferings');
    if (this.offerings.hasOwnProperty(year) 
      && this.offerings[year].hasOwnProperty(sem) 
      && this.offerings[year][sem].length > 0) {
      console.log('about to check for cb in offering');
      if (featureCallback) {
        console.log('about to cb in offering');
        featureCallback(this.offerings[year][sem].slice(0, numUpcoming));
      }
    }
    else {
      console.log('else');
      this.getOfferings(year, sem, function(data){
        console.log('else cb', data);
        if (featureCallback) {
          featureCallback(data.slice(0, numUpcoming));
        }
      });
    }
  };
}]);