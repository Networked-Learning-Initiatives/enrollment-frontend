'use strict';

angular.module('enrollmentFrontendApp').controller('OfferingsCtrl', ['$scope', '$routeParams', 'ngTableParams', '$filter', '$rootScope', '$location', '$timeout', function ($scope, $routeParams, ngTableParams, $filter, $rootScope, $location, $timeout) {
  // console.log($routeParams);

  console.log($scope.searchQuery);
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

  if ($routeParams.hasOwnProperty('query') && $routeParams.query.length > 0) {
    console.log($routeParams.query);
    $scope.searchQuery = $routeParams.query;
  }

  $scope.offerings = {
    1: {
      id:1,
      date:'August 27',
      datetime: '2014-08-27',
      day: 'Monday',
      time: '1-2pm', 
      title: 'ePortfolio Student Showcase1',
      theme: 'Engaging Learners',
      sponsor: 'ATEL',
      leader: 'Summers, Teggin',
      location: 'TBD',
      expanded: false, 
      description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
      credits: 1
    },
    2: {
      id:2,
      date:'August 28',
      datetime: '2014-08-28',
      day: 'Tuesday',
      time: '1-2pm', 
      title: 'Fieldtrip to the Future',
      theme: 'Engaging Learners',
      sponsor: 'TEAL',
      leader: 'G, Karen',
      location: 'TBD',
      expanded: false, 
      description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
      credits: 1
    },
    3: {
      id:3,
      date:'August 29',
      datetime: '2014-08-29',
      day: 'Wednesday',
      time: '1-2pm', 
      title: "Photoshoppin'",
      theme: 'Engaging Learners',
      sponsor: 'Libraries',
      leader: 'Walker, Jacques',
      location: 'TBD',
      expanded: false, 
      description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
      credits: 1
    },
    4: {
      id:4,
      date:'August 30',
      datetime: '2014-08-30',
      day: 'Thursday',
      time: '1-2pm', 
      title: 'Scholar for Scholars',
      theme: 'Engaging Learners',
      sponsor: 'IT',
      leader: 'Pokorski, Dale',
      location: 'TBD',
      expanded: false, 
      description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
      credits: 1
    },
    5: {
      id:5,
      date:'August 31',
      datetime: '2014-08-31',
      day: 'Friday',
      time: '1-2pm', 
      title: "Yammerin'",
      theme: 'Engaging Learners',
      sponsor: 'PBL',
      leader: 'English, Mary',
      location: 'TBD',
      expanded: false, 
      description: '"So did I, madam, and I am excessively disappointed.  The Carnatic, its repairs being completed, left Hong Kong twelve hours before the stated time, without any notice being given; and we must now wait a week for another steamer." As he said "a week" Fix felt his heart leap for joy.  Fogg detained at Hong Kong for a week!  There would be time for the warrant to arrive, and fortune at last favoured the representative of the law.  His horror may be imagined when he heard Mr. Fogg say, in his placid voice, "But there are other vessels besides the Carnatic, it seems',
      credits: 1
    }      
  };

  $scope.filteredData = $scope.offerings;

  function objIdxById(id, arr) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  if ($routeParams.hasOwnProperty('offering')) {
    console.log($routeParams);
    $scope.offerings[$routeParams.offering].expanded = true;
    $scope.currentOffering = $scope.offerings[$routeParams.offering];
    $timeout(function(){
      window.scrollTo(0,angular.element('#'+$routeParams.offering)[0].offsetTop+245);
    }, 1);
  }
  

  // if ($routeParams.hasOwnProperty('offeringid') && $routeParams.offeringid.length > 0) {
  //   var idx = objIdxById($routeParams.offeringid, $scope.filteredData);
  //   if (idx >= 0) {
  //     $scope.select($scope.filteredData[idx]);
  //     console.log($routeParams.offeringid);
  //     $timeout(function(){
  //       console.log('HEEEEEY');
  //       console.log(angular.element('#'+$routeParams.offeringid));
  //       console.log(angular.element('#'+$routeParams.offeringid)[0].offsetTop);
  //       window.scrollTo(0,angular.element('#'+$routeParams.offeringid)[0].offsetTop+260);
  //     }, 1);
  //     // window.scrollTo(0,angular.element('#'+$routeParams.offeringid).offsetTop+260);
  //   }
  // }

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

        // $scope.filteredData = $filter('filter')($scope.offerings,$scope.searchQuery, function(actual, expected) {
        //   console.log(actual, expected);
        //   var idx = actual.toString().toLowerCase().indexOf(expected);
        //   return idx > -1;
        // });          
      }
      // else { //maybe don't need else bc of assigning to offerings before filtering every time

      // } 
      // var orderedData = params.sorting() ? $filter('orderBy')($scope.filteredData, params.orderBy()) : $scope.filteredData;
      var orderedData = $scope.filteredData;
      // console.log(orderedData);
      $defer.resolve(orderedData);
      // $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  var offeringsCtrlScope = $scope;
  $rootScope.$on('query', function(evt, arg){
    console.log(arg);
    offeringsCtrlScope.searchQuery = arg;
    offeringsCtrlScope.tableParams.reload();
  });
}]);
