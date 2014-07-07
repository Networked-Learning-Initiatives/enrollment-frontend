'use strict';

var resolver = function(authRequired, elevatedRequired) {
  return {
    load: function($q, User, $window) {
      console.log(User);
      console.log(authRequired, elevatedRequired);
      var deferred = $q.defer();
      if (authRequired && User.loggedIn && (!elevatedRequired || (elevatedRequired && User.isElevated))) { // fire $routeChangeSuccess
        deferred.resolve();
        console.log('ACCESS GRANTED');
        return deferred.promise;
      } else { // fire $routeChangeError
        console.log('THOU SHALT NOT PASS');
        // deferred.reject("/login");
        $window.location='/cas/login';
        // return deferred.promise;
      }
    }
  }
}

angular.module('enrollmentFrontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTable', 
  'enrollmentFrontendUser'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/offerings/:year/:semester/:offeringid', {
        templateUrl: '/static/fe/views/offerings.html',
        controller: 'OfferingsCtrl',
        reloadOnSearch: false
      })
      .when('/offerings/:year/:semester', {
        templateUrl: '/static/fe/views/offerings.html',
        controller: 'OfferingsCtrl',
        reloadOnSearch: false
      })
      .when('/offerings/:year/:semester/search/:query', {
        templateUrl: '/static/fe/views/offerings.html',
        controller: 'OfferingsCtrl',
        reloadOnSearch: false
      })
      .when('/offerings', {
        redirectTo: '/offerings/2014/fall'
      })
      .when('/offerings/search/:query', {
        redirectTo: function(params) {
          console.log('redirectTo');
          return '/offerings/2014/fall/search/'+params.query;
        }
      })
      .when('/schedule', {
        templateUrl: '/static/fe/views/schedule.html',
        controller: 'ScheduleCtrl',
        reloadOnSearch: false
      })
      .when('/transcript', {
        templateUrl: '/static/fe/views/transcript.html',
        controller: 'TranscriptCtrl',
        reloadOnSearch: false
      })
      .when('/computer/requirements', {
        templateUrl: '/static/fe/views/requirements.html',
        controller: 'RequirementsCtrl',
        reloadOnSearch: false
      })
      .when('/computer/catalog', {
        templateUrl: '/static/fe/views/catalog.html',
        controller: 'CatalogCtrl',
        reloadOnSearch: false
      })
      .when('/help', {
        templateUrl: '/static/fe/views/help.html',
        controller: 'HelpCtrl',
        reloadOnSearch: false
      })
      .when('/attendance/:sectionId', {
        templateUrl: '/static/fe/views/attendance.html',
        controller: 'AttendanceCtrl',
        reloadOnSearch: false
      })
      .when('/roster/:sectionId', {
        templateUrl: '/static/fe/views/roster.html',
        controller: 'RosterCtrl',
        reloadOnSearch: false
      })
      .when('/email/:sectionId', {
        templateUrl: '/static/fe/views/email.html',
        controller: 'EmailCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/offerings/2014/fall' //this is too simplistic, make this based on when we are in the semester or something
      });
  });
