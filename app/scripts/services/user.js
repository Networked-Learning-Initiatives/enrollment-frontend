'use strict';
angular.module('enrollmentFrontendApp').service('User', ['$rootScope', function($rootScope){
  this.loggedIn = true;
}]);