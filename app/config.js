define([], function() {

	'use strict';

	function config($routeProvider) {

		$routeProvider
			.when('/home', {
				templateUrl: 'views/home.html',
				controller: 'ideasHomeController'
			})
			.when('/details/:id', {
				templateUrl: 'views/ideaDetails.html',
				controller: 'ideaDetailsController'
			})
			.otherwise({
				redirectTo: '/home'
			});
	}

	config.$inject = ['$routeProvider'];

	return config;
});