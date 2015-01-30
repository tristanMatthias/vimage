( function() {
    angular
        .module("app.admin")
        .config(AdminConfig);

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
    
} )();