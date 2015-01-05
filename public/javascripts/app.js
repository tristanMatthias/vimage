/**
* Message Module
*
* List of phones
*/
var app = angular.module('app', ["ngRoute", "ngResource"]);


app.config(['$routeProvider',function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/view/images-list",
            controller: "ImagesListCtrl"
        })
        .when("/images/:id", {
            templateUrl: "/view/image",
            controller: "ImageCtrl"
        })
        .when("/new-image", {
            templateUrl: "/view/image-new",
            controller: "ImageNewCtrl"
        })
        .otherwise({
            redirectTo: "/"
        });
}]);

app.controller('AppController', function($rootScope) {
    $rootScope.user = user;
});