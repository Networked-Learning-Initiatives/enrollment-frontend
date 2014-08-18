'use strict';

angular.module('enrollmentFrontendApp').controller('HelpCtrl', [
  '$scope', 
function ($scope) {

  $scope.tasks = [
    {
      title: 'Enroll in a Course',
      description: "You'd like to find a course that interests you and enroll in it.",
      steps: [
        {
          content: 'From the appropriate offerings page (e.g. <a href="#/offerings" target="_blank">Fall Offerings</a>), scroll through the courses, or enter text into the search box. ',
          steps: [
            'In the search box, you can search by leader, theme, location, title, and description.'
          ]
        },
        {
          content: "When clicked, each course will provide more information and an Enroll link.",
          steps: [
            "If you are not logged in, there will be lock icons on the buttons on the page. Once you click those buttons, you will be able to login so that you can then perform the desired action (i.e. enroll, uneroll)."
            "If a course is full, you will be unable to enroll, but can instead join the waitlist",
            'For courses that offer online enrollment, you can click "Enroll in Webex" to enroll in the online offering. For such courses, you can attend the course from your own computer, by joining the webex session at the appropriate time. More details on joining a WebEx session can be found on <a href="https://webex.tlos.vt.edu/" target="_blank">the WebEx help page.</a>'
          ]
        },
        {
          content: 'Once you have enrolled in the course, you will find it listed in <a href="#/schedule" target="_blank">your schedule</a>.',
          steps: []
        }
      ]
    }
  ];  

}]);