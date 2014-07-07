'use strict';
angular.module('enrollmentFrontendUser', []).service('User', ['$rootScope', function($rootScope){
  this.authenticated = false;
  this.isElevated = false;
  this.loggedIn = function() {
    if (this.authenticated !== true) {
      if (window.userId == ''){
        return false;  
      }
      else {
        this.id = window.userId;
        return true;
      }
    } else {
      return true;
    }
  }
}]);