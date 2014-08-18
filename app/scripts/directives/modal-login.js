'use strict';
angular.module('enrollmentFrontendApp').directive('modalLogin', ['User', '$location', '$window', '$rootScope', '$http', '$cookies', function (User, $location, $window, $rootScope, $http, $cookies){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/static/fe/scripts/directives/modal-login.html',
    link: function(scope, element, attrs) {
      $rootScope.$on('login-modal', function(evt, data){
        scope.attempted = data.attempted;
        scope.attemptedAction = data.attemptedAction;
        scope.attemptedActionArgs = data.args;
        $('#login-modal').modal('show');
        if (!$location.search().hasOwnProperty('login')){
          $location.search({login:true});
        }
      });

      if ($location.search().hasOwnProperty('login')){
        $('#login-modal').modal('show');
      }


      $(document).on('keydown', function(event) {
        if (event.which == 27) {
          $('#close-modal-login').click();
        }
      });

      scope.close = function() {
        $('#login-modal').modal('hide');
        if ($location.search().hasOwnProperty('login')){
          var searchQuery = $location.search();
          searchQuery.login = false;
          $location.search({});
        }
      };

      scope.loginFromModal = function() {
        var url = '/accounts/auth';
        var data = $.param({
          'csrfmiddlewaretoken': $cookies.csrftoken,
          'username': scope.username,
          'password': scope.password
        });
        $http.post(url, data, {
          url: url,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-CSRFToken": $cookies.csrftoken
          }, 
          method: 'POST',
          data: data,
          xsrfHeaderName: 'X-CSRFToken',
          xsrfCookieName: 'csrftoken'
        }).success(function(data){
          if (data.success) {
            $('#login-modal').modal('hide');
            window.userId = data.user_id;
            User.id = data.user_id;
            User.authenticated = true;
            $rootScope.$emit('logged-in');
            if (scope.hasOwnProperty('attempted') && scope.attempted) {
              $location.path(scope.attempted.substr(1));
            }
            else if (scope.hasOwnProperty('attemptedAction') && scope.attemptedAction) {
              scope.attemptedAction(scope.attemptedActionArgs);
            }
          } else {
            scope.message = 'Username or password is incorrect, please try again.'         
          }
        });
      };
    }
  };
}]);