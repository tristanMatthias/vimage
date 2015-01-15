(function() {
    angular
        .module('app', [
            "ngRoute", 
            "ngResource",
            'angularFileUpload'
        ])
        .config(AppConfig)
        .controller('AppController', AppController)
        .factory('UserFactory', UserFactory);


    function AppConfig($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/admin/view/users",
                controllerAs: "vm"
            })
            .otherwise({
                redirectTo: "/"
            });
    }
    function AppController($rootScope, $scope, UserFactory) {
        $rootScope.user      = user;
        $scope.order         = false;
        $scope.column        = "name";
        $scope.isEditing     = isEditing;
        $scope.toggleEditing = toggleEditing;
        $scope.sort          = sort;
        $scope.editing       = null;

        UserFactory.query(function(data) {
            $scope.users = data;
        });

        function isEditing(user) {
            return $scope.editing == user;
        }
        function toggleEditing(user) {
            $scope.editing = (isEditing(user)) ? null : user;
        }

        function sort(column) {
            console.log((column == $scope.column), !$scope.order);
            $scope.order = (column == $scope.column) ? !$scope.order : false;
            $scope.column = column;
        }
    }

    function UserFactory($resource) {
        return $resource("/api/v1/user/:id", {}, {
            save:   { method:'put',    params: {id: '@_id'} },
            delete: { method:'delete', params: {id: '@_id'} }

        });
    }

})();