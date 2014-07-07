'use strict';

angular.module('enrollmentFrontendApp').controller('OfferingsCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', '$location', '$timeout', '$http', 'Upcoming', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout, $http, Upcoming) {
  console.log($scope.searchQuery);
  var offeringsCtrlScope = $scope;
  $scope.currentOffering = [];
  $scope.isActive = function(query) {
    console.log(query);
    console.log($routeParams.semester);
    console.log($routeParams.semester == query);
    if($routeParams.hasOwnProperty('semester')&& $routeParams.semester == query) {
      return true;
    }
    return false;
  };

  $scope.semester = function() {
    if ($routeParams.hasOwnProperty('semester')) {
      return $routeParams.semester;
    }
    else {
      return "fall";
    }
  }

  $scope.$on('$routeUpdate', function(scope, next, current) {
    console.log('route updated');
  });

  $scope.select = function(offering) {
    console.log($scope.currentOffering);
    if ($scope.currentOffering.hasOwnProperty('expanded')) {
      $scope.currentOffering.expanded = false;
    }
    $scope.currentOffering = offering;
    offering.expanded = true;
    $location.search({offering:offering.id});
  };

  function dataLoaded() {
    selectOffering()
  }

  function selectOffering() {
    if ($routeParams.hasOwnProperty('query') && $routeParams.query.length > 0) {
      console.log($routeParams.query);
      offeringsCtrlScope.searchQuery = $routeParams.query;
    }

    if ($routeParams.hasOwnProperty('offering')) {
      console.log($routeParams);
      offeringsCtrlScope.offerings[objIdxById($routeParams.offering, offeringsCtrlScope.offerings)].expanded = true;
      offeringsCtrlScope.currentOffering = offeringsCtrlScope.offerings[objIdxById($routeParams.offering, offeringsCtrlScope.offerings)];
      $timeout(function(){
        window.scrollTo(0,angular.element('#'+$routeParams.offering)[0].offsetTop+245);
      }, 1);
    }
  }

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  

  $scope.offerings = [];

  function parseOfferings (responseObject) {
    var parsedOfferings = [];
    for (var i=0; i<responseObject.results.length; i++) {
      console.log(responseObject.results[i]);
      var date = new Date(responseObject.results[i].start_time);
      var minutes = date.getMinutes();
      if (minutes<10) {
        minutes = '0'+minutes;
      }
      var themes = [];
      for (var j=0; j<responseObject.results[i].section.course.themes.length; j++) {
        themes.push(responseObject.results[i].section.course.themes[j].name)
      }
      var instructors = [];
      for (var j=0; j<responseObject.results[i].section.instructors.length; j++) {
        instructors.push(responseObject.results[i].section.instructors[j].last_name+', '+responseObject.results[i].section.instructors[j].first_name.substr(0,1) + '.');
      }
      var parsedLocation = 'N/A';
      if (responseObject.results[i].hasOwnProperty('location') && responseObject.results[i].location != null && responseObject.results[i].location.hasOwnProperty('building')) {
        parsedLocation = responseObject.results[i].location.building;
        if (responseObject.results[i].location.hasOwnProperty('room_number')) {
          parsedLocation += ' ' + responseObject.results[i].location.room_number;
        }
      }
      var offering = {
        id: responseObject.results[i].section.id,
        date: months[date.getMonth()] + ' ' + date.getDate(),
        datetime: date.getTime(),
        day: days[date.getDay()],
        time: date.getHours() + ':' + minutes,
        title: responseObject.results[i].section.course.title,
        theme: themes.join(', '),
        sponsor: 'NLI',
        leader: instructors.join(', '),
        location: parsedLocation,
        expanded: false,
        description: responseObject.results[i].section.course.description.substr(0,50),
        credits: responseObject.results[i].section.course.credit_count
      };
      parsedOfferings.push(offering);
    }
    return parsedOfferings;
  }

  function resultsSuccessCallback(data, status, headers, config) {
    console.log('SUCCESSSS!');
    console.log(data);
    // this callback will be called asynchronously
    // when the response is available
    offeringsCtrlScope.response = data;
    
    var parsed = parseOfferings(offeringsCtrlScope.response);
    if (offeringsCtrlScope.offerings.length < 1) {
      offeringsCtrlScope.offerings = parseOfferings(offeringsCtrlScope.response);
    }
    else {
      // var clone = offeringsCtrlScope.offerings.slice(0);
      for (var i=0; i<parsed.length; i++) {
        offeringsCtrlScope.offerings.push(parsed[i]);
      }
    }
    console.log(offeringsCtrlScope.offerings);
    offeringsCtrlScope.tableParams.reload();
    if (data.hasOwnProperty('next') && data.next != null && data.next.length>0) {
      $http({method: 'GET', url: data.next}).
        success(resultsSuccessCallback).
        error(function(data, status, headers, config) {
          console.log('FAIL!');
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
    else {
      dataLoaded();
    }
  }

  $scope.upcomingService = Upcoming;

  $scope.filteredData = $scope.offerings;

  function objIdxById(id, arr) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  function tableFilter (query, items) {
    var filteredResults = [];
    for (var i=0; i<items.length; i++) {
      var item = items[i];
      for (var prop in item) {
        if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filteredResults.push(item);
          break;
        }
      }
    }
    console.log(filteredResults);
    return filteredResults;
  }

  $scope.tableParams = new ngTableParams({
    count: 1000,          // count per page
    sorting: {
        datetime: 'asc'     // initial sorting
    }
  }, {
    counts: [],
    total: $scope.offerings.length, 
    getData: function($defer, params) {
      console.log('gettingData');
      $scope.filteredData = $scope.offerings;
      if ($scope.hasOwnProperty('searchQuery') && $scope.searchQuery.length>0) {
        console.log('gonna filter');
        $scope.filteredData = tableFilter($scope.searchQuery, $scope.filteredData, params.orderBy());    
      }
      console.log($scope.filteredData);
      console.log(params.sorting());
      var orderedData = params.sorting() ? $filter('orderBy')($scope.filteredData, params.orderBy()) : $scope.filteredData;
      console.log(orderedData);
      // var orderedData = $scope.filteredData;

      $defer.resolve(orderedData);
    }
  });

  $http({method: 'GET', url: '/meetings/', params:{year: $routeParams.year, semester: $scope.semester()}}).
    success(resultsSuccessCallback).
    error(function(data, status, headers, config) {
      console.log('FAIL!');
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  $rootScope.$on('query', function(evt, arg){
    console.log(arg);
    offeringsCtrlScope.searchQuery = arg;
    offeringsCtrlScope.tableParams.reload();
  });
}]);
