/**
* Message Module
*
* List of phones
*/
var app = angular.module('app', ["ngRoute", "ngResource", "angularFileUpload"]);


app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/app/view/images-list",
            controller: "ImagesListCtrl"
        })
        .when("/images/:id", {
            templateUrl: "/app/view/image",
            controller: "ImageCtrl"
        })
        .when("/new-image", {
            templateUrl: "/app/view/image-new",
            controller: "ImageNewCtrl"
        })
        .otherwise({
            redirectTo: "/"
        });
}]);

app.controller('AppController', function($rootScope) {
    $rootScope.user = user;
});