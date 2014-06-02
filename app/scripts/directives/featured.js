'use strict';
angular.module('enrollmentFrontendApp').directive('featured', ['$rootScope', function ($rootScope){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'scripts/directives/featured.html',
    scope: {
      data: '='
    },
    link: function(scope, element, attrs) {
      // console.log('linking featured');
      // console.log(scope.data);
    }
  };
}]);