define([], function(app) {
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