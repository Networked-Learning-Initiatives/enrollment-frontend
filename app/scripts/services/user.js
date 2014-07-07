'use strict';
angular.module('enrollmentFrontendUser', []).service('User', ['$rootScope', function($rootScope){
  this.authenticated = 'unknown';
  this.isElevated = false;
  this.loggedIn = function() {
    if (this.authenticated == 'unknown') {
      return false;
    } else {
      return this.authenticated
    }
  }
}]);