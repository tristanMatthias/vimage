( function() {
    angular
        .module( "app.admin", [
            "ngRoute", 
            "ngResource",
            "app.core",
            "angularFileUpload"
        ] )
        
        .controller( "AppController", AppController )

    
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

} )();