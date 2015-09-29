// public/core.js
var oneNodeToFeedThemAll = angular.module('oneNodeToFeedThemAll',
  [
    'ngSanitize',
    'angularSpinner'
  ]
);

oneNodeToFeedThemAll.controller('mainController',
[
  '$scope', '$http', 'usSpinnerService',
  function($scope, $http, usSpinnerService) {
    $scope.toggleFacebook = true;
    $scope.toggleTwitter  = true;

    $scope.updateFeeds = function() {
      usSpinnerService.spin('spinner-1');

      $http({
        url: '/api/feeds',
        method: 'GET',
        params: {
          fb: $scope.toggleFacebook,
          tw: $scope.toggleTwitter
        }
      }).success(function(data) {
        usSpinnerService.stop('spinner-1');
        console.log(data);
        $scope.feedData = data;
        console.log(data);
      })
      .error(function(data) {
        usSpinnerService.stop('spinner-1');
        console.log('Error: ' + data);
      });
    }

    $scope.updateFeeds($scope, $http);

    setInterval(function() {
      $scope.updateFeeds($scope, $http);
    }, 10000);
  }
]);
