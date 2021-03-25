"use strict";

var app = angular.module('bugapp', [
  'ui.router',
])

.run(function($rootScope, $state) {
  $rootScope.$state = $state;
  
  console.log('Hello from app');
})
