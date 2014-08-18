'use strict';
angular.module('enrollmentOfferings').service('Upcoming', ['Offering', function(Offering){
  this.upcoming = {};
  var upcomingService = this;

  function translateOfferingsToUpcoming(data) {
    console.log('translateOfferingsToUpcoming', data);
    var dayAbbrv = {
      Monday: 'Mon.',
      Tuesday: 'Tues.',
      Wednesday: 'Wed.',
      Thursday: 'Thurs.',
      Friday: 'Fri.',
      Saturday: 'Sat.',
      Sunday: 'Sun.'
    };
    var results = [];
    for (var i=0; i<data.length; i++) {
      var entry = {};
      entry.meetingTime = dayAbbrv[data[i].day] + ' ' + data[i].time;
      entry.title = data[i].title;
      entry.id = data[i].id;
      results.push(entry);
    }
    return results;
  }

  function updateOfferings (year, sem, cb) {
    console.log('updateOfferings');
    Offering.upcomingOfferings(year, sem, function(data){
      console.log('updateOfferings cb')
      upcomingService.upcoming[year][sem]=translateOfferingsToUpcoming(data);
      cb(upcomingService.upcoming[year][sem]);
    });
  }
  
  this.getUpcoming = function(year, sem, upcomingCallback) {
    if (this.upcoming.hasOwnProperty(year)) {
      if (this.upcoming[year].hasOwnProperty(sem)) {
        if (this.upcoming[year][sem].length==0) {
          updateOfferings(year, sem, upcomingCallback);
        }
        else {
          upcomingCallback(upcomingService.upcoming[year][sem]);
        }
      }
      else {
        this.upcoming[year][sem] = [];
        updateOfferings(year, sem, upcomingCallback);
      }
    }
    else {
      this.upcoming[year]= {};
      this.upcoming[year][sem] = [];
      updateOfferings(year, sem, upcomingCallback);
    }
  }
}]);