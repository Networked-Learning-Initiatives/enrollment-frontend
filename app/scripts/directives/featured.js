'use strict';
angular.module('enrollmentOfferings').directive('featured', ['Upcoming', 'Time', '$location', '$rootScope', function (Upcoming, Time, $location, $rootScope){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/static/fe/scripts/directives/featured.html',
    scope: {
    },
    link: function(scope, element, attrs) {
      var t = Time.semestYear();
      scope.year = t.year;
      scope.semester = t.semester;
      scope.select = function(id) {
        console.log('featured, select: ', id);
        $rootScope.$emit('select-offering', id);
      };
      console.log('about to get upcoming');
      Upcoming.getUpcoming(scope.year, scope.semester, function(data){
        console.log('got upcoming', data);
        scope.upcoming = data;
      });
    }
  };
}]);