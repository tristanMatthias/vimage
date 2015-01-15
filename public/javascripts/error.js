(function() {
    angular
        .module('app', [])
        .controller('AppController', AppController);

    function AppController($rootScope) {
        $rootScope.user = user;
    }

})();