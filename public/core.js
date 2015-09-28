// public/core.js
var oneNodeToFeedThemAll = angular.module('oneNodeToFeedThemAll',
  [
    'ngSanitize'
  ]
);

function updateFeeds($scope, $http) {
  $http.get('/api/feeds')
    .success(function(data) {
      $scope.feedData = data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
}

function fetchRssFeeds($scope, $http) {
  $http.get('/api/rssFeeds')
    .success(function(data) {
      $scope.userRssFeeds = data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
}

oneNodeToFeedThemAll.controller('mainController', ['$scope', '$http', function($scope, $http) {
  updateFeeds($scope, $http);
  fetchRssFeeds($scope, $http);

  $scope.addNewRssFeed = function() {
    $scope.rssAlert = null;
    $http.post('/api/rssFeeds', {url: $scope.newRssFeedUrl}, {dataType: "json"} )
      .success(function(data) {
        fetchRssFeeds($scope, $http);
      })
      .error(function(data) {
        $scope.rssAlert = data.error.message;
      });
  }

  $scope.removeNewRssFeed = function(valueToRemove) {
    $scope.rssAlert = null;
    $http.post('/api/rssFeeds/remove', {url: valueToRemove}, {dataType: "json"} )
      .success(function(data) {
        fetchRssFeeds($scope, $http);
      })
      .error(function(data) {
        console.log('error: '); console.log(data);
      });
  }

  setInterval(function() {
    updateFeeds($scope, $http);
  }, 10000);
}]);
