'use strict';
angular.module('enrollmentFrontendApp').directive('modalEmail', ['User', '$location', '$window', '$rootScope', '$http', '$cookies', function (User, $location, $window, $rootScope, $http, $cookies){
  return {
    restrict: 'E',
    replace: true,
    scope:{},
    templateUrl: '/static/fe/scripts/directives/modal-email.html',
    link: function(scope, element, attrs) {
      scope.toAll = true;
      var modalEmailScope = scope;
      modalEmailScope.recipients=[];
      modalEmailScope.recipientsBackUp=[];
      modalEmailScope.instructors = [];
      modalEmailScope.coordinators = [];
      modalEmailScope.learners = [];
      modalEmailScope.waitlisted = [];
      $rootScope.$on('email-modal', function(evt, data){
        console.log('$on email-modal', data);

        var section = data.section;
        modalEmailScope.sectionId = section.id;
        console.log(section);
        for (var i=0; i<section.enrollment_set.length; i++) {
          section.enrollment_set[i].user.selected = true;
          modalEmailScope.recipients.push(section.enrollment_set[i].user.id);
          if (section.enrollment_set[i].waitlisted) {
            modalEmailScope.waitlisted.push(section.enrollment_set[i].user);
          }
          else {
            modalEmailScope.learners.push(section.enrollment_set[i].user); 
          }
        }
        console.log(modalEmailScope.waitlisted);
        console.log(modalEmailScope.learners);
        for (var i=0; i<section.instructors.length; i++) {
          modalEmailScope.recipients.push(section.instructors[i].id);
          section.instructors[i].selected = true;
        }
        modalEmailScope.instructors = section.instructors;
        console.log(modalEmailScope.instructors);

        for (var i=0; i<section.coordinator_set.length; i++) {
          modalEmailScope.recipients.push(section.coordinator_set[i].user.id);
          section.coordinator_set[i].user.selected = true;
          modalEmailScope.coordinators.push(section.coordinator_set[i].user);
        }
        console.log(modalEmailScope.coordinators);
        modalEmailScope.recipientsBackUp = modalEmailScope.recipients.slice(0);
        scope.subject='';
        scope.body='';
        $('#'+element[0].id).modal('show');
      });

      // $()

      $(document).on('keydown', function(event) {
        // console.log('keydown', event.which);
        if (event.which == 27) {
          // scope.close();
          $('#close-modal-email').click();
        }
      });

      scope.toggleToAll = function() {
        scope.toAll = !scope.toAll;
        if (!scope.toAll) {
          scope.recipients = [];
        }
        else {
          modalEmailScope.recipients = modalEmailScope.recipientsBackUp.slice(0);
        }
        for (var i=0; i<modalEmailScope.instructors.length; i++) {
          modalEmailScope.instructors[i].selected = scope.toAll;
        }
        for (var i=0; i<modalEmailScope.coordinators.length; i++) {
          modalEmailScope.coordinators[i].selected = scope.toAll;
        }
        for (var i=0; i<modalEmailScope.learners.length; i++) {
          modalEmailScope.learners[i].selected = scope.toAll;
        }
        for (var i=0; i<modalEmailScope.waitlisted.length; i++) {
          modalEmailScope.waitlisted[i].selected = scope.toAll;
        }
      }

      scope.close = function() {
        $('#'+element[0].id).modal('hide');
        console.log('hide modal event caught right here', $location.search());
      };


      scope.toggle = function(id, val) {
        console.log(id, val);
        if (val) {
          scope.recipients.splice(scope.recipients.indexOf(id), 1);
        }
        else {
          scope.recipients.push(id);
        }
      };

      scope.emailFromModal = function() {
        console.log('email');
        var url = '/api/mail/';
        var data = $.param({
          csrfmiddlewaretoken: $cookies.csrftoken,
          emaileeids: scope.recipients, 
          mailsubject: scope.subject,
          mailcontent: scope.body,
          section: scope.sectionId
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
          console.log('sent email?!');
            $('#'+element[0].id).modal('hide');
        }).error(function(){
          console.log('error sending email');
          $('#'+element[0].id).modal('hide');
        });
      };
    }
  };
}]);