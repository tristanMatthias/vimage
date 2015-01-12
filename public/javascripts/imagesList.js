var app = angular.module("app");

app.controller("ImagesListCtrl", function($scope, Image, $filter){
    $scope.images = Image.query();
    $scope.delete = function(id) {
        Image.delete({id:id}, function(e) {
            // console.log($filter("filter")($scope.images, {_id:id}));
            console.log($scope.images.length)
            $scope.images = $scope.images.filter(function(image) {
                return image._id != id;
            })
            console.log($scope.images.length)
            
        })
    }
})

app.factory('Image',function($resource, $http, $upload) {
    var r = $resource("/api/v1/image/:id", {}, {
        save: {
            transformRequest: function(data) {
                console.log($param);
            }
        }
    });
    // r.upload = function() {
    //     alert(2);
    //     $http.post("/api/v1/image/", fd, {
    //         transformRequest: angular.identity,
    //         headers: {'Content-Type': undefined}
    //     });
    // }

    return r;
});


// app.config(function ($httpProvider) {
//     $httpProvider.defaults.transformRequest = function(data) {
//         if (data === undefined) return data;

//         var fd = new FormData();
//         angular.forEach(data, function(value, key) {
//             if (value instanceof FileList) {
//                 if (value.length == 1) {
//                     fd.append(key, value[0]);
//                 } else {
//                     angular.forEach(value, function(file, index) {
//                         fd.append(key + '_' + index, file);
//                     });
//                 }
//             } else {
//                 fd.append(key, value);
//             }
//         });

//         return fd;
//     }

//     $httpProvider.defaults.headers.post['Content-Type'] = undefined;
// });