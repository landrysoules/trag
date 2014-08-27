'use strict';

angular.module('tragApp')
.factory('tokenInterceptor', function ($q, $window, authenticationService) {
	return {
		request : function (config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},

		response : function (response) {
			return response || $q.when(response);
		}
	};
});
