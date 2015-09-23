// public/core.js
var oneNodeToFeedThemAll = angular.module('oneNodeToFeedThemAll', ['ngSanitize']);

function updateFeeds($scope, $http) {
  console.log('Interval');

  $http.get('/api/feeds')
    .success(function(data) {
        console.log(data);
        $scope.feedData = data;
        console.log(data);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
}

oneNodeToFeedThemAll.controller('mainController', ['$scope', '$http', function($scope, $http) {

  updateFeeds($scope, $http);

  setInterval(function() {
    updateFeeds($scope, $http);
  }, 10000);
}]);
