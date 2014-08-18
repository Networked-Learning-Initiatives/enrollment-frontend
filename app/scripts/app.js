'use strict';

var resolver = function(authRequired, rt) {
  return {
    load: function($q, User, $window, $rootScope, $location) {
      // console.log(User);
      // console.log($location.path());
      // console.log(authRequired);
      var deferred = $q.defer();
      // console.log(User.loggedIn());
      if (authRequired && User.loggedIn()) { // fire $routeChangeSuccess
        console.log(User.id)
        deferred.resolve();
        // console.log('ACCESS GRANTED');
        return deferred.promise;
      } else { // fire $routeChangeError
        console.log('THOU SHALT NOT PASS');
        // $window.location='/cas/login';
        $rootScope.$emit('login-modal', {attempted: $location.path()});
        if (rt) {
          deferred.reject(rt);
        }
        deferred.reject("login failed");
        return deferred.promise;
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
  'enrollmentFrontendUser',
  'ui.bootstrap',
  'enrollmentOfferings'
])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
      $httpProvider.defaults.xsrfHeaderName = 'csrfmiddlewaretoken';
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      
      $routeProvider
        .when('/offerings/:year/:semester/:offeringid', {
          templateUrl: '/static/fe/views/offerings.html',
          controller: 'OfferingsCtrl',
          reloadOnSearch: false
        })
        .when('/offerings/:year/:semester', {
          templateUrl: '/static/fe/views/offerings.html',
          controller: 'OfferingsCtrl',
          reloadOnSearch: false,
        })
        .when('/offerings/:year/:semester/search/:query', {
          templateUrl: '/static/fe/views/offerings.html',
          controller: 'OfferingsCtrl',
          reloadOnSearch: false,
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
        .when('/enrollment/:action/:section/:online/:waitlisted', {
          templateUrl: '/static/fe/views/enrollment-action.html',
          controller: 'EnrollmentActionCtrl',
          reloadOnSearch: false,
        })
        .when('/enrollment/:action/:section', {
          templateUrl: '/static/fe/views/enrollment-action.html',
          controller: 'EnrollmentActionCtrl',
          reloadOnSearch: false,
        })
        .when('/schedule', {
          templateUrl: '/static/fe/views/schedule.html',
          controller: 'ScheduleCtrl',
          reloadOnSearch: false,
          resolve: {
            load: resolver(true, '/schedule').load,
          }
        })
        .when('/transcript', {
          templateUrl: '/static/fe/views/transcript.html',
          controller: 'TranscriptCtrl',
          reloadOnSearch: false,
          resolve: {
            load: resolver(true, '/transcript').load,
          }
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
        .when('/attendance/:meetingId', {
          templateUrl: '/static/fe/views/attendance.html',
          controller: 'AttendanceCtrl',
          reloadOnSearch: false,
          resolve: resolver(true, '/attendance')
        })
        .when('/roster/:sectionId', {
          templateUrl: '/static/fe/views/roster.html',
          controller: 'RosterCtrl',
          reloadOnSearch: false,
          resolve: resolver(true, '/roster')
        })
        .otherwise({
          redirectTo: '/offerings/2014/fall' //this is too simplistic, make this based on when we are in the semester or something
        });
    }]);
