( function() {
    angular
        .module("app.messages")
        .directive( "messageFeed", MessageFeedDirective )

    function MessageFeedDirective($timeout ) {
        return {
            restrict: "E",
            templateUrl: "/app/view/messageFeed",
            controllerAs: "vm",
            scope: {
                imageID:  "=imageId",
                messages: "=messages"
            },
            link: function( scope, elem, attrs ) {

            },
            controller: function($scope, $http, $element ) {
                vm = this;
                vm.type = "chat";
                $scope.user = user;
                $scope.msg = "";
                var feed = $element[0].getElementsByClassName( "feed" )[0];

                $scope.shift = false;
                // User sends a new message
                $scope.send = function() {
                    if ($scope.msg.length > 0 ) {
                        addMessage( $scope.msg );
                        $scope.msg = "";
                    }
                }
                $scope.keyDown = function( event ) {
                    if ( event.keyCode === 16 ) return $scope.shift = true;
                }
                $scope.keyUp = function( event ) {
                    if ( event.keyCode === 16 ) $scope.shift = false;
                    if ( event.keyCode === 13 && ! $scope.shift ) return $scope.send();
                }

                // Adds a message to the model, from either user sending, or from incoming message
                function addMessage( data ) {
                    $scope.messages.new( data );
                    setTimeout( function() {
                        feed.scrollTop = feed.scrollHeight;
                    } );
                }
            }
        }
    }
    

})();