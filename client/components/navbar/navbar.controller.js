'use strict';

angular.module('tragApp')
.controller('NavbarCtrl', function ($scope, $location, $http, $window, authenticationService) {
	$scope.menu = [{
			'title' : 'Home',
			'link' : '/'
		}
	];

	$scope.isCollapsed = true;

	$scope.isActive = function (route) {
		return route === $location.path();
	};

	$scope.signin = function (user) {
		console.log('signin ' + user.username + '/' + user.password);
		$http.post('http://localhost:9000/api/auth', {
			username : user.username,
			password : user.password
		})
		.success(function (data, status, headers, config) {
			authenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
			$scope.message={'text':'You are now logged in', 'status':'ok'};
			
		})
		.error(function (data, status, headers, config) {
			$scope.message={'text':data, 'status':'ko'};
			
		});

	};

	$scope.signup = function (user) {
		console.log('signup');
		$http.post('http://localhost:9000/api/auth/signup', {
			username : user.username,
			password : user.password
		})
		.success(function (data, status, headers, config) {
			authenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
			$scope.message={'text':'Profile successfully created', 'status':'ok'};
			
		})
		.error(function (data, status, headers, config) {
			$scope.message={'text':data, 'status':'ko'};
			
		});
	};

});
