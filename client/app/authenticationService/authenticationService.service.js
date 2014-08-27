'use strict';

angular.module('tragApp')
.factory('authenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
});
