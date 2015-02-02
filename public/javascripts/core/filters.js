/**
 * app.core filters and config
 * @namespace Filters
 */
( function() {

    angular
        .module( "app.core" )
        .filter( "capitalize", capitalizeFilter )

    /**
     * @namespace app.core
     * @desc Capitalize the first letter filter
     * @memberOf Filters
     */
    function capitalizeFilter() {
        return function( input, all ) {
            return ( !!input ) ? 
                input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : 
                '';
        }
    }
} )();