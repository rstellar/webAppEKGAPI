;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ui.router'
  ])

  .run(function($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isAuth()){
        // User isn’t authenticated but the state requires authentication
        $state.transitionTo('signin');
        event.preventDefault(); 
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        authenticate: true
      })

      .state('signin', {
        url: '/signin',
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/auth/signup.html',
        controller: 'AuthController'
      });

    // the default route should point to the home page
    // which contains the graphs
    $urlRouterProvider.otherwise('/home');

    //We add $httpInterceptor into the array
    $httpProvider.interceptors.push('AttachTokens');

  })

  .factory('AttachTokens', function ($window) {
    // this is an $httpInterceptor. its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.ekgtracker');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  });
})();