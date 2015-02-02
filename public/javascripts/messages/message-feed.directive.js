( function() {
    angular
        .module("app.messages")
        .directive( "messageFeed", MessageFeedDirective )

    function MessageFeedDirective( $timeout ) {
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
                vm.user = user;
                vm.msg = "";
                vm.showingType = "chat";

                vm.send    = send;
                vm.keyDown = keyDown;
                vm.keyUp   = keyUp;
                
                var feed  = $element[0].getElementsByClassName( "feed" )[0];
                var shift = false;

                // User sends a new message
                function send() {
                    if ( vm.msg.length > 0 ) {
                        addMessage( vm.msg );
                        vm.msg = "";
                    }
                }
                function keyDown( event ) {
                    if ( event.keyCode === 16 ) return shift = true;
                }
                function keyUp( event ) {
                    if ( event.keyCode === 16 ) shift = false;
                    if ( event.keyCode === 13 && ! shift ) return vm.send();
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