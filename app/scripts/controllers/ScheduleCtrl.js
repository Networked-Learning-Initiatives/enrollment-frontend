'use strict';

angular.module('enrollmentFrontendApp').controller('ScheduleCtrl', function ($scope, $routeParams, ngTableParams, $filter, $rootScope) {
	console.log($routeParams);
	$scope.schedule = [
		{title: 'Making Learning Visible Through Sustained Student Engagement', start: 'April 9, 2014', startdt:'2014-4-9', end: 'April 09, 2014', enddt:'2014-4-9',	theme: 'None',	credits: '1',	section: 366},
		{title: 'Field Trip to the Future - the Visionarium', start: 'March 7, 2014', startdt: '20143-7', end: 'March 7, 2014', enddt: '2014-3-7',	theme: 'None',	credits: '1',	section: 431},
		{title: 'University Libraries - Best Websites for Teaching and Instruction', start: 'March 3, 2014', end: 'March 03, 2014',	startdt: '2014-3-3', enddt: '2014-3-3', theme: 'None',	credits: '1',	section: 335},
		{title: 'Seven Technology Tools to Use in Your Teaching Today', start: 'Feb. 06, 2014', end: 'Feb. 6, 2014',	theme: 'None',	credits: '1',	section: 313},
		{title: 'Scholar - Engaging Students with Lessons', start: 'Feb. 4, 2014', end: 'Feb. 04, 2014', startdt: '2014-2-4', enddt: '2014-2-4',  theme: 'None',	credits: '1',	section: 387},
		{title: 'Designed Interaction Specialist Certificate', start: 'Feb. 4, 2014', end: 'April 15, 2014', startdt: '2014-2-4', enddt: '2014-2-4',  theme: 'Engaging Learners',	credits: '6*',	section: 430}
	];

	$scope.searchQuery = '';

	function tableFilter (query, dict, ordering) {
    var sortedResults = [];
    for (var key in dict) {
      if (dict.hasOwnProperty(key)) {
        var item = dict[key];
        for (var prop in item) {
          if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            sortedResults.push(item);
            break;
          }
        }
      }
    }
    return $filter('orderBy')(sortedResults, ordering);
  }

  $scope.tableParams = new ngTableParams({
    count: 1000,          // count per page
    sorting: {
        startdt: 'asc'     // initial sorting
    }
  }, {
  	counts: [],
    total: $scope.schedule.length, 
    getData: function($defer, params) {
      console.log('gettingData');
      $scope.filteredData = $scope.schedule;
      if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
        console.log('gonna filter');
        $scope.filteredData = tableFilter($scope.searchQuery, $scope.filteredData, params.orderBy());
      }
      var orderedData = $scope.filteredData;
      $defer.resolve(orderedData);
    }
  });

  var scheduleCtrlScope = $scope;
  $rootScope.$on('query', function(evt, arg){
    console.log(arg);
    scheduleCtrlScope.searchQuery = arg;
    scheduleCtrlScope.tableParams.reload();
  });
});