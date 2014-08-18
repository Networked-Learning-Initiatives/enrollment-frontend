'use strict';
angular.module('enrollmentFrontendApp').directive('task', ['$rootScope', function ($rootScope){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/static/fe/scripts/directives/task.html',
    scope: {
      model: '='
    },
    link: function(scope, element, attrs) {
      console.log(scope.model);
    }
  };
}]);