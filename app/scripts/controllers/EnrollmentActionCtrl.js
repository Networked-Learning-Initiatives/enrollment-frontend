'use strict';

angular.module('enrollmentFrontendApp').controller('EnrollmentActionCtrl', ['$routeParams', '$location', 'User', function ($routeParams, $location, User) {
  console.log($routeParams.action);
  console.log($routeParams.section);
  if ($routeParams.action == 'enroll') {
    console.log($routeParams.online);
    console.log($routeParams.waitlisted);
    User.enroll({offering:$routeParams.section, isOnline:$routeParams.online, isWaitlisted:$routeParams.waitlisted}, function(){
      $location.path('/offerings');
    });
  }
  else if ($routeParams.action == 'unenroll') {
    User.unenroll($routeParams.section, function(){
      $location.path('/offerings');
    });
  }
  else {
    console.log('error case in EnrollmentActionCtrl');
    $location.path('/offerings');
  }

}]);
