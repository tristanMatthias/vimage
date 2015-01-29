(function() {
    angular
        .module('app')
        .directive("messageFeed", MessageFeedDirective)
        .factory("MessageService", MessageService)
        .factory('User', UserFactory);

    function MessageFeedDirective($timeout) {
        return {
            restrict: "E",
            templateUrl: "/app/view/messageFeed",
            scope: {
                imageID:  "=imageId",
                messages: "=messages"
            },
            link: function(scope, elem, attrs) {

            },
            controller: function($scope, $http, $element){
                $scope.user = user;
                $scope.msg = "";
                var feed = $element[0].getElementsByClassName("feed")[0];

                $scope.shift = false;
                // User sends a new message
                $scope.send = function() {
                    if ($scope.msg.length > 0) {
                        addMessage( $scope.msg );
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

                // Adds a message to the model, from either user sending, or from incoming message
                function addMessage( data ) {
                    $scope.messages.new(data);
                    setTimeout(function() {
                        feed.scrollTop = feed.scrollHeight;
                    });
                }
            }
        }
    }

    // Individual message to show in the feed
    function MessageService( $http, User ) {
        var self = this;
        this.socket = io();
        this.factory = {
            init: init,
            new: _new,
            messages: []
        };

        this.socket.on("chat message", _addMessage);

        function init( imageID ) {
            self.socket.emit( "reset" );
            self.socket.emit( "join", imageID );
            self.room = imageID;

            // Load the existing comments
            $http.get( "/api/v1/thread/" + imageID ).success( function( data ) {
                if ( data ) {
                    data.comments.forEach( function( message ) {
                        _addMessage( message )
                    });
                }
            } );
        }


        function _new(content) {
            var message = {
                _creator: user._id,
                content: content,
                date: new Date()
            };

            self.socket.emit( "chat message", self.room, message );
            _addMessage( message );
        }

        function _addMessage( message ) {
            if (typeof message._creator === "string") {
                User.get( { id: message._creator } ).$promise.then(function(_user) {
                    message._creator = _user;
                });
            }
            self.factory.messages.push( message );
        }


        return this.factory;
    }

    function UserFactory( $resource ) {
        return $resource("/api/v1/user/:id");
    }
    

})();