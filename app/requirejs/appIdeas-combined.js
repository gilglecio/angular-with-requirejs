define('app/config',[], function() {

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
define('app/ideasDataSvc',[], function(app) {
    'use strict';

    function factoryFunc($http, $resource) {

        var Ideas = $resource('/api/ideas/:id', {
            id: '@id'
        });

        function allIdeas() {
            return Ideas.query().$promise;
        }

        function ideaDetails(id) {
            return Ideas.get({
                id: id
            }).$promise;
        }

        return {
            allIdeas: allIdeas,
            ideaDetails: ideaDetails
        };
    }

    factoryFunc.$inject = ['$http', '$resource'];

    return factoryFunc;
});
define('app/ideasHomeController',[], function() {

    'use strict';

    function ideasHomeController($scope, ideasDataSvc) {

        $scope.ideaName = "Todo List";

        $scope.gridOptions = {
            data: 'ideas',
            columnDefs: [{
                field: 'name',
                displayName: 'Name'
            }, {
                field: 'technologies',
                displayName: 'Technologies'
            }, {
                field: 'platform',
                displayName: 'Platforms'
            }, {
                field: 'status',
                displayName: 'Status'
            }, {
                field: 'devsNeeded',
                displayName: 'Vacancies'
            }, {
                field: 'id',
                displayName: 'View Details',
                cellTemplate: '<a ng-href="#/details/{{row.getProperty(col.field)}}">View Details</a>'
            }],
            enableColumnResize: true
        };

        ideasDataSvc.allIdeas().then(function(result) {
            $scope.ideas = result;
            console.log($scope.ideas);
        });
    }

    ideasHomeController.$inject = ['$scope', 'ideasDataSvc'];

    return ideasHomeController;
});
define('app/ideaDetailsController',[], function(app) {

	'use strict';

	function ideaDetailsController($scope, $routeParams, ideasDataSvc) {

		ideasDataSvc.ideaDetails($routeParams.id).then(function(result) {
			$scope.ideaDetails = result;
		});
	}

	ideaDetailsController.$inject = ['$scope', '$routeParams', 'ideasDataSvc'];

	return ideaDetailsController;
});
define('app/ideasModule',[
        'app/config',
        'app/ideasDataSvc',
        'app/ideasHomeController',
        'app/ideaDetailsController'
    ],

    function(config, ideasDataSvc, ideasHomeController, ideaDetailsController) {

        'use strict';

        var app = angular.module('ideasApp', ['ngRoute', 'ngResource', 'ngGrid']);

        app.config(config);
        app.factory('ideasDataSvc', ideasDataSvc);
        app.controller('ideasHomeController', ideasHomeController);
        app.controller('ideaDetailsController', ideaDetailsController);
    });
require([
		'app/ideasModule'
	],
	function() {
		'use strict';

		angular.bootstrap(document, ['ideasApp']);
	}
);
define("main", function(){});

