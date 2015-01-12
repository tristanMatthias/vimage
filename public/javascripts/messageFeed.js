/**
* messageFeed Module
*
* Sidebar message thread
*/
var app = angular.module('app');

app.directive("messageFeed", function($timeout) {
    return {
        restrict: "E",
        templateUrl: "/app/view/messageFeed",
        scope: {
            imageID: "=imageId"
        },
        link: function(scope, elem, attrs) {
            $timeout(function() {
                scope.rendered();
            }, 100); // TODO: remove hack on dom waiting
        },
        controller: function($scope, $http, $element, Message){
            $scope.user = user;
            $scope.msg = "";
            $scope.messages = [];
            var feed = $element[0].getElementsByClassName("feed")[0];

            $scope.shift = false;
            // User sends a new message
            $scope.send = function() {
                if ($scope.msg.length > 0) {
                    addMessage({
                        user_id: user._id,
                        name: user.name,
                        content: $scope.msg, 
                        date: new Date()
                    }, $scope.socket);
                    $scope.msg = "";
                }
            }
            $scope.keyDown = function(event) {
                if (event.keyCode === 16) return $scope.shift = true;
            }
            $scope.keyUp = function(event) {
                if (event.keyCode === 16) $scope.shift = false;
                if (event.keyCode === 13 && ! $scope.shift) return $scope.send();
            }

            $scope.rendered = function() {
                $scope.socket = io();
                $scope.socket.emit("reset");
                $scope.socket.emit("join", $scope.imageID)
                // Someone sends a message
                $scope.socket.on("chat message", addMessage);

                $http.get("/api/v1/thread/" + $scope.imageID).success(function(data) {
                    if (data) {
                        data.comments.forEach(function(message) {
                            addMessage(message)
                        });
                    }
                })
            }

            // Adds a message to the model, from either user sending, or from incoming message
            function addMessage(data, socket) {
                $scope.messages.push( new Message($scope.imageID, data, socket) );
                setTimeout(function() {
                    feed.scrollTop = feed.scrollHeight;
                })
            }
        }
    }
});


// Individual message to show in the feed
app.factory("Message", function(User) {
    function Message(room, data, socket) {
        this.init = function() {
            var self = this;

            // Expose data
            this.content = data.content;
            this.user_id = data.user_id;
            this.date    = data.date;
            this.room = room;


            if (!data.name) {
                User.get({id: data.user_id}, function(data) {
                    self.name = data.name;
                    if (socket) self.emit(socket);
                });
            } else {
                this.name = name;
                this.user_id = data.user_id;
                if (socket) this.emit(socket);
            }

        }
        this.emit = function(socket) {
            socket.emit("chat message", this.room, {
                user_id: this.user_id,
                content: this.content,
                date: this.date
            });
        }
        this.init();
    }
    return Message;
});

app.factory('User', [
    '$resource', 
    function($resource) {
        return $resource("/api/v1/user/:id");
    }
]);