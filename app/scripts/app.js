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
  .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/offerings/:year/:semester/:offeringid', {
          templateUrl: 'views/offerings.html',
          controller: 'OfferingsCtrl',
          reloadOnSearch: false
        })
        .when('/offerings/:year/:semester', {
          templateUrl: 'views/offerings.html',
          controller: 'OfferingsCtrl',
          reloadOnSearch: false
        })
        .when('/offerings/:year/:semester/search/:query', {
          templateUrl: 'views/offerings.html',
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
          templateUrl: 'views/schedule.html',
          controller: 'ScheduleCtrl',
          reloadOnSearch: false,
          resolve: resolver(true, false)
        })
        .when('/transcript', {
          templateUrl: 'views/transcript.html',
          controller: 'TranscriptCtrl',
          reloadOnSearch: false, 
          auth: true,
          elevated: false
        })
        .when('/computer/requirements', {
          templateUrl: 'views/requirements.html',
          controller: 'RequirementsCtrl',
          reloadOnSearch: false,
          auth: false,
          elevated: false
        })
        .when('/computer/catalog', {
          templateUrl: 'views/catalog.html',
          controller: 'CatalogCtrl',
          reloadOnSearch: false,
          auth: false,
          elevated: false
        })
        .when('/help', {
          templateUrl: 'views/help.html',
          controller: 'HelpCtrl',
          reloadOnSearch: false,
          auth: false,
          elevated: false
        })
        .when('/attendance/:sectionId', {
          templateUrl: 'views/attendance.html',
          controller: 'AttendanceCtrl',
          reloadOnSearch: false,
          auth: true, 
          elevated: true
        })
        .when('/roster/:sectionId', {
          templateUrl: 'views/roster.html',
          controller: 'RosterCtrl',
          reloadOnSearch: false,
          auth: true,
          elevated: false
        })
        .when('/email/:sectionId', {
          templateUrl: 'views/email.html',
          controller: 'EmailCtrl',
          reloadOnSearch: false,
          auth: true,
          elevated: true
        })
        .otherwise({
          redirectTo: '/offerings/2014/fall' //this is too simplistic, make this based on when we are in the semester or something
        });
    }]);
  // .run(function ($rootScope, $state, User) {
  //   $rootScope.$on("$routeChangeStart", function (event, next, current) {
  //     if (next.auth && !User.loggedIn) {

  //     }
  //   });
  // });
