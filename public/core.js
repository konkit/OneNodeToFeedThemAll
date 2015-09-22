// public/core.js
var scotchTodo = angular.module('oneNodeToFeedThemAll', []);

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

function mainController($scope, $http) {

  updateFeeds($scope, $http);

  setInterval(function() {
    updateFeeds($scope, $http);
  }, 10000);
}
