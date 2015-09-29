// public/core.js
var oneNodeToFeedThemAll = angular.module('oneNodeToFeedThemAll',
  [
    'ngSanitize',
    'angularSpinner',
    'ngTextTruncate'
  ]
);

function fetchRssFeeds($scope, $http) {
  $http.get('/api/rssFeeds')
    .success(function(data) {
      $scope.userRssFeeds = data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
}

oneNodeToFeedThemAll.controller('mainController',
[
  '$scope', '$http', 'usSpinnerService',
  function($scope, $http, usSpinnerService) {
    $scope.toggleFacebook = true;
    $scope.toggleTwitter  = true;
    $scope.currentLimit = 50;

    $scope.updateFeeds = function() {
      usSpinnerService.spin('spinner-1');

      $http({
        url: '/api/feeds',
        method: 'GET',
        params: {
          fb: $scope.toggleFacebook,
          tw: $scope.toggleTwitter,
          limit: $scope.currentLimit
        }
      }).success(function(data) {
        usSpinnerService.stop('spinner-1');
        $scope.feedData = data;
      })
      .error(function(data, status) {
        if( status == 401) {
          return window.location.reload();
        }
        usSpinnerService.stop('spinner-1');
        console.log('Error: ' + data);
      });
    }

    $scope.morePosts = function() {
      $scope.currentLimit += 50;
      $scope.updateFeeds();
    }

    $scope.addNewRssFeed = function() {
      $scope.rssAlert = null;
      $http.post('/api/rssFeeds', {url: $scope.newRssFeedUrl}, {dataType: "json"} )
        .success(function(data) {
          $scope.newRssFeedUrl = "";
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

    $scope.updateFeeds($scope, $http);

    setInterval(function() {
      $scope.updateFeeds($scope, $http);
    }, 30000);
  }
]);
