'use strict';
angular.module('enrollmentOfferings').service('Time', ['$http', function ($http){
  var dates = {
    fall: {
      month: 8,
      day: 15
    },
    spring: {
      month: 1,
      day: 1
    },
    summer: {
      month: 5,
      day: 12
    }
  };

  var semesters = ['spring', 'summer', 'fall'];

  this.semestYear = function(dateQuery) {
    var date = new Date();
    if (dateQuery) {
      console.log('got dateQuery');
      date = dateQuery;
    }
    var m = date.getMonth()
    var d = date.getDate()
    var i = 0;
    var j = (i+1)%semesters.length;
    var k = (i+2)%semesters.length;
    if (m >= dates[semesters[i]].month && m < dates[semesters[j]].month) {
      if (m == dates[semesters[i]].month && d >= dates[semesters[i]].day) {
        return {year: date.getFullYear(), semester: semesters[i]};
      }
      else {
        return {year: date.getFullYear(), semester: semesters[j]};
      }
    }
    else if (m >= dates[semesters[j]].month && m < dates[semesters[k]].month) {
      if (m == dates[semesters[j]].month && d >= dates[semesters[j]].day) {
        return {year: date.getFullYear(), semester: semesters[j]};
      }
      else {
        return {year: date.getFullYear(), semester: semesters[k]};
      }
    }
    else {
      return {year: date.getFullYear(), semester: semesters[k]};
    }
  };
}]);