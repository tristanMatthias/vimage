(function() {
    angular
        .module("app.login")
        .controller("LoginController", LoginController);

    function LoginController($http, $window)  {
        var vm = this;
        vm.user = {
            email: "tristan@vuid.com",
            password: "asd"
        }
        vm.error = "";
        if (flash.error) vm.error = flash.error[0];
        vm.submit = submit;


        function submit() {
            $http.post("/login", vm.user)
                .success(function(data) {
                    console.log("HERE");
                    vm.error = "";
                    window.location = "/";
                })
                .error(function(err) {
                    console.log(err);
                    vm.error = err.message;
                    vm.errorField = err.field;
                });
        }
    }
})();