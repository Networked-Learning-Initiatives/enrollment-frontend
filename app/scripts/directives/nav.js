'use strict';
angular.module('enrollmentFrontendApp').directive('navigation', ['User', '$location', '$window', '$rootScope', '$http', '$cookies', function (User, $location, $window, $rootScope, $http, $cookies){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/static/fe/scripts/directives/nav.html',
    link: function(scope, element, attrs) {
      scope.userService = User;
      // console.log('about to check url');
      // console.log($location.search());
      scope.login = function(successPath) {
        console.log('login');
        // console.log($location.url());
        // console.log($window.location.href);
        $rootScope.$emit('login-modal', {attempted: successPath});
        // $window.location.href='/accounts/login?return='+$location.url();
      };
      scope.logout = function() {
        console.log('logout');
        window.userId = 'None';
        var url = "/api/logout/"+scope.userService.id+"/";
        $http.delete(url, {
          url: url,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-CSRFToken": $cookies.csrftoken
          }, 
          method: 'POST',
          xsrfHeaderName: 'X-CSRFToken',
          xsrfCookieName: 'csrftoken'
          }).success(function(data){
            console.log('loggedout ');
          }).error(function(){
            console.log('failed to un-enroll');
          });
        // $location.url('/accounts/logout?return='+$location.url());
      };
      scope.casLogin = function(returnPath){
        console.log($location.absUrl(), returnPath, $location.path(), window.location.origin);
        // var url = '/api/login/';
        // var data = $.param({
        //   csrfmiddlewaretoken: $cookies.csrftoken,
        //   return_path: returnPath 
        // });
        // $http.post(url, data, {
        //   url: url,
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     "X-CSRFToken": $cookies.csrftoken
        //   }, 
        //   method: 'POST',
        //   data: data,
        //   xsrfHeaderName: 'X-CSRFToken',
        //   xsrfCookieName: 'csrftoken'
        // }).success(function(data){
        //   console.log('sent to cas login');
        // }).error(function(){
        //   console.log('error trying to cas login');
        // });
      };
      // console.log('linking featured');
      // console.log(scope.data);
      scope.ifLoggedIn = function(path) {
        if (User.loggedIn()) {
          return path;
        } else {
          // console.log('nav else', $location.url());
          return '#'+$location.path()+'?login&attempted='+path;//.substr(1);
        }
      }
    }
  };
}]);