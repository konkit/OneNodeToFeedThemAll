// public/core.js
var oneNodeToFeedThemAll = angular.module('oneNodeToFeedThemAll', ['ngSanitize']);



oneNodeToFeedThemAll.controller('mainController', ['$scope', '$http', function($scope, $http) {
  $scope.toggleFacebook = true;
  $scope.toggleTwitter  = true;
  $scope.$apply();

  $scope.updateFeeds = function() {
    console.log('Interval');

    $http({
      url: '/api/feeds',
      method: 'GET',
      params: {
        fb: $scope.toggleFacebook,
        tw: $scope.toggleTwitter
      }
    }).success(function(data) {
      console.log(data);
      $scope.feedData = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  }

  $scope.updateFeeds($scope, $http);

  setInterval(function() {
    $scope.updateFeeds($scope, $http);
  }, 10000);
}]);
