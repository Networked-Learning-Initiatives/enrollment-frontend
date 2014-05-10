'use strict';

angular.module('enrollmentFrontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTable'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/offerings/:year/:semester/:offeringid', {
        templateUrl: 'views/offerings.html',
        controller: 'OfferingsCtrl'
      })
      .when('/offerings/:year/:semester', {
        templateUrl: 'views/offerings.html',
        controller: 'OfferingsCtrl'
      })
      .when('/offerings/:year/:semester/search/:query', {
        templateUrl: 'views/offerings.html',
        controller: 'OfferingsCtrl'
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
        controller: 'ScheduleCtrl'
      })
      .when('/transcript', {
        templateUrl: 'views/transcript.html',
        controller: 'TranscriptCtrl'
      })
      .when('/computer/requirements', {
        templateUrl: 'views/requirements.html',
        controller: 'RequirementsCtrl'
      })
      .when('/computer/catalog', {
        templateUrl: 'views/catalog.html',
        controller: 'CatalogCtrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
      })
      .otherwise({
        redirectTo: '/offerings/2014/fall' //this is too simplistic, make this based on when we are in the semester or something
      });
  });
